﻿using BCrypt.Net;
using API.DTOs;
using static API.DTOs.AuthDTO;
using API.Repositories;
using static API.Repositories.AuthRepository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Data.Models;
using Microsoft.AspNetCore.Identity;

namespace API.Services
{
    public interface IAuthService
    {
        Task<List<User>> GetAllUsers();
        Task<IActionResult> Login(LoginRequest request);
        Task<IActionResult> Register(RegisterDto request);
        Task<bool> UpdateUser(int id, AuthDTO.UpdateUserDto model);
        Task<IActionResult> RefreshToken(string refreshToken);
    }

    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly JwtService _jwtService;

        public AuthService(IAuthRepository authRepository, JwtService jwtService)
        {
            _authRepository = authRepository;
            _jwtService = jwtService;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _authRepository.GetAllUsers();
        }

        public async Task<IActionResult> Login(LoginRequest request)
        {
            // Lấy thông tin user từ Repositories
            var user = await _authRepository.GetUserByEmail(request.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) // Sử dụng BCrypt để kiểm tra mật khẩu
            {
                return new UnauthorizedObjectResult(new { message = "Email hoặc mật khẩu không đúng!" });
            }

            // Kiểm tra tài khoản bị vô hiệu hóa
            if (!user.IsActive)
            {
                return new ObjectResult(new
                {
                    message = "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
                    code = "ACCOUNT_DISABLED"
                })
                {
                    StatusCode = StatusCodes.Status403Forbidden
                };

            }

            var token = _jwtService.GenerateToken(user.UserId.ToString(), user.Role);
            var refreshToken = _jwtService.GenerateRefreshToken(); // Sinh Refresh Token
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7); // Hạn Refresh Token 7 ngày
            await _authRepository.UpdateUser(user); // Lưu qua Repository

            // Trả về thông tin user nếu đăng nhập thành công
            return new OkObjectResult(new { Token = token, RefreshToken = refreshToken, user.UserId, user.Name, user.Email, user.Role, user.CreatedAt, user.AvatarUrl });
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

        public async Task<bool> UpdateUser(int id, AuthDTO.UpdateUserDto model)
        {
            var user = await _authRepository.GetUserById(id);
            if (user == null) return false;

            // Kiểm tra nếu email đã tồn tại ở user khác
            var existingUser = await _authRepository.GetUserByEmail(model.Email);
            if (existingUser != null && existingUser.UserId != id)
            {
                return false; // Email đã được sử dụng bởi user khác
            }

            user.Name = model.Name;
            user.Email = model.Email;
            user.IsActive = model.IsActive;
            user.AvatarUrl = model.AvatarUrl; // 🔥 Cập nhật avatar

            // Nếu có mật khẩu mới, thì băm mật khẩu và cập nhật
            if (!string.IsNullOrEmpty(model.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);
            }

            await _authRepository.UpdateUser(user);
            return true;
        }


        public async Task<IActionResult> RefreshToken(string refreshToken)
        {
            var user = await _authRepository.GetUserByEmailRefreshToken(refreshToken); // Gọi repo lấy user theo refresh token
            if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow) // Kiểm tra refresh token
                return new UnauthorizedObjectResult(new { message = "Refresh token không hợp lệ hoặc đã hết hạn!" }); // Trả về lỗi nếu không hợp lệ

            var newToken = _jwtService.GenerateToken(user.UserId.ToString(), user.Role); // Sinh token mới
            var newRefreshToken = _jwtService.GenerateRefreshToken(); // Sinh refresh token mới

            user.RefreshToken = newRefreshToken; // Cập nhật refresh token mới
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7); // Cập nhật hạn refresh token mới
            await _authRepository.UpdateUser(user); // Lưu thông tin user qua repo

            return new OkObjectResult(new { Token = newToken, RefreshToken = newRefreshToken }); // Trả về token mới
        }

    }
}
