using System.ComponentModel.DataAnnotations;

namespace Data.Models
{
    // Lớp Course đại diện cho bảng Courses trong SQL Server
    public class Course
    {
        [Key]  // Khóa chính
        public int CourseId { get; set; }

        [Required, MaxLength(200)]  // Tên khóa học, tối đa 200 ký tự
        public string Title { get; set; }

        public string? Description { get; set; }  // Mô tả khóa học (có thể null)
        public bool IsPaid { get; set; } = false;  // Miễn phí hoặc trả phí
        public decimal Price { get; set; } = 0.00m;  // Giá khóa học
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Ngày tạo
    }
}
