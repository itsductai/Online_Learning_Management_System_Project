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
        public string LessonType { get; set; } // 'Video', 'Text', 'Quiz'

        [Required, MaxLength(200)]  // Tiêu đề bài học không được null
        public string Title { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7);

        public int Duration { get; set; }

        public Course? Course { get; set; } // Navigation Property (liên kết với Course)
    }
}
