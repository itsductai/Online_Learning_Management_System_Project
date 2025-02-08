using API.DTOs;
using static API.DTOs.AuthDTO;
using API.Repositories;
using static API.Repositories.AuthRepository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Data.Models;

namespace API.Services
{
    public class AuthService
    {
        private readonly AuthRepository _authRepository;

        public AuthService(AuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<IActionResult> Login( AuthDTO.LoginRequest request)
        {
            // Lấy thông tin user từ Repositories
            var user = await _authRepository.GetUserByEmail(request.Email);

            if (user == null || user.PasswordHash != request.Password) // Chưa mã hóa mật khẩu, về sau nên dùng BCrypt để bảo mật
            {
                return new UnauthorizedObjectResult(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // Trả về thông tin user nếu đăng nhập thành công
            return new OkObjectResult(new { user.UserId, user.Name, user.Email, user.Role });
        }

        public async Task<IActionResult> Register(AuthDTO.RegisterDto request)
        {
            // Lấy thông tin user từ Repositories
            var existingUser = await _authRepository.GetUserByEmail(request.Email);

            if (existingUser != null) // Chưa mã hóa mật khẩu, về sau nên dùng BCrypt để bảo mật
            {
                return new BadRequestObjectResult(new { message = "Email đã tồn tại!" });
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = request.Password, // Chưa mã hóa mật khẩu, về sau nên dùng BCrypt để bảo mật
                Role = "Student"
            };
            await _authRepository.CreateUser(user);

            // Trả về thông tin user nếu đăng nhập thành công
            return new OkObjectResult(new { message = "Đăng ký thành công!" });
        }

    }
}
