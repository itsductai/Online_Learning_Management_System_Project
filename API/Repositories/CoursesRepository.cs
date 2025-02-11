using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface ICoursesRepository
    {
        Task<List<Course?>> GetAllCourses();
        Task<List<Course?>> GetCourseByText(string text);
    }

    public class CoursesRepository : ICoursesRepository
    {
        private readonly ApplicationDbContext _context;

        public CoursesRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Course?>> GetAllCourses()
        {
            return await _context.Courses.ToListAsync();    // Lấy tất cả các khóa học
        }

        public async Task<List<Course?>> GetCourseByText(string text)
        {
            return await _context.Courses.Where(c => c.Title.Contains(text)).ToListAsync();    // Lấy các khóa học có tên chứa text
        }
    }
}
