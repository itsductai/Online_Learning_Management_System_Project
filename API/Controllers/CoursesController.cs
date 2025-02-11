using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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

        // GET: api/<CoursesController>
        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            var res = await _coursesService.GetAllCourses();
            return Ok(res);
        }

        [HttpGet("text")]
        public async Task<IActionResult> GetCourseByText([FromQuery] string request)
        {
            var res = await _coursesService.GetCoursesByText(request);
            return Ok(res);
        }
        //public async Task<IActionResult> Login([FromBody] AuthDTO.LoginRequest request)
        //{
        //    return await _authservice.Login(request);
        //}

        // GET api/<CoursesController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        //// POST api/<CoursesController>
        //[HttpPost]
        //public void Post([FromBody] string value)
        //{
        //}

        //// PUT api/<CoursesController>/5
        //[HttpPut("{id}")]
        //public void Put(int id, [FromBody] string value)
        //{
        //}

        //// DELETE api/<CoursesController>/5
        //[HttpDelete("{id}")]
        //public void Delete(int id)
        //{
        //}
    }
}
