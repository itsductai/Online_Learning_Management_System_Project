using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Lớp Course đại diện cho bảng Courses trong SQL Server
    public class Course
    {
        [Key]  // Khóa chính
        public int CourseId { get; set; }

        [Required, MaxLength(200)]  // Tên khóa học, tối đa 200 ký tự
        public string Title { get; set; }

        public string? ImageUrl { get; set; }  // Đường dẫn ảnh đại diện (có thể null)

        public string? Description { get; set; }  // Mô tả khóa học (có thể null)
        public bool IsPaid { get; set; } = false;  // Miễn phí hoặc trả phí
        public decimal Price { get; set; } = 0.00m;  // Giá khóa học
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7);  // Ngày tạo
        public DateTime? ExpiryDate { get; set; }  // Ngày hết hạn của khóa học (nullable)

        // ID của giáo viên giảng dạy khóa học, cho phép null để tránh lỗi khi chưa gán giáo viên
        public int? InstructorId { get; set; }

        [ForeignKey("InstructorId")]
        public User? Instructor { get; set; } // Liên kết với bảng Users (Navigation Property) cho phép null
    }
}
