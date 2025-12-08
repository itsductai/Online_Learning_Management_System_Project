# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sql_generation import generate_sql
from mssql_operations import execute_query
import logging, time
from openai_helper import review_sql_with_gpt
from mssql_operations import get_schema
import asyncio

from memory_cache import add_to_cache  
from auto_suggestion import suggest as suggest_api 

# ===== Log gọn gàng =====
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("text2sql")

app = FastAPI(title="Text-to-SQL (T5 + MSSQL)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class QueryRequest(BaseModel):
    query: str

class SuggestRequest(BaseModel):
    prefix: str


@app.post("/search")
async def search(req: QueryRequest):
    q = req.query.strip()
    log.info("INPUT_NL: %s", q)

    # 1) sinh SQL
    sql = generate_sql(q)
    log.info("GEN_SQL: %s", sql)

    # 2) thử thực thi (nếu lỗi: trả về ok=false + error + sql)
    try:
        cols, rows = execute_query(sql)
        # lưu câu NL vào cache cho autocomplete
        await add_to_cache(q)
        return {"ok": True, "sql": sql, "columns": cols, "rows": rows}
    except Exception as e:
        log.exception("ERROR_WHEN_SEARCH")
        return {"ok": False, "sql": sql, "error": str(e)}

@app.post("/suggest")
async def suggest(req: SuggestRequest):
    prefix = req.prefix.strip()
    if not prefix:
        return {"suggestions": []}
    try:
        result = suggest_api(prefix)
        suggestions = [item[0] if isinstance(item, tuple) else item for item in result]
        return {"suggestions": suggestions}
    except Exception as e:
        log.exception("ERROR_WHEN_SUGGEST")
        return {"suggestions": [], "error": str(e)}


@app.get("/")
def root():
    return {"ok": True, "msg": "Use POST /search with {\"query\": \"...\"}"}

@app.get("/stats")
async def stats():
    return {
        "total": 0,
        "success": 0,
        "failed": 0,
        "success_rate": 0.0,
        "last_queries": [],
    }

@app.post("/search_gpt")
async def search_with_gpt(req: QueryRequest):
    """
    GPT Assist:
    - Input: câu hỏi ngôn ngữ tự nhiên (req.query).
    - Bước 1: dùng T5 sinh SQL (sql_t5) và thử thực thi trên CSDL giống API /search.
    - Bước 2: lấy schema thực từ MSSQL, gửi (câu hỏi + sql_t5 + schema) sang GPT để đánh giá:
        * Nếu câu hỏi vô nghĩa         → trả về lỗi, không dùng SQL nào.
        * Nếu SQL T5 hợp lý            → giữ kết quả đã chạy từ T5.
        * Nếu SQL T5 chưa ổn           → dùng fixed_sql GPT đề xuất, chạy lại trên DB.
    - Output:
        {
          "ok": bool,
          "sql": string,          // câu SQL cuối cùng được chọn (T5 hoặc GPT sửa)
          "original_sql": string, // câu SQL gốc do T5 sinh ra
          "columns": string[],
          "rows": object[],
          "error": string,        // rỗng nếu không lỗi
          "gpt_message": string,  // giải thích ngắn của GPT
          "sql_source": string    // "t5" | "gpt" | "gpt_failed" | "invalid_question" | ...
        }
    """
    q = req.query.strip()
    log.info("INPUT_NL_GPT: %s", q)

    # -------- 1) T5 sinh SQL + thử chạy trên DB (y như /search) --------
    try:
        sql_t5 = generate_sql(q)
    except Exception as e:
        log.exception("ERROR_WHEN_GENERATE_SQL_T5")
        return {
            "ok": False,
            "sql": "",
            "original_sql": "",
            "columns": [],
            "rows": [],
            "error": f"Lỗi mô hình T5 khi sinh SQL: {e}",
            "gpt_message": "",
            "sql_source": "t5_generate_error",
        }

    log.info("GEN_SQL_T5: %s", sql_t5)

    t5_ok = False
    t5_columns, t5_rows = [], []
    t5_error = ""

    try:
        t5_columns, t5_rows = execute_query(sql_t5)
        t5_ok = True
    except Exception as e:
        log.exception("ERROR_WHEN_EXEC_T5_SQL")
        t5_ok = False
        t5_error = str(e)

    # Lưu câu NL vào cache autocomplete (không để cache phá luồng)
    try:
        await add_to_cache(q)
    except Exception:
        log.exception("ERROR_WHEN_ADD_TO_CACHE")

    # -------- 2) GPT review với schema thực --------
    try:
        schema = get_schema()
        review = review_sql_with_gpt(q, sql_t5, schema)
    except Exception as e:
        log.exception("GPT_REVIEW_ERROR")
        # Nếu GPT lỗi thì vẫn trả về kết quả T5 (nếu có), để FE còn dùng được
        return {
            "ok": t5_ok,
            "sql": sql_t5 if t5_ok else "",
            "original_sql": sql_t5,
            "columns": t5_columns if t5_ok else [],
            "rows": t5_rows if t5_ok else [],
            "error": t5_error if not t5_ok else "",
            "gpt_message": f"Lỗi khi gọi GPT: {e}",
            "sql_source": "t5_gpt_failed",
        }

    log.info("GPT_REVIEW: %s", review)

    question_valid = bool(review.get("question_valid", True))
    should_replace = bool(review.get("should_replace_sql", False))
    fixed_sql = (review.get("fixed_sql") or "").strip()
    gpt_message = (review.get("message") or "").strip()

    # -------- 3) Câu hỏi vô nghĩa → trả lỗi, không dùng SQL nào --------
    if not question_valid:
        return {
            "ok": False,
            "sql": "",
            "original_sql": sql_t5,
            "columns": [],
            "rows": [],
            "error": gpt_message or "Câu hỏi không có ý nghĩa trong ngữ cảnh dữ liệu này.",
            "gpt_message": gpt_message,
            "sql_source": "invalid_question",
        }

    # -------- 4) GPT bảo SQL T5 ổn → dùng luôn kết quả T5 --------
    # Lưu ý: nếu T5 chạy DB bị lỗi thì vẫn trả lỗi đó, GPT chỉ đánh giá về mặt "hợp lý"
    if not should_replace or not fixed_sql:
        return {
            "ok": t5_ok,
            "sql": sql_t5,                  # SQL cuối cùng = SQL T5
            "original_sql": sql_t5,         # SQL gốc cũng là T5
            "columns": t5_columns if t5_ok else [],
            "rows": t5_rows if t5_ok else [],
            "error": "" if t5_ok else t5_error,
            "gpt_message": gpt_message,
            "sql_source": "t5",
        }

    # -------- 5) GPT đề xuất fixed_sql → chạy lại trên DB --------
    try:
        gpt_columns, gpt_rows = execute_query(fixed_sql)
        return {
            "ok": True,
            "sql": fixed_sql,      # SQL cuối cùng được dùng
            "original_sql": sql_t5,# SQL gốc để so sánh
            "columns": gpt_columns,
            "rows": gpt_rows,
            "error": "",
            "gpt_message": gpt_message,
            "sql_source": "gpt",
        }
    except Exception as e2:
        log.exception("ERROR_WHEN_EXEC_GPT_SQL")
        return {
            "ok": False,
            "sql": fixed_sql,
            "original_sql": sql_t5,
            "columns": [],
            "rows": [],
            "error": str(e2),
            "gpt_message": gpt_message,
            "sql_source": "gpt_failed",
        }

