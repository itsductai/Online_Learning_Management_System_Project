using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class UsersDTO
    {
        // DTO cho cập nhật thông tin cá nhân
        public class UpdateProfileDTO
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string AvatarUrl { get; set; }
        }

        // DTO cho thay đổi mật khẩu
        public class ChangePasswordDTO
        {
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
            public string ConfirmPassword { get; set; }
        }

        // DTO cho upload ảnh đại diện
        public class UploadAvatarDTO
        {
            [Required]
            public IFormFile Avatar { get; set; } // Nhận file ảnh từ form-data
        }

        public class UserResponseDTO
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string AvatarUrl { get; set; }
            public bool IsActive { get; set; }
        }
    }
}
