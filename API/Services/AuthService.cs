using BCrypt.Net;
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
    public interface IAuthService
    {
        Task<List<User>> GetAllUsers();
        Task<IActionResult> Login(LoginRequest request);
        Task<IActionResult> Register(RegisterDto request);
        Task<bool> DeleteUser(int id);
    }

    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;


        public AuthService(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _authRepository.GetAllUsers();
        }

        public async Task<IActionResult> Login( LoginRequest request)
        {
            // Lấy thông tin user từ Repositories
            var user = await _authRepository.GetUserByEmail(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) // Sử dụng BCrypt để kiểm tra mật khẩu
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

            if (existingUser != null) // Dùng BCrypt để bảo mật
            {
                return new BadRequestObjectResult(new { message = "Email đã tồn tại!" });
            }

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password), // Sử dụng BCrypt để băm mật khẩu
                Role = "Student"
            };
            await _authRepository.CreateUser(user);

            // Trả về thông tin user nếu đăng nhập thành công
            return new OkObjectResult(new { message = "Đăng ký thành công!" });
        }

        public async Task<bool> DeleteUser(int id)
        {
            return await _authRepository.DeleteUser(id);
        }

    }
}
