using API.Repositories;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using static API.DTOs.ProgressDTO;

namespace API.Services
{
    public interface IProgressService
    {
        Task<bool> EnrollInCourseAsync(int userId, int courseId);
        Task<bool> UpdateLessonProgressAsync(int userId, ProgressUpdateDto progressDto);
        Task<UserProgressDto> GetUserProgressAsync(int userId, int courseId);
        Task<IEnumerable<EnrollmentResponseDto>> GetEnrollmentsAsync();
        Task<ProgressStatisticsDto> GetProgressStatisticsAsync();
    }

    public class ProgressService : IProgressService
    {
        private readonly IProgressRepository _progressRepository;
        private readonly ApplicationDbContext _context;

        public ProgressService(IProgressRepository progressRepository, ApplicationDbContext context)
        {
            _progressRepository = progressRepository;
            _context = context;
        }

        // Ghi danh khóa học (Sử dụng Transaction)
        public async Task<bool> EnrollInCourseAsync(int userId, int courseId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (await _progressRepository.CheckEnrollmentAsync(userId, courseId))
                    return false;

                await _progressRepository.CreateEnrollmentAsync(userId, courseId);
                await _progressRepository.InitializeLessonProgressAsync(userId, courseId);

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        // Cập nhật tiến trình học tập (Sử dụng Transaction)
        public async Task<bool> UpdateLessonProgressAsync(int userId, ProgressUpdateDto progressDto)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 🟢 Cập nhật danh sách bài học đã hoàn thành
                bool success = await _progressRepository.UpdateLessonProgressAsync(userId, progressDto.CompletedLessons);
                if (!success) return false;

                // 🟢 Lấy tổng số bài học trong khóa học
                int totalLessons = await _progressRepository.GetTotalLessonsInCourseAsync(progressDto.CourseId);

                // 🟢 Lấy ID của bài học cuối cùng trong khóa học
                int lastLessonId = await _progressRepository.GetLastLessonIdInCourseAsync(progressDto.CourseId);

                // 🟢 Kiểm tra nếu danh sách bài học hoàn thành có chứa bài học cuối cùng
                bool containsLastLesson = progressDto.CompletedLessons.Contains(lastLessonId);

                // 🟢 Kiểm tra nếu tất cả bài học đã hoàn thành
                bool isCourseCompleted = containsLastLesson && progressDto.CompletedLessons.Count == totalLessons;

                // 🟢 Cập nhật trạng thái hoàn thành khóa học trong bảng Enrollment
                await _progressRepository.UpdateEnrollmentCompletionStatusAsync(userId, progressDto.CourseId, isCourseCompleted);

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        // Lấy tiến trình của học viên trong một khóa học (thêm `IsCompleted`)
        public async Task<UserProgressDto> GetUserProgressAsync(int userId, int courseId)
        {
            var enrollment = await _progressRepository.GetEnrollmentAsync(userId, courseId);
            if (enrollment == null) return null;

            var completedLessons = await _progressRepository.GetCompletedLessonsAsync(userId, courseId);

            return new UserProgressDto
            {
                CourseId = courseId,
                CompletedLessons = completedLessons,
                ProgressPercent = enrollment.ProgressPercent,
                LastUpdated = enrollment.CreatedAt,
                IsCompleted = enrollment.IsCompleted // 🟢 Thêm trạng thái hoàn thành khóa học
            };
        }


        // Lấy danh sách học viên đã ghi danh
        public async Task<IEnumerable<EnrollmentResponseDto>> GetEnrollmentsAsync()
        {
            var enrollments = await _progressRepository.GetAllEnrollmentsAsync();
            return enrollments.Select(e => new EnrollmentResponseDto
            {
                UserId = e.UserId,
                CourseId = e.CourseId,
                ProgressPercent = e.ProgressPercent,
                CreatedAt = e.CreatedAt
            });
        }

        // Lấy thống kê số lượng học viên
        public async Task<ProgressStatisticsDto> GetProgressStatisticsAsync()
        {
            int total = await _progressRepository.GetTotalEnrollmentsAsync();
            int completed = await _progressRepository.GetCompletedEnrollmentsAsync();

            return new ProgressStatisticsDto
            {
                TotalEnrollments = total,
                CompletedEnrollments = completed
            };
        }
    }
}
