using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;
using API.DTOs;
using static API.DTOs.AuthDTO;
using API.Services;
using static API.Services.AuthService;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.Data;
using Azure.Core;


namespace API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authservice;

        public AuthController(IAuthService authservice)
        {
            _authservice = authservice;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDTO.LoginRequest request)
        {
            return await _authservice.Login(request);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] AuthDTO.RegisterDto model)
        {
            return await _authservice.Register(model);
        }
    }

}
