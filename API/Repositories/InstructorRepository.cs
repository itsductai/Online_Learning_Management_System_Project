using Data.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace API.Repositories
{
    public interface IInstructorRepository
    {
        Task<List<User>> GetAllInstructors(); // Lấy danh sách tất cả Instructor
        Task<User?> GetInstructorById(int instructorId); // Lấy Instructor theo ID
        Task<List<Course>> GetCoursesByInstructor(int instructorId); // Lấy danh sách khóa học của Instructor
        Task<int> CountStudentsInInstructorCourses(int instructorId); // Đếm số học viên của Instructor
        Task<bool> AssignInstructorToCourse(int courseId, int instructorId); // Gán Instructor vào khóa học
    }
    public class InstructorRepository : IInstructorRepository
    {
        private readonly ApplicationDbContext _context;

        public InstructorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> GetAllInstructors()
        {
            return await _context.Users
                .Where(u => u.Role == "Instructor")
                .ToListAsync();
        }

        public async Task<User?> GetInstructorById(int instructorId)
        {
            return await _context.Users
                .Where(u => u.UserId == instructorId && u.Role == "Instructor")
                .FirstOrDefaultAsync();
        }

        public async Task<List<Course>> GetCoursesByInstructor(int instructorId)
        {
            return await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .ToListAsync();
        }

        public async Task<int> CountStudentsInInstructorCourses(int instructorId)
        {
            var courses = await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .Select(c => c.CourseId)
                .ToListAsync();

            return await _context.Enrollments
                .Where(e => courses.Contains(e.CourseId))
                .CountAsync();
        }

        public async Task<bool> AssignInstructorToCourse(int courseId, int instructorId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return false;

            course.InstructorId = instructorId;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
