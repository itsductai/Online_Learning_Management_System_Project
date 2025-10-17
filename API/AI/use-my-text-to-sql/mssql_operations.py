# mssql_operations.py
from mssql_connection import get_connection
import pyodbc

# Lấy schema ở dạng "CREATE TABLE ..." (gọn, đủ cho model hiểu).
def get_schema(max_chars: int = 8000) -> str:
    """
    Build schema text friendly cho LLM từ INFORMATION_SCHEMA của SQL Server.
    Giữ ngắn gọn (cắt ở max_chars) để khỏi vượt 512 token khi ghép prompt.
    """
    conn = get_connection()
    cur = conn.cursor()

    # Lấy danh sách bảng
    cur.execute("""
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE='BASE TABLE'
        ORDER BY TABLE_SCHEMA, TABLE_NAME
    """)
    tables = cur.fetchall()

    parts = []
    for schema, table in tables:
        # Lấy cột của bảng
        cur.execute("""
            SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?
            ORDER BY ORDINAL_POSITION
        """, (schema, table))
        cols = cur.fetchall()
        col_defs = ", ".join(f"{c} {t}" for c, t in cols)
        parts.append(f"CREATE TABLE {schema}.{table}({col_defs}); ")

        # Cắt sớm nếu quá dài
        if sum(len(p) for p in parts) > max_chars:
            break

    cur.close()
    conn.close()
    return "".join(parts)

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
