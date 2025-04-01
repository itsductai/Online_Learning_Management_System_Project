using API.DTOs;
using API.Repositories;
using BCrypt.Net;
using Data.Models;
using Microsoft.EntityFrameworkCore;
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
        Task<bool> CreateInstructorAsync(CreateInstructorDTO dto); //Tạo giảng viên mới.
        Task<bool> UpdateInstructorAsync(int userId, UpdateInstructorDTO dto); //Cập nhật thông tin giảng viên.

        Task<bool> DisableInstructorAsync(int userId); //Vô hiệu hóa giảng viên.
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
                    TotalStudents = totalStudents,
                    Specialization = instructor.InstructorProfile?.Specialization,
                    Bio = instructor.InstructorProfile?.Bio,
                    IsActive = instructor.IsActive
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
                TotalStudents = totalStudents,
                Specialization = instructor.InstructorProfile?.Specialization,
                Bio = instructor.InstructorProfile?.Bio,
                IsActive = instructor.IsActive
            };
        }

        public async Task<bool> AssignInstructorToCourse(AssignInstructorDTO assignDto)
        {
            return await _instructorRepository.AssignInstructorToCourse(assignDto.CourseId, assignDto.InstructorId);
        }

        public async Task<bool> CreateInstructorAsync(CreateInstructorDTO dto)
        {
            var existingUser = await _instructorRepository.GetUserByEmailAsync(dto.Email);
            if (existingUser != null) return false; // Email đã tồn tại

            using var transaction = await _instructorRepository.BeginTransactionAsync();

            try
            {
                var user = new User
                {
                    Name = dto.Name,
                    Email = dto.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "Instructor",
                    AvatarUrl = dto.AvatarUrl ?? "https://i.pinimg.com/736x/7b/12/d2/7b12d287221c0adf5b4efcdf326c178f.jpg"
                };
                await _instructorRepository.CreateUserAsync(user);
                await _instructorRepository.SaveChangesAsync();

                var instructor = new Instructor
                {
                    UserId = user.UserId,
                    Specialization = dto.Specialization,
                    Bio = dto.Bio
                };
                await _instructorRepository.CreateInstructorAsync(instructor);
                await _instructorRepository.SaveChangesAsync();
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> UpdateInstructorAsync(int userId, UpdateInstructorDTO dto)
        {
            using var transaction = await _instructorRepository.BeginTransactionAsync();

            try
            {
                var user = await _instructorRepository.GetInstructorUserByIdAsync(userId);
                var instructor = await _instructorRepository.GetInstructorProfileByIdAsync(userId);
                if (user == null) return false;

                user.Name = dto.Name;
                user.AvatarUrl = dto.AvatarUrl ?? user.AvatarUrl;
                if (instructor == null)
                {
                    var newinstructor = new Instructor
                    {
                        UserId = user.UserId,
                        Specialization = dto.Specialization,
                        Bio = dto.Bio
                    };

                    await _instructorRepository.CreateInstructorAsync(newinstructor);
                }
                else
                {
                    instructor.Specialization = dto.Specialization;
                    instructor.Bio = dto.Bio;
                    await _instructorRepository.UpdateInstructorAsync(instructor);
                }


                await _instructorRepository.UpdateUserAsync(user);

                await _instructorRepository.SaveChangesAsync();

                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<bool> DisableInstructorAsync(int userId)
        {
            var user = await _instructorRepository.GetInstructorUserByIdAsync(userId);
            if (user == null) return false;

            user.IsActive = !user.IsActive;

            await _instructorRepository.UpdateUserAsync(user);
            await _instructorRepository.SaveChangesAsync();
            return true;
        }
    }
}
