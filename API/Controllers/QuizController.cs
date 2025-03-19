using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/quiz")]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;

        public QuizController(IQuizService quizService)
        {
            _quizService = quizService;
        }

        // Thêm Quiz Lesson
        [HttpPost]
        public async Task<IActionResult> AddQuiz([FromQuery] int courseId, [FromBody] AddQuizDto quizDto)
        {
            if (quizDto == null || quizDto.Questions == null || quizDto.Questions.Count == 0)
                return BadRequest("Dữ liệu không hợp lệ!");

            var lessonId = await _quizService.AddQuizAsync(courseId, quizDto);
            return Ok(new { message = "Thêm quiz thành công!", lessonId });
        }

        // Cập nhật Quiz Lesson
        [HttpPut("{lessonId}")]
        public async Task<IActionResult> UpdateQuiz(int lessonId, [FromBody] UpdateQuizDto quizDto)
        {
            await _quizService.UpdateQuizAsync(lessonId, quizDto);
            return Ok(new { message = "Cập nhật quiz thành công!" });
        }

        // Submit câu trả lời
        [Authorize(Roles = "Student")]
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitQuiz([FromBody] QuizSubmissionDto submission)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var result = await _quizService.SubmitQuizAsync(userId, submission);
            return Ok(result);
        }

        // Lấy kết quả theo Quiz của học viên
        [HttpGet("result/{lessonId}")]
        public async Task<IActionResult> GetUserResults(int lessonId)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var results = await _quizService.GeQuizResultByUserAsync(userId, lessonId);
            return Ok(results);
        }

        // Lấy kết quả Quiz của học viên
        [HttpGet("results")]
        public async Task<IActionResult> GetUserResults()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
            var results = await _quizService.GetUserQuizResultsAsync(userId);
            return Ok(results);
        }

        // Lấy tất cả kết quả Quiz
        [Authorize(Roles = "Admin")]
        [HttpGet("results/admin")]
        public async Task<IActionResult> GetAllResults()
        {
            var results = await _quizService.GetAllQuizResultsAsync();
            return Ok(results);
        }

        // Lấy kết quả Quiz đã sắp xếp
        [Authorize(Roles = "Admin")]
        [HttpGet("results/sorted")]
        public async Task<IActionResult> GetSortedResults([FromQuery] string order)
        {
            var results = await _quizService.GetSortedQuizResultsAsync(order);
            return Ok(results);
        }
    }
}
