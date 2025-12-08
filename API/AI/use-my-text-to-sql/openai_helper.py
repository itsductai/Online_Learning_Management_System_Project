# openai_helper.py
import os
import json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()


client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")  # set trong .env / env var
)

def review_sql_with_gpt(question: str, sql: str, schema: str):

    """
    Trả về JSON:
    {
      "question_valid": bool,
      "should_replace_sql": bool,
      "fixed_sql": string | null,
      "message": string
    }
    - question_valid = false  => câu hỏi vô nghĩa
    - question_valid = true,
        - should_replace_sql = false => giữ nguyên candidate_sql
        - should_replace_sql = true  => dùng fixed_sql
    """
    system_msg = (
        "Bạn là một trợ lý chuyên kiểm tra và (nếu cần) sửa lỗi câu lệnh SQL Server "
        "được sinh ra bởi mô hình Text-to-SQL cho hệ thống quản lý khóa học trực tuyến (OLMS).\n"
        "\n"
        "Bạn được cung cấp:\n"
        "- Schema cơ sở dữ liệu (dạng CREATE TABLE ...),\n"
        "- Câu hỏi ngôn ngữ tự nhiên của người dùng,\n"
        "- Câu lệnh SQL mà mô hình đã sinh ra.\n"
        "\n"
        "Nhiệm vụ của bạn:\n"
        "1) Đầu tiên, kiểm tra xem câu hỏi có RÕ RÀNG và CÓ Ý NGHĨA trong bối cảnh schema hay không.\n"
        "   - Nếu câu hỏi mơ hồ, có nhiều cách hiểu khác nhau hoặc không thể suy ra rõ ràng điều kiện lọc,\n"
        "     thì coi như KHÔNG HỢP LỆ.\n"
        "   - Trong trường hợp đó, đặt question_valid=false, should_replace_sql=false, fixed_sql=\"\", "
        "     và message giải thích ngắn gọn lý do (ví dụ: câu hỏi đa nghĩa, thiếu điều kiện, không rõ cần lọc theo trường nào),\n"
        "     đồng thời gợi ý người dùng viết lại câu hỏi rõ hơn.\n"
        "\n"
        "2) Nếu câu hỏi có ý nghĩa và đủ rõ ràng, hãy đánh giá câu SQL hiện tại:\n"
        "   - Câu SQL chỉ được sử dụng các bảng và cột CÓ TRONG schema.\n"
        "   - Câu SQL phải bám sát ý nghĩa của câu hỏi, KHÔNG được tự suy diễn thêm điều kiện lọc "
        "     khi câu hỏi không nói rõ (ví dụ: không tự ý thêm WHERE Title LIKE '%xxx%' nếu người dùng chỉ nói 'include course title').\n"
        "\n"
        "3) Nếu câu SQL hiện tại CHẤP NHẬN ĐƯỢC:\n"
        "   - Đặt question_valid=true, should_replace_sql=false, fixed_sql=\"\",\n"
        "   - message giải thích ngắn gọn rằng SQL là phù hợp.\n"
        "\n"
        "4) Nếu câu SQL hiện tại CHƯA PHÙ HỢP:\n"
        "   - Đặt question_valid=true, should_replace_sql=true, fixed_sql=<câu SQL Server đã sửa>,\n"
        "   - message giải thích ngắn gọn lý do sửa (ví dụ: sai tên cột, dùng sai bảng, thêm điều kiện không đúng với câu hỏi, v.v.).\n"
        "\n"
        "YÊU CẦU VỀ NGÔN NGỮ:\n"
        "- TẤT CẢ nội dung trong trường message PHẢI dùng tiếng Việt tự nhiên, dễ hiểu.\n"
        "- KHÔNG dùng tiếng Anh trong message, KHÔNG trộn Anh–Việt.\n"
        "\n"
        "QUAN TRỌNG:\n"
        "- KHÔNG được bịa thêm bảng hoặc cột không có trong schema.\n"
        "- KHÔNG tự ý thêm điều kiện lọc không được nhắc đến rõ ràng trong câu hỏi.\n"
        "- Câu SQL trả về trong fixed_sql phải là SQL Server hợp lệ.\n"
        "- Chỉ trả về DUY NHẤT một đối tượng JSON với cấu trúc:\n"
        "{\n"
        "  \"question_valid\": boolean,\n"
        "  \"should_replace_sql\": boolean,\n"
        "  \"fixed_sql\": string,\n"
        "  \"message\": string\n"
        "}\n"
    )



    user_msg = f"""
    Database schema (SQL Server):
    {schema}

    Natural language question:
    {question}

    Candidate SQL (SQL Server dialect):
    {sql}
    """

    resp = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_msg},
            {"role": "user", "content": user_msg},
        ],
        response_format={"type": "json_object"},
    )

    content = resp.choices[0].message.content
    try:
        data = json.loads(content)
    except json.JSONDecodeError:
        data = {
            "question_valid": True,
            "should_replace_sql": False,
            "fixed_sql": None,
            "message": "LLM response was not valid JSON. Keep original SQL.",
        }
    return data
