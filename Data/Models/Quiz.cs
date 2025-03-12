using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng Quizzes trong database
    public class Quiz
    {
        [Key]  // Khóa chính
        public int QuizId { get; set; }

        [ForeignKey("Lesson")]  // Khóa ngoại tham chiếu đến bảng Lessons
        public int LessonId { get; set; }

        [Required]
        public string Question { get; set; } = string.Empty;  // Câu hỏi

        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }

        [Required, MaxLength(1)]  // Đáp án đúng (0 , 1, 2 hoặc 3)
        public int CorrectAnswer { get; set; }
        public string? ImageUrl { get; set; } // Thêm link hình ảnh vào câu hỏi

        public Lesson? Lesson { get; set; } // Navigation Property
    }
}
