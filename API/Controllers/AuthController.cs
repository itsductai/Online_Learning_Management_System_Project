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

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            var result = await _authservice.RefreshToken(refreshToken);
            return result;
        }



        [AllowAnonymous]
        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var redirectUri = Url.Action("GoogleCallback", "Auth", null, Request.Scheme);

            var properties = new AuthenticationProperties
            {
                RedirectUri = redirectUri
            };

            // 🔥 Debug: Kiểm tra trước khi gọi Challenge()
            var correlationKeysBefore = HttpContext.Request.Cookies.Keys
                .Where(k => k.StartsWith(".AspNetCore.Correlation"));
            Console.WriteLine($"🛑 Before Challenge - Correlation Cookies: {string.Join(", ", correlationKeysBefore)}");

            var result = Challenge(properties, GoogleDefaults.AuthenticationScheme);

            // 🔥 Debug: Kiểm tra sau khi gọi Challenge()
            var correlationKeysAfter = HttpContext.Request.Cookies.Keys
                .Where(k => k.StartsWith(".AspNetCore.Correlation"));
            Console.WriteLine($"✅ After Challenge - Correlation Cookies: {string.Join(", ", correlationKeysAfter)}");

            return result;
        }




        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme); // Nhận thông tin sau khi Google xác thực

            if (!result.Succeeded)
            {
                Console.WriteLine(result.Failure?.Message);
                return Unauthorized("Xác thực Google thất bại: " + result.Failure?.Message);
            }

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims.Select(claim => new
            {
                //claim.Issuer,
                //claim.OriginalIssuer,
                claim.Type,
                claim.Value
            });

            var email = result.Principal.FindFirst(ClaimTypes.Email)?.Value; // Lấy email từ Google
            var name = result.Principal.FindFirst(ClaimTypes.Name)?.Value;   // Lấy tên từ Google

            // TODO: Tìm user trong DB, nếu chưa có thì tạo mới, sau đó sinh JWT Token và trả về client

            return Ok(new { email, name, claims }); // Tạm thời trả về thông tin để kiểm tra
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
