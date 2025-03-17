using Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Repositories
{
    public interface IProgressRepository
    {
        Task<bool> CheckEnrollmentAsync(int userId, int courseId);
        Task CreateEnrollmentAsync(int userId, int courseId);
        Task<bool> UpdateLessonProgressAsync(int userId, List<int> completedLessons);
        Task InitializeLessonProgressAsync(int userId, int courseId);
        Task<Enrollment?> GetEnrollmentAsync(int userId, int courseId);
        Task<List<int>> GetCompletedLessonsAsync(int userId, int courseId);
        Task<List<Enrollment>> GetAllEnrollmentsAsync();
        Task<int> GetTotalLessonsInCourseAsync(int courseId);
        Task<int> GetLastLessonIdInCourseAsync(int courseId);
        Task UpdateEnrollmentCompletionStatusAsync(int userId, int courseId, bool isCompleted);
        Task<int> GetTotalEnrollmentsAsync();
        Task<int> GetCompletedEnrollmentsAsync();
    }

    public class ProgressRepository : IProgressRepository
    {
        private readonly ApplicationDbContext _context;

        public ProgressRepository(ApplicationDbContext context)
        {
            _context = context;
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
                CreatedAt = DateTime.UtcNow
            };
            _context.Enrollments.Add(enrollment);
            await _context.SaveChangesAsync();
        }

        // Cập nhật danh sách bài học đã hoàn thành của học viên
        public async Task<bool> UpdateLessonProgressAsync(int userId, List<int> completedLessons)
        {
            var lessonProgress = await _context.LessonProgress
                .Where(lp => lp.UserId == userId && completedLessons.Contains(lp.LessonId))
                .ToListAsync();

            foreach (var progress in lessonProgress)
            {
                progress.IsCompleted = true;
                progress.CompletedAt = DateTime.UtcNow;
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
        public async Task UpdateEnrollmentCompletionStatusAsync(int userId, int courseId, bool isCompleted)
        {
            var enrollment = await _context.Enrollments
                .FirstOrDefaultAsync(e => e.UserId == userId && e.CourseId == courseId);

            if (enrollment != null)
            {
                enrollment.IsCompleted = isCompleted;
                enrollment.ProgressPercent = isCompleted ? 100 : enrollment.ProgressPercent;
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
    }
}
