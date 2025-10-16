using API.Chat.DTOs;
using Data.Chat;
using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Chat.Controllers
{
    [ApiController]
    [Route("api/chat/conversations")]
    [Authorize]
    public class GroupInfoController : ControllerBase
    {
        private readonly ChatDbContext _chat;
        private readonly ApplicationDbContext _users;

        public GroupInfoController(ChatDbContext chat, ApplicationDbContext users)
        {
            _chat = chat;
            _users = users;
        }

        // GET /api/chat/conversations/{conversationId}/my-role
        [HttpGet("{conversationId:guid}/my-role")]
        public async Task<IActionResult> GetMyRole(Guid conversationId)
        {
            var me = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var conv = await _chat.Conversations
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conv == null) return NotFound();

            var my = conv.Members.FirstOrDefault(m => m.UserId == me);
            if (my == null) return Forbid();

            return Ok(new { role = my.Role }); // "Admin" | "Member"
        }

        // GET /api/chat/conversations/{conversationId}/members/mini
        [HttpGet("{conversationId:guid}/members/mini")]
        public async Task<IActionResult> GetMembersMini(Guid conversationId)
        {
            var me = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var conv = await _chat.Conversations
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conv == null) return NotFound();

            var my = conv.Members.FirstOrDefault(m => m.UserId == me);
            if (my == null) return Forbid();

            var ids = conv.Members.Select(m => m.UserId).ToList();

            var users = await _users.Users
                .Where(u => ids.Contains(u.UserId))
                .Select(u => new { u.UserId, u.Name, u.AvatarUrl, u.Role })
                .ToListAsync();

            // Lấy role trong group; nếu null/empty → fallback "Admin" (yêu cầu của bạn)
            string FallbackGroupRole(string? r) => string.IsNullOrWhiteSpace(r) ? "Admin" : r!;

            var roleMap = conv.Members.ToDictionary(m => m.UserId, m => FallbackGroupRole(m.Role));

            var items = users.Select(u => new GroupMemberMiniDTO
            {
                UserId = u.UserId,
                Name = u.Name,
                AvatarUrl = u.AvatarUrl,
                GlobalRole = u.Role,                         // Student/Instructor/Admin (toàn cục)
                MemberRole = roleMap.TryGetValue(u.UserId, out var r) ? r : "Admin" // role trong group
            })
            .OrderBy(x => x.Name)
            .ToList();

            var rsp = new GroupMembersMiniResponse
            {
                ConversationId = conv.Id,
                Count = items.Count,
                MyRole = FallbackGroupRole(my.Role),
                Items = items
            };

            return Ok(rsp);
        }

        [HttpGet("{conversationId:guid}/members/full")]
        public async Task<IActionResult> GetMembersFull(Guid conversationId)
        {
            var me = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var conv = await _chat.Conversations
                .Include(c => c.Members)
                .FirstOrDefaultAsync(c => c.Id == conversationId);

            if (conv == null) return NotFound();

            var my = conv.Members.FirstOrDefault(m => m.UserId == me);
            if (my == null) return Forbid();

            var ids = conv.Members.Select(m => m.UserId).ToList();

            var users = await _users.Users
                .Where(u => ids.Contains(u.UserId))
                .Select(u => new { u.UserId, u.Name, u.AvatarUrl, u.Role })
                .ToListAsync();

            string FallbackGroupRole(string? r) => string.IsNullOrWhiteSpace(r) ? "Admin" : r!;
            var memMap = conv.Members.ToDictionary(
                m => m.UserId,
                m => new
                {
                    MemberRole = FallbackGroupRole(m.Role),
                    m.JoinedAt,
                    m.LastReadAt
                });

            var items = users.Select(u =>
            {
                var mm = memMap[u.UserId];
                return new GroupMemberFullDTO
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    AvatarUrl = u.AvatarUrl,
                    GlobalRole = u.Role,          // vai trò hệ thống
                    MemberRole = mm.MemberRole,   // vai trò trong nhóm
                    JoinedAt = mm.JoinedAt,
                    LastReadAt = mm.LastReadAt
                };
            })
            .OrderBy(x => x.Name)
            .ToList();

            var rsp = new GroupMembersFullResponse
            {
                ConversationId = conv.Id,
                Count = items.Count,
                MyRole = FallbackGroupRole(my.Role),
                Items = items
            };

            return Ok(rsp);
        }
    }
}
