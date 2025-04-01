using API.Repositories;
using Data.Models;
using static API.DTOs.ProgressDTO;

namespace API.Services
{
    public interface IProgressService
    {
        Task<bool> EnrollInCourseAsync(int userId, int courseId);
        Task<bool> UpdateLessonProgressAsync(int userId, ProgressUpdateDto progressDto);
        Task<UserProgressDto> GetUserProgressAsync(int userId, int courseId);
        Task<IEnumerable<EnrollmentResponseDto>> GetEnrollmentsAsync(int userId, string role);
        Task<ProgressStatisticsDto> GetProgressStatisticsAsync(int userId, string role);
        Task<ProcessDTO> GetProcessAsync(int userId, string role);
        Task<List<StudentEnrollmentDto>> GetStudentEnrollmentsAsync(int userId, string role);
    }

    public class ProgressService : IProgressService
    {
        private readonly IProgressRepository _progressRepository;
        private readonly ICoursesRepository _courseRepository;
        private readonly IUsersRepository _userRepository;

        public ProgressService(
            IProgressRepository progressRepository,
            ICoursesRepository courseRepository,
            IUsersRepository userRepository)
        {
            _progressRepository = progressRepository;
            _courseRepository = courseRepository;
            _userRepository = userRepository;
        }

        // Ghi danh khóa học (Sử dụng Transaction để đảm bảo tính toàn vẹn dữ liệu)
        public async Task<bool> EnrollInCourseAsync(int userId, int courseId)
        {
            using var transaction = await _progressRepository.BeginTransactionAsync();
            try
            {
                // Kiểm tra xem học viên đã ghi danh chưa
                if (await _progressRepository.CheckEnrollmentAsync(userId, courseId))
                    return false;

                // Tạo bản ghi mới trong bảng Enrollments
                await _progressRepository.CreateEnrollmentAsync(userId, courseId);

                // Khởi tạo dữ liệu LessonProgress
                await _progressRepository.InitializeLessonProgressAsync(userId, courseId);

                await transaction.CommitAsync(); // Commit Transaction nếu thành công
                return true;
            }
            catch
            {
                await transaction.RollbackAsync(); // Rollback nếu có lỗi
                return false;
            }
        }

        // Cập nhật tiến trình học tập
        public async Task<bool> UpdateLessonProgressAsync(int userId, ProgressUpdateDto progressDto)
        {
            using var transaction = await _progressRepository.BeginTransactionAsync();
            try
            {
                // Lấy tổng số bài học hiện tại trong khóa học
                int totalLessons = await _progressRepository.GetTotalLessonsInCourseAsync(progressDto.CourseId);

                // Lấy danh sách bài học đã hoàn thành
                var completedLessons = await _progressRepository.GetCompletedLessonsAsync(userId, progressDto.CourseId);

                // Lấy danh sách bài học mới hoàn thành từ request
                var newCompletedLessons = progressDto.CompletedLessons;

                // Cập nhật các bài học mới hoàn thành
                foreach (var lessonId in newCompletedLessons)
                {
                    // Chỉ cập nhật nếu bài học tồn tại và chưa hoàn thành
                    if (!completedLessons.Contains(lessonId))
                    {
                        bool success = await _progressRepository.UpdateLessonProgressAsync(userId, lessonId);
                        if (!success)
                        {
                            await transaction.RollbackAsync();
                            return false;
                        }
                        completedLessons.Add(lessonId);
                    }
                }

                // Lấy ID của bài học cuối cùng trong khóa học
                int lastLessonId = await _progressRepository.GetLastLessonIdInCourseAsync(progressDto.CourseId);

                // Kiểm tra nếu danh sách bài học hoàn thành có chứa bài học cuối cùng
                bool containsLastLesson = completedLessons.Contains(lastLessonId);

                // Kiểm tra nếu tất cả bài học đã hoàn thành
                bool isCourseCompleted = containsLastLesson && completedLessons.Count == totalLessons;

                // Tính toán lại tiến trình
                double progressPercent = 0;
                if (totalLessons > 0)
                {
                    // Đảm bảo số bài học hoàn thành không vượt quá tổng số bài học
                    int actualCompletedCount = Math.Min(completedLessons.Count, totalLessons);
                    progressPercent = Math.Round((double)actualCompletedCount / totalLessons * 100, 2);
                }

                // Cập nhật trạng thái hoàn thành khóa học trong bảng Enrollment
                await _progressRepository.UpdateEnrollmentCompletionStatusAsync(userId, progressDto.CourseId, isCourseCompleted, progressPercent);

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        // Lấy tiến trình của học viên trong một khóa học
        public async Task<UserProgressDto> GetUserProgressAsync(int userId, int courseId)
        {
            var enrollment = await _progressRepository.GetEnrollmentAsync(userId, courseId);
            if (enrollment == null) return null;

            // Lấy tổng số bài học hiện tại trong khóa học (true)
            int totalLessons = await _progressRepository.GetTotalLessonsInCourseAsync(courseId);

            // Lấy danh sách bài học đã hoàn thành
            var completedLessons = await _progressRepository.GetCompletedLessonsAsync(userId, courseId);

            // Lấy tổng số bài học đã hoàn thành
            int totalCompletedLessons = completedLessons.Count;

            // Lấy ID của bài học cuối cùng trong khóa học
            int lastLessonId = await _progressRepository.GetLastLessonIdInCourseAsync(courseId);

            // Kiểm tra nếu danh sách bài học hoàn thành có chứa bài học cuối cùng
            bool containsLastLesson = completedLessons.Contains(lastLessonId);

            // Kiểm tra nếu tất cả bài học đã hoàn thành
            bool isCourseCompleted = totalCompletedLessons == totalLessons && containsLastLesson;

            // Tính toán lại tiến trình
            double progressPercent = 0;
            if (totalLessons > 0)
            {
                progressPercent = Math.Round((double)totalCompletedLessons / totalLessons * 100, 2);
            }

            // Cập nhật lại tiến trình trong database
            await _progressRepository.UpdateEnrollmentCompletionStatusAsync(userId, courseId, isCourseCompleted, progressPercent);

            return new UserProgressDto
            {
                CourseId = courseId,
                CompletedLessons = completedLessons,
                ProgressPercent = progressPercent,
                LastUpdated = DateTime.Now,
                IsCompleted = isCourseCompleted
            };
        }

        // Lấy danh sách học viên đã ghi danh
        public async Task<IEnumerable<EnrollmentResponseDto>> GetEnrollmentsAsync(int userId, string role)
        {
            if (role == "Admin")
            {
                // Admin xem tất cả enrollments
                var enrollments = await _progressRepository.GetAllEnrollmentsAsync();
                return enrollments.Select(e => new EnrollmentResponseDto
                {
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    ProgressPercent = e.ProgressPercent,
                    CreatedAt = e.CreatedAt
                });
            }
            else if (role == "Instructor")
            {
                // Instructor chỉ xem enrollments của các khóa học mình phụ trách
                var enrollments = await _progressRepository.GetEnrollmentsByInstructorIdAsync(userId);
                return enrollments.Select(e => new EnrollmentResponseDto
                {
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    ProgressPercent = e.ProgressPercent,
                    CreatedAt = e.CreatedAt
                });
            }
            return Enumerable.Empty<EnrollmentResponseDto>();
        }

        // Lấy thống kê số lượng học viên
        public async Task<ProgressStatisticsDto> GetProgressStatisticsAsync(int userId, string role)
        {
            if (role == "Admin")
            {
                // Admin xem thống kê toàn bộ hệ thống
                int total = await _progressRepository.GetTotalEnrollmentsAsync();
                int completed = await _progressRepository.GetCompletedEnrollmentsAsync();
                return new ProgressStatisticsDto
                {
                    TotalEnrollments = total,
                    CompletedEnrollments = completed
                };
            }
            else if (role == "Instructor")
            {
                // Instructor chỉ xem thống kê của các khóa học mình phụ trách
                int total = await _progressRepository.GetTotalEnrollmentsByInstructorIdAsync(userId);
                int completed = await _progressRepository.GetCompletedEnrollmentsByInstructorIdAsync(userId);
                return new ProgressStatisticsDto
                {
                    TotalEnrollments = total,
                    CompletedEnrollments = completed
                };
            }
            return new ProgressStatisticsDto();
        }

        // Lấy thống kê tiến trình học với role khác nhau và dữ liệu stats
        public async Task<ProcessDTO> GetProcessAsync(int userId, string role)
        {
            var processDto = new ProcessDTO();

            if (role == "Student")
            {
                processDto.TotalEnrolledCourses = await _progressRepository.GetTotalEnrollmentsByIdAsync(userId);
                processDto.CompletedCourses = await _progressRepository.GetCompletedEnrollmentsByIdAsync(userId);

                // Tính tổng thời gian học (minutes)
                var durations = await _progressRepository.GetCompletedLessonDurationsAsync(userId);
                int totalMinutes = durations.Sum();
                processDto.TotalStudyTime = new int[] { totalMinutes / 60, totalMinutes % 60 };

                processDto.AverageProgress = await _progressRepository.GetAverageProgressAsync(userId);
            }
            else if (role == "Admin")
            {
                processDto.TotalStudents = await _progressRepository.GetTotalStudentsAsync();
                processDto.TotalCourses = await _progressRepository.GetTotalCoursesAsync();
                processDto.TotalLessons = await _progressRepository.GetTotalLessonsAsync();
            }

            return processDto;
        }

        public async Task<List<StudentEnrollmentDto>> GetStudentEnrollmentsAsync(int userId, string role)
        {
            var result = new List<StudentEnrollmentDto>();

            if (role == "Admin")
            {
                // Lấy tất cả học viên có role Student
                var students = await _progressRepository.GetAllStudentsAsync();

                foreach (var student in students)
                {
                    // Lấy tất cả enrollment của học viên
                    var enrollments = await _progressRepository.GetEnrollmentsByUserIdAsync(student.UserId);

                    var studentDto = new StudentEnrollmentDto
                    {
                        UserId = student.UserId,
                        UserName = student.Name,
                        IsActive = student.IsActive,
                        Email = student.Email,
                        Enrollments = enrollments.Select(e => new EnrollmentInfoDto
                        {
                            CourseId = e.CourseId,
                            IsCompleted = e.IsCompleted,
                            ProgressPercent = e.ProgressPercent
                        }).ToList()
                    };

                    result.Add(studentDto);
                }
            }
            else if (role == "Instructor")
            {
                // Lấy danh sách khóa học của instructor
                var instructorCourses = await _courseRepository.GetCoursesByInstructorIdAsync(userId);
                var courseIds = instructorCourses.Select(c => c.CourseId).ToList();

                // Lấy tất cả enrollment trong các khóa học của instructor
                var enrollments = await _progressRepository.GetEnrollmentsByCourseIdsAsync(courseIds);

                // Nhóm enrollment theo userId
                var studentIds = enrollments.Select(e => e.UserId).Distinct();

                foreach (var studentId in studentIds)
                {
                    var student = await _userRepository.GetUserById(studentId);
                    if (student == null) continue;

                    var studentEnrollments = enrollments.Where(e => e.UserId == studentId);

                    var studentDto = new StudentEnrollmentDto
                    {
                        UserId = student.UserId,
                        UserName = student.Name,
                        IsActive = student.IsActive,
                        Email = student.Email,
                        Enrollments = studentEnrollments.Select(e => new EnrollmentInfoDto
                        {
                            CourseId = e.CourseId,
                            IsCompleted = e.IsCompleted,
                            ProgressPercent = e.ProgressPercent
                        }).ToList()
                    };

                    result.Add(studentDto);
                }
            }

            return result;
        }
    }
}
