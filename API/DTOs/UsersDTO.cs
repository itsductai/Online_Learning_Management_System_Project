using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UsersDTO
    {
        // DTO cho cập nhật thông tin cá nhân
        public class UpdateProfileDTO
        {
            [Required, MaxLength(100)]
            public string Name { get; set; }

            [Required, EmailAddress, MaxLength(100)]
            public string Email { get; set; }
        }

        // DTO cho thay đổi mật khẩu
        public class ChangePasswordDTO
        {
            [Required, MaxLength(255)]
            public string OldPassword { get; set; }

            [Required, MaxLength(255)]
            public string NewPassword { get; set; }

            [Required, MaxLength(255), Compare("NewPassword", ErrorMessage = "Mật khẩu nhập lại không khớp!")]
            public string ConfirmPassword { get; set; }
        }

        // DTO cho upload ảnh đại diện
        public class UploadAvatarDTO
        {
            [Required]
            public IFormFile Avatar { get; set; } // Nhận file ảnh từ form-data
        }
    }
}
