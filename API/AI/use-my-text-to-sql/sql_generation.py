import os
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer
from mssql_operations import get_schema, validate_sql

# ========= 1) MODEL =========
MODEL_REPO = os.getenv("HF_MODEL_ID", "itsductai02/text-to-sql-v3")
HF_TOKEN   = os.getenv("HF_TOKEN", None)

print(f"[Model] Loading from: {MODEL_REPO}")
tokenizer = T5Tokenizer.from_pretrained(MODEL_REPO, token=HF_TOKEN)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = T5ForConditionalGeneration.from_pretrained(MODEL_REPO, token=HF_TOKEN).to(device)
model.eval()
print("[Model] Ready.")

# ===== 2) LẤY SCHEMA: đúng format dataset =====
# Ví dụ dòng: CREATE TABLE users (UserId INT, Name NVARCHAR(100), ...);
SCHEMA_TEXT = get_schema()  # đã chuẩn hóa ở mssql_operations.get_schema

# ===== 3) TIỆN ÍCH =====
def _build_prompt(question, schema):
    return (
        "Question:\n" + question.strip() + "\n\n"
        "Tables:\n" + schema.strip() + "\n\n"
        "Answer:\n"
    )


def _clean_sql(sql: str) -> str:
    # Làm sạch nhẹ để hợp T-SQL: bỏ dấu nháy kép (nếu model sinh ra), chốt ; một câu
    sql = sql.strip()
    if ";" in sql:
        sql = sql.split(";", 1)[0] + ";"
    sql = sql.replace('"', '')
    return sql

# ===== 4) GENERATE (giữ simple & deterministic như mẫu gốc) =====
DECODE_KW = dict(
    max_new_tokens=256,
    num_beams=1,
    do_sample=False,   # deterministic
)

def generate_sql(natural_language_query: str, schema_text: str | None = None) -> str:
    """
    - schema_text: cho phép override (nếu cần), mặc định dùng SCHEMA_TEXT đã chuẩn hóa.
    - Trả về T-SQL; không tự đổi LIMIT->TOP vì model đã train đúng MSSQL.
    """
    schema_for_prompt = (schema_text or SCHEMA_TEXT).strip()
    prompt = _build_prompt(natural_language_query, schema_for_prompt)

    # In prompt để debug đúng chuỗi gửi cho model
    print("\n=== PROMPT SENT TO MODEL ===\n", prompt, "\n=== END PROMPT ===\n")

    input_ids = tokenizer.encode(prompt, return_tensors="pt", truncation=True, max_length=512).to(device)
    with torch.no_grad():
        out_ids = model.generate(input_ids, **DECODE_KW)

    sql = tokenizer.decode(out_ids[0], skip_special_tokens=True)
    sql = _clean_sql(sql)
    print("[SQL>>] ", sql)

    # (tuỳ chọn) parse check 1 lần — GIỮ YÊN kiểu đơn giản
    ok, err = validate_sql(sql)
    if not ok:
        fix_q = f"{natural_language_query}. Fix the previous T-SQL error: {err}"
        fix_prompt = _build_prompt(fix_q, schema_for_prompt)
        print("\n=== PROMPT (FIX) SENT TO MODEL ===\n", fix_prompt, "\n=== END PROMPT ===\n")
        input_ids = tokenizer.encode(fix_prompt, return_tensors="pt", truncation=True, max_length=512).to(device)
        with torch.no_grad():
            out_ids = model.generate(input_ids, **DECODE_KW)
        sql2 = tokenizer.decode(out_ids[0], skip_special_tokens=True)
        sql2 = _clean_sql(sql2)
        print("[SQL (FIX)>>] ", sql2)
        ok2, _ = validate_sql(sql2)
        if ok2:
            return sql2
    return sql
