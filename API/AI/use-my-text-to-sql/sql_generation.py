import os
import re
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

from mssql_operations import get_schema, validate_sql  # validate_sql đã có trong file của bạn

# ========= 1) MODEL =========
MODEL_REPO = os.getenv("HF_MODEL_ID", "itsductai02/text-to-sql-v1")
HF_TOKEN   = os.getenv("HF_TOKEN", None)

print(f"[Model] Loading from: {MODEL_REPO}")
tokenizer = T5Tokenizer.from_pretrained(MODEL_REPO, token=HF_TOKEN)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = T5ForConditionalGeneration.from_pretrained(MODEL_REPO, token=HF_TOKEN).to(device)
model.eval()
print("[Model] Ready.")

# ========= 2) SCHEMA: rút gọn tên bảng & cột =========
def _compress_schema(ddl: str, max_chars: int = 7000) -> str:
    """
    Nhận chuỗi DDL dạng 'CREATE TABLE dbo.X(...); CREATE TABLE dbo.Y(...); ...'
    Trả về schema gọn: mỗi bảng 1 dòng 'Table: T | Columns: a,b,c'
    """
    tables = []
    # tách theo CREATE TABLE ... (...);
    for m in re.finditer(r"CREATE\s+TABLE\s+([^\(\s]+)\s*\((.*?)\)", ddl, flags=re.I|re.S):
        tbl = m.group(1)
        cols_block = m.group(2)
        # lấy tên cột (bỏ kiểu)
        cols = []
        for line in cols_block.split(","):
            name = line.strip().split()[0]
            # bỏ các từ khóa/ngoặc
            name = name.strip("[]()")
            # lọc tên cột hợp lệ
            if re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", name):
                cols.append(name)
        if cols:
            # chuẩn hóa tên bảng: bỏ schema dbo.
            plain_tbl = tbl.split(".")[-1].strip("[]")
            tables.append(f"Table: {plain_tbl} | Columns: {', '.join(cols[:60])}")

    compact = "\n".join(tables)
    return compact[:max_chars]

_raw_schema = get_schema()                 # dùng hàm hiện có
SCHEMA_TEXT = _compress_schema(_raw_schema)

# ========= 3) Guardrails đơn giản =========
BLOCKLIST = [
    "strftime", "datetime(", "CURRENT_TIME", "unixepoch",  # SQLite
    "to_char(", "extract(",                                # Postgres
]
def _looks_like_mssql(sql: str) -> bool:
    s = sql.lower()
    if any(b in s for b in [b.lower() for b in BLOCKLIST]):
        return False
    # phải có FROM, SELECT
    return "select" in s and "from" in s

def _clean_sql(sql: str) -> str:
    # bỏ phần thừa nếu model nói lan man
    sql = sql.strip()
    # chỉ lấy đến dấu ; đầu tiên nếu có
    if ";" in sql:
        sql = sql.split(";")[0] + ";"
    # bỏ dấu ngoặc kép trong alias gây lỗi
    sql = sql.replace('"', '')
    return sql

# ========= 4) Prompt & decode =========
SYSTEM_INSTRUCTION = (
    "You are an assistant that generates a SINGLE Microsoft SQL Server query.\n"
    "- Use ONLY tables/columns listed below.\n"
    "- Dialect: SQL Server 2019+.\n"
    "- Do NOT use SQLite/Postgres functions (NO strftime, extract, to_char,...).\n"
    "- Keep it short; avoid nested CASE (>2 levels).\n"
    "- OUTPUT ONLY the SQL query, nothing else."
)

PROMPT_TEMPLATE = """{sys}

Schema:
{schema}

Question: {question}
SQL:
"""

DECODE_KW = dict(
    max_new_tokens=96,          # đừng cho quá dài
    num_beams=1,                # tránh văn dài dòng
    do_sample=True,             # sampling giúp bớt lặp
    top_p=0.92,
    temperature=0.7,
    no_repeat_ngram_size=3,     # chống lặp
    early_stopping=True,
)

# ========= 5) Hàm public =========
def generate_sql(natural_language_query: str) -> str:
    """
    Trả về câu SQL đã được:
      - sinh từ model (ép SQL Server)
      - rút gọn
      - tự validate; nếu fail cố thử sửa 1-2 lần
    """
    print(f"[INPUT_NL]: {natural_language_query}")

    def _one_shot(q: str, extra_note: str = "") -> str:
        sys = SYSTEM_INSTRUCTION + (("\n" + extra_note) if extra_note else "")
        prompt = PROMPT_TEMPLATE.format(sys=sys, schema=SCHEMA_TEXT, question=q)
        print("[Prompt>>]\n", prompt[:800], "...\n")
        input_ids = tokenizer.encode(prompt, return_tensors="pt", truncation=True, max_length=512).to(device)
        with torch.no_grad():
            out_ids = model.generate(input_ids, **DECODE_KW)
        sql = tokenizer.decode(out_ids[0], skip_special_tokens=True)
        sql = _clean_sql(sql)
        print("[SQL>>] ", sql[:400])
        return sql

    # Lần 1: sinh thẳng
    sql = _one_shot(natural_language_query)
    if not _looks_like_mssql(sql):
        # nhắc lại dialect
        sql = _one_shot(natural_language_query, extra_note="Remember: Use only SQL Server T-SQL syntax.")

    # validate bằng SQL Server (EXPLAIN / EXEC sơ bộ)
    ok, err = validate_sql(sql)
    if not ok:
        # Thử tự sửa một lần ngắn gọn
        fix_note = f"Your previous SQL had this SQL Server error: {err}. Generate a corrected SQL. Keep it short."
        sql2 = _one_shot(natural_language_query, extra_note=fix_note)
        if _looks_like_mssql(sql2):
            ok2, err2 = validate_sql(sql2)
            if ok2:
                return sql2
    return sql
