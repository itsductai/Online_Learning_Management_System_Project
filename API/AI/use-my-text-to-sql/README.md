Mục tiêu

- Dùng model đã fine-tune qua ep1 (itsductai02/text-to-sql-v1) để sinh SQL từ tiếng Anh.
- Expose API FastAPI (/search, /suggestion, /login) và kết nối trực tiếp MSSQL.
- Thêm logging đầu vào/đầu ra để debug.

Thay đổi chính

- main.py
  - Thêm endpoints /search (sinh SQL + thực thi), /suggestion, /login.
  - Bật CORS, log rõ ràng: INPUT_NL, PROMPT, SQL sinh, lỗi DB.
- sql_generation.py
  - Load tokenizer/model từ HF (itsductai02/text-to-sql-v1).
  - Lấy schema runtime từ MSSQL (get_schema), rút gọn schema theo ký tự để tránh vượt max_length.
  - Prompt template “Tables:\n{schema}\n\nQuestion:\n{query}\n\nSQL (Microsoft SQL Server):”.
  - Trả về SQL + log trung gian để tiện so sánh.
- mssql_connection.py
  - Đọc chuỗi kết nối từ:
    Server=<Link DB>
- mssql_operations.py
  - get_schema(): quét toàn bộ bảng/column và build “CREATE TABLE …” (SQL Server style).
  - execute_query(): thực thi câu SQL, trả về (columns, rows) dạng dict.
  - validate_sql(): kiểm tra cú pháp nhanh với `SET PARSEONLY ON`.
- auto_suggestion.py, memory_cache.py
  - Cache câu hỏi và gợi ý từ khóa.
- requirements.txt
  - Cố định các bản: fastapi, uvicorn, transformers, torch, sentencepiece, pydantic, pyodbc, fast-autocomplete, python-dotenv.
- .env (mới)
  - HF_TOKEN=<token huggingface>

Cách chạy

1. `pip install -r requirements.txt`
2. Tạo file `.env` (hoặc export biến môi trường như trên).
3. `python -m uvicorn main:app --reload --port 8000`
4. Test Postman:
   - POST http://127.0.0.1:8000/search
     Body JSON: { "query": "List all courses (id, title, price) created in 2024" }

Kết quả/Log quan trọng sẽ hiện:

- [Prompt>>] … schema rút gọn …
- [SQL>>] … câu SQL đã sinh …
- Nếu thực thi DB lỗi sẽ trả về: { ok: false, sql, error }

Lỗi/giới hạn hiện tại (đã thấy khi test)

- Model hiện tại còn kém lúc sinh cú pháp, không hợp lệ (LIMIT, STRFTIME, …) -> gây lỗi trên MSSQL (ví dụ “LIMIT 500”, “STRFTIME(…)”).

Hướng xử lý tiếp theo

- Thêm **hậu xử lý cho MSSQL**:
  - LIMIT N -> TOP N + ORDER BY
  - STRFTIME -> CONVERT/FORMAT hoặc DATEPART theo MSSQL
  - UPPER/LCASE khác biệt type.
- **Ràng buộc prompt theo MSSQL** (đã thêm nhãn “SQL (Microsoft SQL Server)”).
- **Fine-tune tiếp (thêm vài ep) hoặc tạo thêm dataset riêng cho việc quản lý khóa học**
