using API.DTOs;
using API.Repositories;
using Data.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using static API.DTOs.CoursesDTO;

namespace API.Services
{
    public interface ICoursesService
    {
        Task<List<CoursesDto>> GetAllCourses();
        Task<List<CoursesDto>> GetCoursesByText(string text);
    }

    public class CoursesService : ICoursesService
    {
        private readonly ICoursesRepository _coursesRepository;
        public CoursesService(ICoursesRepository coursesRepository)
        {
            _coursesRepository = coursesRepository;
        }

        public async Task<List<CoursesDto>> GetAllCourses()
        {
            List<Course?> courses = await _coursesRepository.GetAllCourses();
            return courses.Select(c => new CoursesDto
            {
                CourseId = c.CourseId,
                Title = c.Title,
                ImageUrl = c.ImageUrl,
                Description = c.Description,
                Price = c.Price,
                CreatedAt = c.CreatedAt

            }).ToList();
        }
        public async Task<List<CoursesDto>> GetCoursesByText(string text)
        {
            List<Course?> courses = await _coursesRepository.GetCourseByText(text);
            return courses.Select(c => new CoursesDto
            {
                CourseId = c.CourseId,
                Title = c.Title,
                ImageUrl = c.ImageUrl,
                Description = c.Description,
                Price = c.Price,
                CreatedAt = c.CreatedAt

            }).ToList();
        }

    }
}
