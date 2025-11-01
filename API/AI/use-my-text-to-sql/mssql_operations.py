# mssql_operations.py

from mssql_connection import get_connection
import os

# [FIX] Bảng hệ thống/metadata cần loại bỏ khỏi context cho model
_DENY_TABLES = {
    "__EFMigrationsHistory".lower(),
    "sysdiagrams".lower(),
}

# [FIX] Bảng cốt lõi ưu tiên đứng trước (giống dataset train: users, instructors, courses)
_CORE_ORDER = [
    "users", "instructors", "courses", "enrollments",
    "lessons", "textlessons", "videolessons", "lessonprogress",
    "quizzes", "quizresults", "payments", "coupons"
]

def get_schema(max_chars: int = 8000) -> str:
    """
    Xuất schema đúng format dataset đã train (mỗi dòng 1 bảng):
      CREATE TABLE users (UserId INT, Name NVARCHAR(100), ...);
    - BỎ schema prefix (dbo.)
    - TÊN BẢNG: lowercase (users, instructors, ...)
    - CỘT/KIỂU: GIỮ NGUYÊN (UserId, CreatedAt, NVARCHAR, ...)
    - Loại bỏ bảng hệ thống (migrations, sysdiagrams)
    - Ưu tiên in ra nhóm CORE trước để bám đúng domain OLMS
    - Cho phép whitelist qua ENV `SCHEMA_ALLOW` (danh sách tên bảng, phẩy ngăn)
    """
    conn = get_connection()
    cur  = conn.cursor()

    cur.execute("""
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE='BASE TABLE'
        ORDER BY TABLE_SCHEMA, TABLE_NAME
    """)
    rows = cur.fetchall()

    # [FIX] Whitelist optional (không bắt buộc). Nếu không set → lấy tất cả (trừ deny).
    allow_env = os.getenv("SCHEMA_ALLOW", "")  # ví dụ: "users,instructors,courses"
    allow_set = {x.strip().lower() for x in allow_env.split(",") if x.strip()} if allow_env else None

    # Thu thập bảng hợp lệ
    tables = []
    for schema, table in rows:
        tname = table.lower()
        if tname in _DENY_TABLES:
            continue
        if allow_set is not None and tname not in allow_set:
            continue
        tables.append((schema, tname))

    # [FIX] Ưu tiên nhóm CORE đứng trước, sau đó tới các bảng còn lại (ổn định đầu vào cho model)
    core = [t for t in tables if t[1] in _CORE_ORDER]
    rest = [t for t in tables if t[1] not in _CORE_ORDER]
    # sắp xếp phần còn lại theo tên để deterministic
    rest.sort(key=lambda x: x[1])
    ordered = core + rest

    parts, total = [], 0
    for schema, tname in ordered:
        # lấy cột
        cur.execute("""
            SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        """, (schema, tname))
        cols = cur.fetchall()

        # GHÉP "ColName DATA_TYPE" (GIỮ NGUYÊN ColName & DATA_TYPE như DB)
        col_defs = ", ".join(f"{c} {t.upper()}" for c, t in cols)
        line = f"CREATE TABLE {tname} ({col_defs});"

        parts.append(line)
        total += len(line) + 1
        if total > max_chars:
            break

    cur.close()
    conn.close()
    return "\n".join(parts)


def execute_query(sql: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    columns = [desc[0] for desc in cur.description]
    result = [dict(zip(columns, row)) for row in rows]
    cur.close()
    conn.close()
    return columns, result

def validate_sql(sql: str):
    """
    Kiểm tra cú pháp T-SQL mà KHÔNG thực thi câu lệnh (dùng PARSEONLY).
    Trả về (ok: bool, error: str)
    """
    conn = get_connection()
    cur = conn.cursor()
    try:
        # Tắt thực thi, chỉ parse cú pháp
        cur.execute("SET PARSEONLY ON;")
        # Không thêm ; nếu đã có
        to_run = sql if sql.strip().endswith(";") else sql + ";"
        cur.execute(to_run)
        ok, err = True, ""
    except Exception as e:
        ok, err = False, str(e)
    finally:
        # Bật lại trạng thái mặc định
        try:
            cur.execute("SET PARSEONLY OFF;")
        except Exception:
            pass
        cur.close()
        conn.close()
    return ok, err
