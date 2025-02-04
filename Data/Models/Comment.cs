using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng Comments (Lưu bình luận của học viên về khóa học)
    public class Comment
    {
        [Key]  // Khóa chính
        public int CommentId { get; set; }

        [ForeignKey("Course")]  // Khóa ngoại tham chiếu đến bảng Courses
        public int CourseId { get; set; }

        [ForeignKey("User")]  // Khóa ngoại tham chiếu đến bảng Users
        public int UserId { get; set; }

        [Required]  // Nội dung bình luận
        public string Content { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Ngày tạo bình luận

        public Course? Course { get; set; }  // Navigation Property
        public User? User { get; set; }  // Navigation Property
    }
}
