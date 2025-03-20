using Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public interface IProgressRepository
    {
        Task<IDbContextTransaction> BeginTransactionAsync(); // Hỗ trợ Transaction
        Task<bool> CheckEnrollmentAsync(int userId, int courseId);
        Task CreateEnrollmentAsync(int userId, int courseId);
        Task<bool> UpdateLessonProgressAsync(int userId, int lessonId);
        Task InitializeLessonProgressAsync(int userId, int courseId);
        Task<Enrollment?> GetEnrollmentAsync(int userId, int courseId);
        Task<List<int>> GetCompletedLessonsAsync(int userId, int courseId);
        Task<List<Enrollment>> GetAllEnrollmentsAsync();
        Task<int> GetTotalLessonsInCourseAsync(int courseId);
        Task<int> GetLastLessonIdInCourseAsync(int courseId);
        Task UpdateEnrollmentCompletionStatusAsync(int userId, int courseId, bool isCompleted, double ProgressPercent);
        // tudent
        Task<int> GetTotalEnrollmentsAsync(); // Lấy số khóa học đã tham gia
        Task<int> GetCompletedEnrollmentsAsync(); // Lấy số khóa học đã hoàn thành
        Task<List<int>> GetCompletedLessonsAsync(int userId); // Lấy tất cả bài học đã hoàn thành của user
        Task<float> GetAverageProgressAsync(int userId); // Lấy tiến độ trung bình của user
        Task<List<int>> GetCompletedLessonDurationsAsync(int userId); // Lấy thời gian học (minutes) từ bài học hoàn thành
        Task<int> GetTotalEnrollmentsByIdAsync(int userId);
        Task<int> GetCompletedEnrollmentsByIdAsync(int userId);

        // Admin
        Task<int> GetTotalStudentsAsync(); // Lấy tổng số học viên
        Task<int> GetTotalCoursesAsync(); // Lấy tổng số khóa học
        Task<int> GetTotalLessonsAsync(); // Lấy tổng số bài học
    }

    public class ProgressRepository : IProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public ProgressRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            return await _context.Database.BeginTransactionAsync(); // Mở transaction
        }

        // Kiểm tra xem học viên đã ghi danh vào khóa học chưa
        public async Task<bool> CheckEnrollmentAsync(int userId, int courseId)
        {
            return await _context.Enrollments.AnyAsync(e => e.UserId == userId && e.CourseId == courseId);
        }

        // Thêm học viên vào bảng Enrollments khi ghi danh
        public async Task CreateEnrollmentAsync(int userId, int courseId)
        {
            var enrollment = new Enrollment
            {
                UserId = userId,
                CourseId = courseId,
                IsCompleted = false,
                ProgressPercent = 0,
                CreatedAt = DateTime.UtcNow.AddHours(7)
            };
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
        }

        // Cập nhật danh sách bài học đã hoàn thành của học viên
        public async Task<bool> UpdateLessonProgressAsync(int userId, int lessonId)
        {
            var progress = await _context.LessonProgress
                .FirstOrDefaultAsync(lp => lp.UserId == userId && lp.LessonId == lessonId);

            if (progress == null)
            {
                // Nếu chưa tồn tại, tạo mới bản ghi
                progress = new LessonProgress
                {
                    UserId = userId,
                    LessonId = lessonId,
                    IsCompleted = true,
                    CompletedAt = DateTime.UtcNow.AddHours(7)
                };
                _context.LessonProgress.Add(progress);
            }
            else
            {
                // Nếu đã tồn tại, cập nhật trạng thái hoàn thành
                progress.IsCompleted = true;
                progress.CompletedAt = DateTime.UtcNow.AddHours(7);
            }

            await _context.SaveChangesAsync();
            return true;
        }


        // Khởi tạo LessonProgress rỗng khi học viên ghi danh khóa học
        public async Task InitializeLessonProgressAsync(int userId, int courseId)
        {
            var lessons = await _context.Lessons.Where(l => l.CourseId == courseId).ToListAsync();

            var lessonProgressList = lessons.Select(lesson => new LessonProgress
            {
                UserId = userId,
                LessonId = lesson.LessonId,
                IsCompleted = false,
                CompletedAt = null
            }).ToList();

            _context.LessonProgress.AddRange(lessonProgressList);
            await _context.SaveChangesAsync();
        }

        // Lấy thông tin Enrollment của học viên
        public async Task<Enrollment?> GetEnrollmentAsync(int userId, int courseId)
        {
            return await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);
        }

        // Lấy danh sách bài học đã hoàn thành của học viên
        public async Task<List<int>> GetCompletedLessonsAsync(int userId, int courseId)
        {
            return await _context.LessonProgress
                .Where(lp => lp.UserId == userId && lp.IsCompleted)
                .Select(lp => lp.LessonId)
                .ToListAsync();
        }

        // Lấy tổng số bài học trong khóa học
        public async Task<int> GetTotalLessonsInCourseAsync(int courseId)
        {
            return await _context.Lessons.CountAsync(l => l.CourseId == courseId);
        }

        // Lấy ID của bài học cuối cùng trong khóa học
        public async Task<int> GetLastLessonIdInCourseAsync(int courseId)
        {
            return await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .OrderByDescending(l => l.LessonId)
                .Select(l => l.LessonId)
                .FirstOrDefaultAsync();
        }

        // Cập nhật trạng thái hoàn thành khóa học
        public async Task UpdateEnrollmentCompletionStatusAsync(int userId, int courseId, bool isCompleted, double ProgressPercent)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment != null)
            {
                enrollment.IsCompleted = isCompleted;
                enrollment.ProgressPercent = (float)ProgressPercent;
                if (isCompleted)
                {
                    enrollment.CompletionDate = DateTime.UtcNow.AddHours(7);
                }
                await _context.SaveChangesAsync();
            }
        }

        // Lấy danh sách tất cả học viên đã ghi danh
        public async Task<List<Enrollment>> GetAllEnrollmentsAsync()
        {
            return await _context.Enrollments.Include(e => e.User).ToListAsync();
        }

        // Đếm tổng số lượt ghi danh khóa học
        public async Task<int> GetTotalEnrollmentsAsync()
        {
            return await _context.Enrollments.CountAsync();
        }

        // Đếm số lượt hoàn thành khóa học
        public async Task<int> GetCompletedEnrollmentsAsync()
        {
            return await _context.Enrollments.CountAsync(e => e.IsCompleted);
        }

        public async Task<List<int>> GetCompletedLessonsAsync(int userId)
        {
            return await _context.LessonProgress
                .Where(lp => lp.UserId == userId && lp.IsCompleted)
                .Select(lp => lp.LessonId)
                .ToListAsync();
        }

        public async Task<float> GetAverageProgressAsync(int userId)
        {
            return await _context.Enrollments
                .Where(e => e.UserId == userId)
                .AverageAsync(e => (float?)e.ProgressPercent) ?? 0;
        }

        public async Task<List<int>> GetCompletedLessonDurationsAsync(int userId)
        {
            return await _context.LessonProgress
                .Where(lp => lp.UserId == userId && lp.IsCompleted)
                .Join(_context.Lessons, lp => lp.LessonId, l => l.LessonId, (lp, l) => l.Duration)
                .ToListAsync();
        }

        // 🔹 Admin
        public async Task<int> GetTotalStudentsAsync()
        {
            return await _context.Users
                .Where(u => u.Role == "Student")
                .CountAsync();
        }

        public async Task<int> GetTotalCoursesAsync()
        {
            return await _context.Courses.CountAsync();
        }

        public async Task<int> GetTotalLessonsAsync()
        {
            return await _context.Lessons.CountAsync();
        }
        // Đếm tổng số lượt ghi danh khóa học của một user cụ thể
        public async Task<int> GetTotalEnrollmentsByIdAsync(int userId)
        {
            return await _context.Enrollments.CountAsync(e => e.UserId == userId);
        }

        // Đếm số lượt hoàn thành khóa học của một user cụ thể
        public async Task<int> GetCompletedEnrollmentsByIdAsync(int userId)
        {
            return await _context.Enrollments.CountAsync(e => e.UserId == userId && e.IsCompleted);
        }

    }
}
