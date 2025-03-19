using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng QuizResults (Lưu kết quả bài kiểm tra của học viên)
    public class QuizResult
    {
        [Key]  // Khóa chính
        public int ResultId { get; set; }

        [ForeignKey("User")]  // Khóa ngoại tham chiếu đến bảng Users
        public int UserId { get; set; }

        [ForeignKey("Lesson")]  // Khóa ngoại tham chiếu đến bảng Quizzes
        public int LessonId { get; set; }

        [Required]  // Điểm số bài kiểm tra
        public int Score { get; set; }
        public int CorrectAnswers { set; get; }
        public int TotalQuestions { set; get; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow.AddHours(7);  // Ngày nộp bài

        public User? User { get; set; }  // Navigation Property
        public Lesson? Lesson { get; set; }  // Navigation Property
    }
}
