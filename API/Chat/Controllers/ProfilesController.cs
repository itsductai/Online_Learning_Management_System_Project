using System.Security.Claims;
using System.Threading.Tasks;
using API.Chat.DTOs;
using API.Chat.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Chat.Controllers
{
    [ApiController]
    [Route("api/chat/profiles")]
    [Authorize]
    public class ProfilesController : ControllerBase
    {
        private readonly IUserProfileService _svc;

        public ProfilesController(IUserProfileService svc)
        {
            _svc = svc;
        }

        // GET /api/chat/profiles/{userId}/mini
        [HttpGet("{userId:int}/mini")]
        public async Task<ActionResult<UserProfileMiniDTO>> Mini(int userId)
        {
            var dto = await _svc.GetMiniAsync(userId);
            if (dto == null) return NotFound();
            return Ok(dto);
        }

        // GET /api/chat/profiles/{userId}/full
        [HttpGet("{userId:int}/full")]
        public async Task<ActionResult<UserProfileFullDTO>> Full(int userId)
        {
            var dto = await _svc.GetFullAsync(userId);
            if (dto == null) return NotFound();
            return Ok(dto);
        }
    }
}
