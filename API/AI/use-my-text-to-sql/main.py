# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sql_generation import generate_sql
from mssql_operations import execute_query
import logging
import asyncio

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
        return {"ok": True, "sql": sql, "columns": cols, "rows": rows}
    except Exception as e:
        log.exception("ERROR_WHEN_SEARCH")
        return {"ok": False, "sql": sql, "error": str(e)}

@app.get("/")
def root():
    return {"ok": True, "msg": "Use POST /search with {\"query\": \"...\"}"}
