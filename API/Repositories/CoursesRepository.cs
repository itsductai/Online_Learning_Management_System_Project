using Data.Models;
using Microsoft.EntityFrameworkCore;
using static API.DTOs.CoursesDTO;

namespace API.Repositories
{
    public interface ICoursesRepository
    {
        Task<List<Course?>> GetAllCourses();
        Task<List<Enrollment>> GetEnrollmentsByUserId(int userId);
        Task<List<Course?>> GetCourseByText(string text);
        Task<Course?> GetCourseById(int id);
        Task<Course?> CreateCourse(Course course);
        Task<Course?> UpdateCourse(Course courseDto);
        Task<bool> DeleteCourse(int id);
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

        // Thêm mới: Lấy danh sách Enrollments của User
        public async Task<List<Enrollment>> GetEnrollmentsByUserId(int userId)
        {
            return await _context.Enrollments
                .Where(e => e.UserId == userId)
                .ToListAsync();
        }

        public async Task<List<Course?>> GetCourseByText(string text)
        {
            return await _context.Courses.Where(c => c.Title.Contains(text)).ToListAsync();    // Lấy các khóa học có tên chứa text
        }

        public async Task<Course?> GetCourseById(int id)
        {
            return await _context.Courses.FindAsync(id);
        }

        public async Task<Course?> CreateCourse(Course course)
        {
            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<Course?> UpdateCourse(Course course)
        {
            _context.Courses.Update(course);
            await _context.SaveChangesAsync();
            return course;
        }

        public async Task<bool> DeleteCourse(int id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null) return false;

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
