using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LessonController : ControllerBase
    {
        private readonly ILessonService _lessonService;

        public LessonController(ILessonService lessonService)
        {
            _lessonService = lessonService;
        }

        [HttpGet("courses/{courseId}/lessons")]
        public async Task<IActionResult> GetLessonsByCourse(int courseId)
        {
            var lessons = await _lessonService.GetLessonsByCourseAsync(courseId);
            return Ok(lessons);
        }

        // API thêm bài học
        [HttpPost("courses/{courseId}/lessons")]
        public async Task<IActionResult> AddLesson(int courseId, [FromBody] AddLessonDto lessonDto)
        {
            lessonDto.CourseId = courseId;
            await _lessonService.AddLessonAsync(lessonDto);
            return Ok(new { message = "Bài học đã được thêm thành công!" });
        }

        [HttpPut("lessons/{lessonId}")]
        public async Task<IActionResult> UpdateLesson(int lessonId, [FromBody] UpdateLessonDto lessonDto)
        {
            if (lessonDto == null)
                return BadRequest("Dữ liệu không hợp lệ.");

            await _lessonService.UpdateLessonAsync(lessonId, lessonDto);
            return Ok("Cập nhật bài học thành công.");
        }

        [HttpDelete("lessons/{lessonId}")]
        public async Task<IActionResult> DeleteLesson(int lessonId)
        {
            await _lessonService.DeleteLessonAsync(lessonId);
            return Ok("Xóa bài học thành công.");
        }
    }
}
