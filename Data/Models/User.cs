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

        [Required, EmailAddress, MaxLength(100)]  // Định dạng email hợp lệ
        public string Email { get; set; } = string.Empty;

        [Required]  // Bắt buộc nhập mật khẩu
        public string PasswordHash { get; set; } = string.Empty;

        [Required, MaxLength(50)]  // Vai trò (Admin hoặc Student)
        public string Role { get; set; } = "Student";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Ngày tạo tài khoản

        public bool IsActive { get; set; } = true; //  Thêm thuộc tính IsActive
    }
}
