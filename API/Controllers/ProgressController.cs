using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static API.DTOs.ProgressDTO;
using System.Security.Claims;
using API.Services;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/progress")]
    public class ProgressController : ControllerBase
    {
        private readonly IProgressService _progressService;

        public ProgressController(IProgressService progressService)
        {
            _progressService = progressService;
        }

        // Học viên ghi danh khóa học
        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollCourse([FromBody] EnrollmentDto enrollmentDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Người dùng chưa đăng nhập" });

            var result = await _progressService.EnrollInCourseAsync(int.Parse(userId), enrollmentDto.CourseId);
            if (result)
                return Ok(new { message = "Tham gia khóa học thành công" });

            return BadRequest(new { message = "Bạn đã tham gia khóa học này rồi" });
        }

        // Cập nhật tiến trình học tập
        [HttpPut("update")]
        public async Task<IActionResult> UpdateProgress([FromBody] ProgressUpdateDto progressDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Người dùng chưa đăng nhập" });

            var result = await _progressService.UpdateLessonProgressAsync(int.Parse(userId), progressDto);
            if (result)
                return Ok(new { message = "Cập nhật tiến trình thành công" });

            return BadRequest(new { message = "Không thể cập nhật tiến trình" });
        }

        // Lấy tiến trình khóa học của học viên
        [HttpGet("user/{courseId}")]
        public async Task<IActionResult> GetUserProgress(int courseId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new { message = "Người dùng chưa đăng nhập" });

            var progress = await _progressService.GetUserProgressAsync(int.Parse(userId), courseId);
            if (progress == null)
                return NotFound(new { message = "Không tìm thấy tiến trình học" });

            return Ok(progress);
        }

        // Admin - Lấy danh sách học viên đã ghi danh
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/enrollments")]
        public async Task<IActionResult> GetEnrollments()
        {
            var enrollments = await _progressService.GetEnrollmentsAsync();
            return Ok(enrollments);
        }

        // Admin - Thống kê tiến trình học viên
        [Authorize(Roles = "Admin")]
        [HttpGet("admin/statistics")]
        public async Task<IActionResult> GetProgressStatistics()
        {
            var stats = await _progressService.GetProgressStatisticsAsync();
            return Ok(stats);
        }
    }

}
