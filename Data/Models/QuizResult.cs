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

        [ForeignKey("Quiz")]  // Khóa ngoại tham chiếu đến bảng Quizzes
        public int QuizId { get; set; }

        [Required]  // Điểm số bài kiểm tra
        public int Score { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;  // Ngày nộp bài

        public User? User { get; set; }  // Navigation Property
        public Quiz? Quiz { get; set; }  // Navigation Property
    }
}
