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
using Microsoft.AspNetCore.Authorization;


namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authservice;

        public AuthController(IAuthService authservice) // Gọi là Constructer Injection, tức là Dependency Injection thông qua constructor trong 1 class
        {
            _authservice = authservice;
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authservice.GetAllUsers();
            return Ok(users);
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

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            var result = await _authservice.RefreshToken(refreshToken);
            return result;
        }

        [HttpDelete("deleteuser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _authservice.DeleteUser(id);
            if (!result)
                return NotFound(new { message = "Người dùng không tồn tại!" });
            return Ok(new { message = "Xóa người dùng thành công!" });
        }

    }

}
