// API/Chat/Controllers/ConversationsController.cs
using API.Chat.Common;
using API.Chat.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.Chat.DTOs;
using System.Security.Claims;

namespace API.Chat.Controllers;

[ApiController]
[Route("api/chat/conversations")]
[Authorize]
public class ConversationsController : ControllerBase
{
    private readonly IConversationService _service;
    public ConversationsController(IConversationService service) { _service = service; }

    [HttpGet]
    public async Task<IActionResult> Mine()
        => Ok(await _service.GetMyAsync(User.RequireUserId()));

    [HttpPost("direct")]
    public async Task<IActionResult> CreateDirect([FromBody] int otherUserId)
        => Ok(await _service.CreateDirectAsync(User.RequireUserId(), otherUserId));

    [HttpDelete("{conversationId:guid}")]
    public async Task<IActionResult> Leave(Guid conversationId)
    {
        var ok = await _service.LeaveAsync(conversationId, User.RequireUserId());
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("group")]
    public async Task<IActionResult> CreateGroup([FromBody] CreateGroupRequest req)
    {
        var me = User.RequireUserId();
        var conv = await _service.CreateGroupAsync(me, req.Title, req.MemberIds ?? new());
        return Ok(conv);
    }

    [HttpPatch("{conversationId:guid}/title")]
    public async Task<IActionResult> RenameGroup(Guid conversationId, [FromBody] UpdateGroupTitleRequest req)
    {
        var me = User.RequireUserId();
        var dto = await _service.RenameGroupAsync(conversationId, me, req.Title);
        return dto == null ? Forbid() : Ok(dto);
    }

    [HttpPost("{conversationId:guid}/members")]
    public async Task<IActionResult> AddMembers(Guid conversationId, [FromBody] AddMembersRequest req)
    {
        var me = User.RequireUserId();
        var ok = await _service.AddMembersAsync(conversationId, me, req.MemberIds ?? new());
        return ok ? NoContent() : Forbid();
    }

    [HttpDelete("{conversationId:guid}/members/{userId:int}")]
    public async Task<IActionResult> RemoveMember(Guid conversationId, int userId)
    {
        var me = User.RequireUserId();
        var ok = await _service.RemoveMemberAsync(conversationId, me, userId);
        return ok ? NoContent() : Forbid();
    }

    [HttpPost("{conversationId:guid}/read")]
    public async Task<IActionResult> Read(Guid conversationId)
    {
        await _service.MarkReadAsync(conversationId, User.RequireUserId());
        return NoContent();
    }

    [HttpGet("{conversationId:guid}/members/mini")]
    public async Task<IActionResult> MembersMini(Guid conversationId)
    {
        var me = User.RequireUserId();
        // var res = await _service.GetMembersMiniAsync(conversationId, me);
        var res = 0;
        return res == null ? Forbid() : Ok(res);
    }

    [HttpGet("{conversationId:guid}/my-role")]
    public async Task<IActionResult> MyRole(Guid conversationId)
    {
        var me = User.RequireUserId();
        var role = await _service.GetMyGroupRoleAsync(conversationId, me);
        return role == null ? Forbid() : Ok(new { role });
    }

}
