# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sql_generation import generate_sql
from mssql_operations import execute_query
import logging
import asyncio

from memory_cache import add_to_cache  
from auto_suggestion import suggest as suggest_api 

# ===== Log gọn gàng =====
logging.basicConfig(level=logging.INFO, format="%(asctime)s | %(levelname)s | %(message)s")
log = logging.getLogger("text2sql")

app = FastAPI(title="Text-to-SQL (T5 + MSSQL)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
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
