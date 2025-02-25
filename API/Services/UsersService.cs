using API.DTOs;
using API.Repositories;
using Data.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using static API.DTOs.UsersDTO;

namespace API.Services
{
    public interface IUsersService
    {
        Task<bool> UpdateProfile(int userId, UpdateProfileDTO updateProfileDto);
        Task<bool> ChangePassword(int userId, ChangePasswordDTO changePasswordDto);
        Task<bool> DeleteAccount(int currentUserId, int userIdToDelete, string role);
        Task<bool> UploadAvatar(int userId, UploadAvatarDTO uploadAvatarDto);
    }

    public class UsersService : IUsersService
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IPasswordHasher<User> _passwordHasher;

        public UsersService(IUsersRepository usersRepository, IPasswordHasher<User> passwordHasher)
        {
            _usersRepository = usersRepository;
            _passwordHasher = passwordHasher;
        }

        // ✅ Cập nhật thông tin cá nhân
        public async Task<bool> UpdateProfile(int userId, UpdateProfileDTO updateProfileDto)
        {
            var user = await _usersRepository.GetUserById(userId);
            if (user == null) return false;

            user.Name = updateProfileDto.Name;
            user.Email = updateProfileDto.Email;

            return await _usersRepository.UpdateUser(userId, user);
        }

        // ✅ Thay đổi mật khẩu
        public async Task<bool> ChangePassword(int userId, ChangePasswordDTO changePasswordDto)
        {
            var user = await _usersRepository.GetUserById(userId);
            if (user == null) return false;

            // Kiểm tra mật khẩu cũ
            var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, changePasswordDto.OldPassword);
            if (verify == PasswordVerificationResult.Failed) return false;

            // Không cho phép đặt lại mật khẩu cũ
            if (_passwordHasher.VerifyHashedPassword(user, user.PasswordHash, changePasswordDto.NewPassword) == PasswordVerificationResult.Success)
                return false;

            user.PasswordHash = _passwordHasher.HashPassword(user, changePasswordDto.NewPassword);
            return await _usersRepository.UpdateUser(userId, user);
        }

        // ✅ Upload ảnh đại diện
        public async Task<bool> UploadAvatar(int userId, UploadAvatarDTO uploadAvatarDto)
        {
            var user = await _usersRepository.GetUserById(userId);
            if (user == null) return false;

            if (uploadAvatarDto.Avatar == null || uploadAvatarDto.Avatar.Length == 0)
                return false;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var fileExtension = Path.GetExtension(uploadAvatarDto.Avatar.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension)) return false;

            var uploadsFolder = Path.Combine("wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{Guid.NewGuid()}_{uploadAvatarDto.Avatar.FileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await uploadAvatarDto.Avatar.CopyToAsync(stream);
            }

            var avatarUrl = $"/uploads/{fileName}";
            return await _usersRepository.UpdateAvatar(userId, avatarUrl);
        }

        // ✅ Xóa tài khoản (Admin có thể xóa bất kỳ user, Student chỉ xóa chính mình)
        public async Task<bool> DeleteAccount(int currentUserId, int userIdToDelete, string role)
        {
            // Nếu là Student, chỉ cho phép xóa tài khoản của chính họ
            if (role != "Admin" && currentUserId != userIdToDelete)
                return false;

            return await _usersRepository.DeleteUser(userIdToDelete);
        }
    }
}
