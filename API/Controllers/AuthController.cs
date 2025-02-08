using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using API.DTOs;
using static API.DTOs.AuthDTO;
using API.Services;
using static API.Services.AuthService;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;
using Azure.Core;


namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authservice;

        public AuthController(AuthService authservice)
        {
            _authservice = authservice;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDTO.LoginRequest request)
        {
            return await _authservice.Login(request);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthDTO.RegisterDto model)
        {
            return await _authservice.Register(model);
        }

        //public async Task<IActionResult> Register([FromBody] RegisterDto model)
        //{
        //    var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
        //    if (existingUser != null)
        //        return BadRequest("Email đã tồn tại!");

        //    var user = new User
        //    {
        //        Name = model.Name,
        //        Email = model.Email,
        //        PasswordHash = model.Password, // Chưa mã hóa mật khẩu, về sau nên dùng BCrypt để bảo mật
        //        Role = "Student"
        //    };

        //    _context.Users.Add(user);
        //    await _context.SaveChangesAsync();
        //    return Ok(new { message = "Đăng ký thành công!" });
        //}
    }

}
