using Microsoft.EntityFrameworkCore;
using Data;
using Data.Models;
using static Data.Models.ApplicationDbContext;

namespace API.Repositories
{
    public interface IAuthRepository
    {
        Task<User?> GetUserByEmail(string email);
        Task CreateUser(User user);
    }

    public class AuthRepository : IAuthRepository
    {
        private readonly ApplicationDbContext _context;
        public AuthRepository(ApplicationDbContext context)
        {
            _context = context;
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
    }
}
