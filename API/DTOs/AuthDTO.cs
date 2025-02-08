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
    }
}
