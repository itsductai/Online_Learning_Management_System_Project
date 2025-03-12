using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    }
}
