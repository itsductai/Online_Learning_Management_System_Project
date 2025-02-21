using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;
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
            var res = await _coursesService.GetAllCourses();
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
        [HttpPost]
        public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto courseDto)
        {
            var result = await _coursesService.CreateCourse(courseDto);
            if (result == null) return BadRequest("Không thể tạo khóa học");
            return Ok(result);
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
