// API/Chat/Controllers/ConversationsController.cs
using API.Chat.Common;
using API.Chat.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

}
