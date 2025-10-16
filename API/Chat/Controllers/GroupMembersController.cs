using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Chat.Services;
using API.Chat.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Chat.Controllers
{
    [ApiController]
    [Route("api/chat/conversations/{conversationId:guid}/members")]
    [Authorize]
    public class GroupMembersController : ControllerBase
    {
        private readonly IConversationRepository _convRepo;
        private readonly IUserProfileService _profile;

        public GroupMembersController(IConversationRepository convRepo, IUserProfileService profile)
        {
            _convRepo = convRepo;
            _profile = profile;
        }

        // GET /api/chat/conversations/{conversationId}/members/mini
        [HttpGet("mini")]
        public async Task<IActionResult> Mini(Guid conversationId)
        {
            var me = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var conv = await _convRepo.GetAsync(conversationId);
            if (conv == null) return NotFound();
            if (!conv.Members.Any(m => m.UserId == me)) return Forbid();

            var ids = conv.Members.Select(m => m.UserId).ToList();
            var list = await _profile.GetMiniBatchAsync(ids);
            return Ok(new { conversationId, count = list.Count, items = list });
        }

        // GET /api/chat/conversations/{conversationId}/members/full
        [HttpGet("full")]
        public async Task<IActionResult> Full(Guid conversationId)
        {
            var me = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var conv = await _convRepo.GetAsync(conversationId);
            if (conv == null) return NotFound();
            if (!conv.Members.Any(m => m.UserId == me)) return Forbid();

            var ids = conv.Members.Select(m => m.UserId).ToList();
            var list = await _profile.GetFullBatchAsync(ids);
            return Ok(new { conversationId, count = list.Count, items = list });
        }
    }
}
