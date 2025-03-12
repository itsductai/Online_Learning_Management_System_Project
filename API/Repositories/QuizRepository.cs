using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IQuizRepository
    {
        Task AddQuizAsync(Quiz quiz);
        Task UpdateQuizAsync(Quiz quiz);
        Task<List<Quiz>> GetQuizzesByLessonIdAsync(int lessonId);
        Task DeleteQuizzesByLessonIdAsync(int lessonId);
    }

    public class QuizRepository : IQuizRepository
    {
        private readonly ApplicationDbContext _context;

        public QuizRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddQuizAsync(Quiz quiz)
        {
            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateQuizAsync(Quiz quiz)
        {
            _context.Quizzes.Update(quiz);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Quiz>> GetQuizzesByLessonIdAsync(int lessonId)
        {
            return await _context.Quizzes
                .Where(q => q.LessonId == lessonId)
                .ToListAsync();
        }

        public async Task DeleteQuizzesByLessonIdAsync(int lessonId)
        {
            var quizzes = await _context.Quizzes
                .Where(q => q.LessonId == lessonId)
                .ToListAsync();

            _context.Quizzes.RemoveRange(quizzes);
            await _context.SaveChangesAsync();
        }
    }
}
