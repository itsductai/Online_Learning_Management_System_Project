using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng Enrollments (Học viên đăng ký khóa học)
    public class Enrollment
    {
        [Key]  // Khóa chính
        public int EnrollmentId { get; set; }

        [ForeignKey("User")]  // Liên kết với bảng Users
        public int UserId { get; set; }

        [ForeignKey("Course")]  // Liên kết với bảng Courses
        public int CourseId { get; set; }

        public bool IsCompleted { get; set; } = false;  // 0: Chưa hoàn thành, 1: Đã hoàn thành

        public DateTime? CompletionDate { get; set; } // Ngày hoàn thành khóa học (nếu có)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7);  // Ngày đăng ký khóa học

        public User? User { get; set; }  // Navigation Property
        public Course? Course { get; set; }  // Navigation Property
    }
}
