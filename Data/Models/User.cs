using System;
using System.ComponentModel.DataAnnotations;

namespace Data.Models
{
    // Lớp User đại diện cho bảng Users trong SQL Server
    public class User
    {
        [Key]  // Định nghĩa UserId là khóa chính
        public int UserId { get; set; }

        [Required, MaxLength(100)]  // Bắt buộc nhập và giới hạn tối đa 100 ký tự
        public string Name { get; set; } = string.Empty;

        [Required, MaxLength(100)]
        public string Email { get; set; }

        [Required, MaxLength(255)]
        public string PasswordHash { get; set; }

        [Required, MaxLength(50)]
        public string Role { get; set; } = "Student"; // Admin, Instructor, Student

        public bool IsActive { get; set; } = true; //  Thêm thuộc tính IsActive

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7); // Ngày tạo tài khoản

        public string? RefreshToken { get; set; }

        public DateTime? RefreshTokenExpiry { get; set; }

        public string? AvatarUrl { get; set; } = "https://i.pinimg.com/736x/71/f3/51/71f3519243d136361d81df71724c60a0.jpg"; 
        public Instructor? InstructorProfile { get; set; } // Điều hướng 1-1
    }
}
