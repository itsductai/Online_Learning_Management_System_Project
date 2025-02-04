using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng Lessons trong database
    public class Lesson
    {
        [Key]  // Khóa chính
        public int LessonId { get; set; }

        [ForeignKey("Course")]  // Khóa ngoại tham chiếu đến bảng Courses
        public int CourseId { get; set; }

        [Required, MaxLength(50)]
        public string LessonType { get; set; } = "Text"; // 'Video', 'Text', hoặc 'Quiz'

        [Required, MaxLength(200)]  // Tiêu đề bài học không được null
        public string Title { get; set; } = string.Empty;

        public string? Content { get; set; } // Nội dung bài học (dành cho bài viết)

        public string? Attachment { get; set; } // Đường dẫn file đính kèm

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Course? Course { get; set; } // Navigation Property (liên kết với Course)
    }
}
