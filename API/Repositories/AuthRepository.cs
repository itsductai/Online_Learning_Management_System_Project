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
        Task CreateUser(User user);
        Task<bool> DeleteUser(int id);
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

        public async Task CreateUser(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
