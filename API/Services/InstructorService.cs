using API.DTOs;
using API.Repositories;
using Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IInstructorService
    {
        Task<List<InstructorDTO>> GetAllInstructors(); //Lấy danh sách tất cả giảng viên.
        Task<InstructorDTO?> GetInstructorById(int instructorId); //Lấy thông tin chi tiết của 1 giảng viên.
        Task<bool> AssignInstructorToCourse(AssignInstructorDTO assignDto); //Gán giảng viên cho khóa học.
    }
    public class InstructorService : IInstructorService
    {
        private readonly IInstructorRepository _instructorRepository;

        public InstructorService(IInstructorRepository instructorRepository)
        {
            _instructorRepository = instructorRepository;
        }

        public async Task<List<InstructorDTO>> GetAllInstructors()
        {
            var instructors = await _instructorRepository.GetAllInstructors();
            var instructorDtos = new List<InstructorDTO>();

            foreach (var instructor in instructors)
            {
                var courses = await _instructorRepository.GetCoursesByInstructor(instructor.UserId);
                int totalStudents = await _instructorRepository.CountStudentsInInstructorCourses(instructor.UserId);

                instructorDtos.Add(new InstructorDTO
                {
                    UserId = instructor.UserId,
                    Name = instructor.Name,
                    Email = instructor.Email,
                    AvatarUrl = instructor.AvatarUrl,
                    CreatedAt = instructor.CreatedAt,
                    TotalCourses = courses.Count,
                    TotalStudents = totalStudents
                });
            }

            return instructorDtos;
        }

        public async Task<InstructorDTO?> GetInstructorById(int instructorId)
        {
            var instructor = await _instructorRepository.GetInstructorById(instructorId);
            if (instructor == null) return null;

            var courses = await _instructorRepository.GetCoursesByInstructor(instructorId);
            int totalStudents = await _instructorRepository.CountStudentsInInstructorCourses(instructorId);

            return new InstructorDTO
            {
                UserId = instructor.UserId,
                Name = instructor.Name,
                Email = instructor.Email,
                AvatarUrl = instructor.AvatarUrl,
                CreatedAt = instructor.CreatedAt,
                TotalCourses = courses.Count,
                TotalStudents = totalStudents
            };
        }

        public async Task<bool> AssignInstructorToCourse(AssignInstructorDTO assignDto)
        {
            return await _instructorRepository.AssignInstructorToCourse(assignDto.CourseId, assignDto.InstructorId);
        }
    }
}
