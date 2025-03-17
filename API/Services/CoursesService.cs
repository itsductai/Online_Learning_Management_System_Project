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
        Task<Course?> CreateCourse(CreateCourseDto courseDto);
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
            List<Enrollment> enrollments = new List<Enrollment>();

            // Nếu là Student, lấy danh sách Enrollments của User
            if (isStudent && userId.HasValue)
            {
                enrollments = await _coursesRepository.GetEnrollmentsByUserId(userId.Value);
            }

            return courses.Select(c =>
            {
                var enrollment = enrollments.FirstOrDefault(e => e.CourseId == c.CourseId); // Tìm Enrollment theo CourseId

                return new CoursesDto
                {
                    CourseId = c.CourseId,
                    Title = c.Title,
                    ImageUrl = c.ImageUrl,
                    Description = c.Description,
                    Price = c.Price,
                    IsPaid = c.IsPaid,
                    CreatedAt = c.CreatedAt,
                    IsComplete = isStudent && enrollment != null ? enrollment.IsCompleted : false,
                    IsJoin = isStudent && enrollment != null // Nếu có Enrollment, nghĩa là đã tham gia
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

        public async Task<Course?> CreateCourse(CreateCourseDto courseDto)
        {
            var course = new Course
            {
                Title = courseDto.Title,
                ImageUrl = courseDto.ImageUrl,
                Description = courseDto.Description,
                Price = courseDto.Price,
                IsPaid = courseDto.IsPaid,
                CreatedAt = DateTime.UtcNow
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

            return await _coursesRepository.UpdateCourse(existingCourse);
        }

        public async Task<bool> DeleteCourse(int id)
        {
            return await _coursesRepository.DeleteCourse(id);
        }
    }
}
