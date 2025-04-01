using API.DTOs;
using API.Repositories;
using Data.Models;
using static API.DTOs.CoursesDTO;

namespace API.Services
{
    public interface ICoursesService
    {
        Task<List<CoursesDto>> GetAllCourses(int? userId, bool isStudent);
        Task<List<CoursesDto>> GetCoursesByText(string text);
        Task<Course?> CreateCourse(CreateCourseDto courseDto, int instructorId);
        Task<Course?> UpdateCourse(int id, UpdateCourseDto courseDto);
        Task<bool> DeleteCourse(int id);
    }

    public class CoursesService : ICoursesService
    {
        private readonly ICoursesRepository _coursesRepository;

        public CoursesService(ICoursesRepository coursesRepository)
        {
            _coursesRepository = coursesRepository;
        }

        public async Task<List<CoursesDto>> GetAllCourses(int? userId, bool isStudent)
        {
            List<Course> courses = await _coursesRepository.GetAllCourses();

            List<Enrollment> enrollments = isStudent && userId.HasValue
                ? await _coursesRepository.GetEnrollmentsByUserId(userId.Value)
                : new List<Enrollment>();

            // 🟢 Gọi duy nhất 1 truy vấn GroupBy để lấy tổng bài học
            Dictionary<int, int> lessonCounts = await _coursesRepository.GetLessonCountsForAllCourses();

            return courses.Select(c =>
            {
                var enrollment = enrollments.FirstOrDefault(e => e.CourseId == c.CourseId);

                return new CoursesDto
                {
                    CourseId = c.CourseId,
                    Title = c.Title,
                    ImageUrl = c.ImageUrl,
                    Description = c.Description,
                    Price = c.Price,
                    IsPaid = c.IsPaid,
                    CreatedAt = c.CreatedAt,
                    ExpiryDate = c.ExpiryDate,
                    InstructorId = c.InstructorId,
                    IsComplete = isStudent && enrollment != null && enrollment.IsCompleted,
                    IsJoin = isStudent && enrollment != null,
                    ProgressPercent = isStudent && enrollment != null ? enrollment.ProgressPercent : 0,
                    TotalLesson = lessonCounts.ContainsKey(c.CourseId) ? lessonCounts[c.CourseId] : 0
                };
            }).ToList();
        }





        public async Task<List<CoursesDto>> GetCoursesByText(string text)
        {
            List<Course> courses = await _coursesRepository.GetCourseByText(text);
            return courses.Select(c => new CoursesDto
            {
                CourseId = c.CourseId,
                Title = c.Title,
                ImageUrl = c.ImageUrl,
                Description = c.Description,
                Price = c.Price,
                IsPaid = c.IsPaid,
                CreatedAt = c.CreatedAt

            }).ToList();
        }

        public async Task<Course?> CreateCourse(CreateCourseDto courseDto, int instructorId)
        {
            var course = new Course
            {
                Title = courseDto.Title,
                ImageUrl = courseDto.ImageUrl,
                Description = courseDto.Description,
                Price = courseDto.Price,
                IsPaid = courseDto.IsPaid,
                CreatedAt = DateTime.UtcNow.AddHours(7),
                ExpiryDate = courseDto.ExpiryDate,
                InstructorId = instructorId // Gán InstructorId khi tạo khóa học
            };
            return await _coursesRepository.CreateCourse(course);
        }

        public async Task<Course?> UpdateCourse(int id, UpdateCourseDto courseDto)
        {
            var existingCourse = await _coursesRepository.GetCourseById(id);
            if (existingCourse == null) return null;

            // Gán giá trị từ DTO vào model
            existingCourse.Title = courseDto.Title;
            existingCourse.ImageUrl = courseDto.ImageUrl;
            existingCourse.Description = courseDto.Description;
            existingCourse.Price = courseDto.Price;
            existingCourse.IsPaid = courseDto.IsPaid;
            existingCourse.ExpiryDate = courseDto.ExpiryDate != null ? DateTime.Parse(courseDto.ExpiryDate) : null;
            existingCourse.InstructorId = courseDto.InstructorId; // Gán InstructorId khi cập nhật khóa học

            return await _coursesRepository.UpdateCourse(existingCourse);
        }

        public async Task<bool> DeleteCourse(int id)
        {
            return await _coursesRepository.DeleteCourse(id);
        }
    }
}
