using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Authorize]
    [Route("api/instructors")]
    [ApiController]
    public class InstructorController : ControllerBase
    {
        private readonly IInstructorService _instructorService;

        public InstructorController(IInstructorService instructorService)
        {
            _instructorService = instructorService;
        }

        // Lấy danh sách tất cả giảng viên
        [HttpGet]
        public async Task<IActionResult> GetAllInstructors()
        {
            var instructors = await _instructorService.GetAllInstructors();
            return Ok(instructors);
        }

        // Lấy thông tin giảng viên theo ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInstructorById(int id)
        {
            var instructor = await _instructorService.GetInstructorById(id);
            if (instructor == null) return NotFound("Giảng viên không tồn tại.");

            return Ok(instructor);
        }

        // Gán giảng viên vào khóa học (chỉ admin mới có quyền)
        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("assign-course")]
        public async Task<IActionResult> AssignInstructorToCourse([FromBody] AssignInstructorDTO assignDto)
        {
            var result = await _instructorService.AssignInstructorToCourse(assignDto);
            if (!result) return BadRequest("Không thể gán giảng viên vào khóa học.");
            return Ok("Giảng viên đã được gán vào khóa học.");
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateInstructor([FromBody] CreateInstructorDTO dto)
        {
            var result = await _instructorService.CreateInstructorAsync(dto);
            if (!result) return BadRequest("Email đã tồn tại.");
            return Ok("Tạo giảng viên thành công.");
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateInstructor(int userId, [FromBody] UpdateInstructorDTO dto)
        {
            var result = await _instructorService.UpdateInstructorAsync(userId, dto);
            if (!result) return NotFound("Không tìm thấy giảng viên hoặc không hợp lệ.");
            return Ok("Cập nhật giảng viên thành công.");
        }

        [HttpPut("disable/{userId}")]
        public async Task<IActionResult> DisableInstructor(int userId)
        {
            var result = await _instructorService.DisableInstructorAsync(userId);
            if (!result) return NotFound("Không tìm thấy giảng viên hoặc không hợp lệ.");
            return Ok("Đã vô hiệu hóa giảng viên.");
        }
    }
}
