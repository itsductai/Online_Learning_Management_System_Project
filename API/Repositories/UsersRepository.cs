using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IUsersRepository
    {
        // Lấy thông tin người dùng theo ID
        Task<User> GetUserById(int userId);

        // Cập nhật thông tin người dùng
        Task<bool> UpdateUser(int userId, User user);

        // Cập nhật avatar của người dùng
        Task<bool> UpdateAvatar(int userId, string avatarUrl);

        // Xóa người dùng theo ID
        Task<bool> DeleteUser(int userId);

        // Cập nhật mật khẩu người dùng
        Task<bool> UpdateUserPassword(int userId, string newPasswordHash);
    }

    public class UsersRepository : IUsersRepository
    {
        private readonly ApplicationDbContext _context;

        public UsersRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetUserById(int userId)
        {
            return await _context.Users.FindAsync(userId);
        }

        public async Task<bool> UpdateUser(int userId, User user)
        {
            var existingUser = await _context.Users.FindAsync(userId);
            if (existingUser == null) return false;

            _context.Entry(existingUser).CurrentValues.SetValues(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateAvatar(int userId, string avatarUrl)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.AvatarUrl = avatarUrl;
            _context.Users.Update(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            _context.Users.Remove(user);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateUserPassword(int userId, string newPasswordHash)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return false;

                user.PasswordHash = newPasswordHash;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
    }
}
