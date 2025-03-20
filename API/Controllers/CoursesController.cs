using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static API.DTOs.CoursesDTO;

namespace API.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ICoursesService _coursesService;

        public CoursesController(ICoursesService coursesService)
        {
            _coursesService = coursesService;
        }

        // GET: Lấy tất cả khóa học
        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            int? userId = userIdClaim != null ? int.Parse(userIdClaim.Value) : null;
            bool isStudent = roleClaim == "Student"; // Kiểm tra nếu user là Student

            var res = await _coursesService.GetAllCourses(userId, isStudent);
            return Ok(res);
        }



        // GET: Lấy khóa học theo từ khóa
        [HttpGet("text")]
        public async Task<IActionResult> GetCourseByText([FromQuery] string request)
        {
            var res = await _coursesService.GetCoursesByText(request);
            return Ok(res);
        }

        // POST: Thêm khóa học mới
        [Authorize(Policy = "RequireInstructorOrAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto courseDto) // Luôn truyền InstructorId từ json ban đầu
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value); // Lấy UserId từ token
            var role = User.FindFirst(ClaimTypes.Role).Value; // Lấy Role từ token

            if (role == "Instructor") // Nếu là Instructor, gán InstructorId từ token
            {
                courseDto.InstructorId = userId; // Chỉ Instructor được tạo khóa học của riêng họ
                var result = await _coursesService.CreateCourse(courseDto, userId);
                return result != null ? Ok(result) : BadRequest("Không thể tạo khóa học.");
            }
            if (role == "Admin") // Nếu là Admin, gán InstructorId từ json
            {
                userId = courseDto.InstructorId.Value; // Gán InstructorId từ json
                var result = await _coursesService.CreateCourse(courseDto, userId); // Nếu là Admin, userId sẽ là của Instructor
                return result != null ? Ok(result) : BadRequest("Không thể tạo khóa học.");
            }
            return BadRequest("Không thể tạo khóa học.");
        }

        // PUT: Cập nhật khóa học
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateCourseDto courseDto)
        {
            var result = await _coursesService.UpdateCourse(id, courseDto);
            if (result == null) return NotFound("Khóa học không tồn tại");
            return Ok(result);
        }

        // DELETE: Xóa khóa học
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            var result = await _coursesService.DeleteCourse(id);
            if (!result) return NotFound("Khóa học không tồn tại");
            return Ok("Xóa khóa học thành công");
        }
    }
}
