namespace API.DTOs
{
    public class AuthDTO
    {

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class RegisterDto
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
        }

        public class UpdateUserDto
        {
            public string Name { get; set; }
            public string Email { get; set; }
            public string? Password { get; set; } // Có thể null (nếu không muốn đổi mật khẩu)
            public bool IsActive { get; set; } // Trạng thái tài khoản
            public string? AvatarUrl { get; set; }
        }

        public class RefreshTokenRequest
        {
            public string RefreshToken { get; set; }
        }

        public class LoginResponse
        {
            public string Token { get; set; }
            public UserDTO User { get; set; }
        }

        public class UserDTO
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Role { get; set; }
            public string AvatarUrl { get; set; }
            public bool IsActive { get; set; }
        }

    }
}
