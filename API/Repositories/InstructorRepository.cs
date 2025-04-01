using Data.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using API.DTOs;
using Microsoft.EntityFrameworkCore.Storage;

namespace API.Repositories
{
    public interface IInstructorRepository
    {
        Task<List<User>> GetAllInstructors(); // Lấy danh sách tất cả Instructor
        Task<User?> GetInstructorById(int instructorId); // Lấy Instructor theo ID
        Task<List<Course>> GetCoursesByInstructor(int instructorId); // Lấy danh sách khóa học của Instructor
        Task<int> CountStudentsInInstructorCourses(int instructorId); // Đếm số học viên của Instructor
        Task<bool> AssignInstructorToCourse(int courseId, int instructorId); // Gán Instructor vào khóa học
        Task<User> GetUserByEmailAsync(string email); // Lấy User theo Email (dùng cho Service)
        Task<User> CreateUserAsync(User user);
        Task<Instructor> CreateInstructorAsync(Instructor instructor);
        Task<User?> GetInstructorUserByIdAsync(int id);
        Task<Instructor?> GetInstructorProfileByIdAsync(int id);
        Task UpdateUserAsync(User user);
        Task UpdateInstructorAsync(Instructor instructor);
        Task SaveChangesAsync(); // dùng cho transaction bên Service
        Task<IDbContextTransaction> BeginTransactionAsync(); // Mở transaction
    }

    public class InstructorRepository : IInstructorRepository
    {
        private readonly ApplicationDbContext _context;

        public InstructorRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        // Lấy danh sách tất cả Instructor
        public async Task<List<User>> GetAllInstructors()
        {
            return await _context.Users
                .Where(u => u.Role == "Instructor")
                .Include(u => u.InstructorProfile) // Load luôn bảng Instructor để tránh null
                .ToListAsync();

        }

        // Lấy thông tin Instructor theo ID
        public async Task<User?> GetInstructorById(int instructorId)
        {
            return await _context.Users
                .Where(u => u.UserId == instructorId && u.Role == "Instructor")
                .FirstOrDefaultAsync();
        }

        // Lấy danh sách khóa học của Instructor
        public async Task<List<Course>> GetCoursesByInstructor(int instructorId)
        {
            return await _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .ToListAsync();
        }

        // Đếm số học viên của Instructor
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

        public async Task<User> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        // Gán Instructor vào khóa học
        public async Task<bool> AssignInstructorToCourse(int courseId, int instructorId)
        {
            var course = await _context.Courses.FindAsync(courseId);
            if (course == null) return false;

            course.InstructorId = instructorId;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            return user;
        }

        public async Task<Instructor> CreateInstructorAsync(Instructor instructor)
        {
            _context.Instructors.Add(instructor);
            return instructor;
        }

        public async Task<User?> GetInstructorUserByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.UserId == id && u.Role == "Instructor");
        }

        public async Task<Instructor?> GetInstructorProfileByIdAsync(int id)
        {
            return await _context.Instructors.FirstOrDefaultAsync(i => i.UserId == id);
        }

        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
        }

        public async Task UpdateInstructorAsync(Instructor instructor)
        {
            _context.Instructors.Update(instructor);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync();
        }
    }
}
