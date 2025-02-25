using Microsoft.EntityFrameworkCore;
using Data;
using Data.Models;
using static Data.Models.ApplicationDbContext;

namespace API.Repositories
{
    public interface IAuthRepository
    {
        Task<List<User>> GetAllUsers();
        Task<User?> GetUserByEmail(string email);
        Task<User?> GetUserById(int id);
        Task CreateUser(User user);
        Task UpdateUser(User user); // Thêm mới
        Task<User?> GetUserByEmailRefreshToken(string refreshToken); // Thêm mới
    }

    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _context;
        public AuthRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllUsers()
        {
            return await _context.Users.ToListAsync();
        }


        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }


        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == id);
        }


        public async Task CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }


        public async Task UpdateUser(User user) // Hàm mới để update user
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }


        // AuthRepository.cs - Thêm phương thức GetUserByEmailRefreshToken
        public async Task<User?> GetUserByEmailRefreshToken(string refreshToken)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
        }
    }
}
