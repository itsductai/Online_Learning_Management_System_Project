using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface IQuizRepository
    {
        Task AddQuizAsync(Quiz quiz);
        Task UpdateQuizAsync(Quiz quiz);
        Task<List<Quiz>> GetQuizzesByLessonIdAsync(int lessonId);
        Task<bool> SubmitQuizResultAsync(QuizResult quizResult);
        Task<QuizResult> GetLatestQuizResultByUserAsync(int userId, int lessonId);
        Task<List<QuizResult>> GetUserQuizResultsAsync(int userId);
        Task<List<QuizResult>> GetAllQuizResultsAsync();
        Task<List<QuizResult>> GetSortedQuizResultsAsync(string order);
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

        public async Task<bool> SubmitQuizResultAsync(QuizResult quizResult)
        {
            await _context.QuizResults.AddAsync(quizResult);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<QuizResult> GetLatestQuizResultByUserAsync(int userId, int lessonId)
        {
            return await _context.QuizResults
                .Where(q => q.UserId == userId && q.LessonId == lessonId)
                .OrderByDescending(q => q.SubmittedAt)
                .FirstOrDefaultAsync(); // Lấy bài kiểm tra mới nhất
        }

        public async Task<List<QuizResult>> GetUserQuizResultsAsync(int userId)
        {
            return await _context.QuizResults
                .Where(q => q.UserId == userId)
                .OrderByDescending(q => q.SubmittedAt) // Xếp theo thời gian mới nhất
                .ToListAsync();
        }

        public async Task<List<QuizResult>> GetAllQuizResultsAsync()
        {
            return await _context.QuizResults
                .OrderByDescending(q => q.SubmittedAt)
                .ToListAsync();
        }

        public async Task<List<QuizResult>> GetSortedQuizResultsAsync(string order)
        {
            var query = _context.QuizResults.AsQueryable();

            query = order.ToLower() == "asc"
                ? query.OrderBy(q => q.Score)
                : query.OrderByDescending(q => q.Score);

            return await query.ToListAsync();
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
