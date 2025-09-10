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
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;


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

        [HttpPut("updateuser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] AuthDTO.UpdateUserDto model)
        {
            var result = await _authservice.UpdateUser(id, model);
            if (!result)
                return NotFound(new { message = "Người dùng không tồn tại!" });

            return Ok(new { message = "Cập nhật thông tin tài khoản thành công!" });
        }



        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrEmpty(request.RefreshToken))
            {
                return BadRequest(new { message = "Refresh Token không được để trống." });
            }

            var result = await _authservice.RefreshToken(request.RefreshToken);
            return result;
        }

    }

}
