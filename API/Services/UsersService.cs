using API.DTOs;
using API.Repositories;
using Data.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using static API.DTOs.UsersDTO;
using BCrypt.Net;

namespace API.Services
{
    public interface IUsersService
    {
        Task<UpdateProfileDTO> UpdateProfile(int userId, UpdateProfileDTO updateProfileDto);
        Task<bool> DeleteAccount(int currentUserId, int userIdToDelete, string role);
        Task<bool> UploadAvatar(int userId, UploadAvatarDTO uploadAvatarDto);
        Task<bool> ToggleUserStatus(int currentUserId, int userIdToToggle, string role);
        Task<bool> ChangePassword(int userId, ChangePasswordDTO changePasswordDto);
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
        public async Task<UpdateProfileDTO> UpdateProfile(int userId, UpdateProfileDTO updateProfileDto)
        {
            var user = await _usersRepository.GetUserById(userId);
            if (user == null) return null;

            user.Name = updateProfileDto.Name;
            user.Email = updateProfileDto.Email;
            user.AvatarUrl = updateProfileDto.AvatarUrl;

            var success = await _usersRepository.UpdateUser(userId, user);
            if (!success) return null;

            return new UpdateProfileDTO
            {
                Name = user.Name,
                Email = user.Email,
                AvatarUrl = user.AvatarUrl
            };
        }

        // ✅ Thay đổi mật khẩu
        public async Task<bool> ChangePassword(int userId, ChangePasswordDTO changePasswordDto)
        {
            try
            {
                var user = await _usersRepository.GetUserById(userId);
                if (user == null) return false;

                // Kiểm tra mật khẩu cũ
                if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.OldPassword, user.PasswordHash))
                {
                    return false;
                }

                // Kiểm tra mật khẩu mới và xác nhận mật khẩu
                if (changePasswordDto.NewPassword != changePasswordDto.ConfirmPassword)
                {
                    return false;
                }

                // Băm mật khẩu mới bằng BCrypt
                string newPasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);

                // Cập nhật mật khẩu mới
                return await _usersRepository.UpdateUserPassword(userId, newPasswordHash);
            }
            catch (Exception)
            {
                return false;
            }
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

        public async Task<bool> ToggleUserStatus(int currentUserId, int userIdToToggle, string role)
        {
            if (role != "Admin" && currentUserId != userIdToToggle)
                return false;

            var user = await _usersRepository.GetUserById(userIdToToggle);
            if (user == null)
                return false;

            // Cập nhật vào database
            bool newStatus = !user.IsActive;
            return await _usersRepository.ToggleIsActiveAsync(userIdToToggle, newStatus);
        }
    }
}
