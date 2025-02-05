using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;

namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Tìm user trong database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.PasswordHash != request.Password) // Chưa mã hóa mật khẩu, về sau nên dùng BCrypt để bảo mật
            {
                return Unauthorized(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // Trả về thông tin user nếu đăng nhập thành công
            return Ok(new { user.UserId, user.Name, user.Email, user.Role });
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
                return BadRequest("Email đã tồn tại!");

            var user = new User
            {
                Name = model.Name,
                Email = model.Email,
                PasswordHash = model.Password, // Chưa mã hóa mật khẩu, về sau nên dùng BCrypt để bảo mật
                Role = "Student"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đăng ký thành công!" });
        }
    }

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
