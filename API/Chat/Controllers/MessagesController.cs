// API/Chat/Controllers/MessagesController.cs
using API.Chat.Common;
using API.Chat.DTOs;
using API.Chat.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Chat.Controllers;

[ApiController]
[Route("api/chat/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _service;
    public MessagesController(IMessageService service) { _service = service; }

    [HttpGet("{conversationId:guid}")]
    public async Task<IActionResult> Page(Guid conversationId, [FromQuery] DateTime? before, [FromQuery] int pageSize = 30)
        => Ok(await _service.GetPageAsync(User.RequireUserId(), conversationId, before, pageSize));

    public class SendRequest { public string Content { get; set; } = ""; public List<AttachmentDTO>? Attachments { get; set; } }
    [HttpPost("{conversationId:guid}")]
    public async Task<IActionResult> Send(Guid conversationId, [FromBody] SendRequest req)
        => Ok(await _service.SendAsync(User.RequireUserId(), conversationId, req.Content, req.Attachments));
}
