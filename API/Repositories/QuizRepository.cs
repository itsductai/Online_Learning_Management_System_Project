using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IQuizRepository
    {
        Task<List<Quiz>> GetQuizzesByLessonIdAsync(int lessonId);
    }
    public class QuizRepository : IQuizRepository
    {
        private readonly ApplicationDbContext _context;

        public QuizRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Quiz>> GetQuizzesByLessonIdAsync(int lessonId)
        {
            return await _context.Quizzes
                .Where(q => q.LessonId == lessonId)
                .ToListAsync();
        }
    }

}
