using API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Services;
using System.Security.Claims;

namespace API.Controllers
{
    [Authorize]
    [ProducesResponseType(401)]
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
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetLessonsByCourse(int courseId)
        {
            // Lấy UserId từ Claims của Token
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                return Unauthorized("Không tìm thấy thông tin người dùng.");
            }
            //var isAdmin = User.IsInRole("Admin"); // Kiểm tra quyền admin
            // Kiểm tra role có phải là Admin hay không
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            bool isAdmin = roleClaim != null && roleClaim.Value == "Admin";

            // Gọi service với biến isAdmin
            var lessons = await _lessonService.GetLessonsByCourseAsync(courseId, isAdmin);
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
