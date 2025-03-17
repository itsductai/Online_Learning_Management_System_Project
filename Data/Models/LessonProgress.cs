using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng LessonProgress (Lưu tiến độ học của từng học viên)
    public class LessonProgress
    {
        [Key]  // Khóa chính
        public int ProgressId { get; set; }

        [ForeignKey("User")]  // Khóa ngoại tham chiếu đến bảng Users
        public int UserId { get; set; }

        [ForeignKey("Lesson")]  // Khóa ngoại tham chiếu đến bảng Lessons
        public int LessonId { get; set; }

        public bool IsCompleted { get; set; } = false;  // 0: Chưa hoàn thành, 1: Đã hoàn thành

        public DateTime LastUpdate { get; set; } // Ngày cập nhật tiến độ học

        public DateTime? CompletedAt { get; set; }  // Ngày hoàn thành bài học (nếu có)

        public User? User { get; set; }  // Navigation Property
        public Lesson? Lesson { get; set; }  // Navigation Property
    }
}
