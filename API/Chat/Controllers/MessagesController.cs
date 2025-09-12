// API/Chat/Controllers/MessagesController.cs
using API.Chat.Common;
using API.Chat.DTOs;
using API.Chat.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace API.Chat.Controllers;

[ApiController]
[Route("api/chat/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _service;
    private readonly IConversationService _conv; //  thêm

    public MessagesController(IMessageService service, IConversationService conv) //  inject
    {
        _service = service;
        _conv = conv;
    }

    [HttpGet("{conversationId:guid}")]
    public async Task<IActionResult> Page(Guid conversationId, [FromQuery] DateTime? before, [FromQuery] int pageSize = 30)
        => Ok(await _service.GetPageAsync(User.RequireUserId(), conversationId, before, pageSize));

    public class SendRequest { public string Content { get; set; } = ""; public List<AttachmentDTO>? Attachments { get; set; } }
    [HttpPost("{conversationId:guid}")]
    public async Task<IActionResult> Send(Guid conversationId, [FromBody] SendRequest req)
        => Ok(await _service.SendAsync(User.RequireUserId(), conversationId, req.Content, req.Attachments));

    [HttpPost("direct")]
    public async Task<IActionResult> SendDirect([FromBody] DirectSendRequest req)
    {
        var me = User.RequireUserId();
        // Tạo/lấy direct
        var conv = await _conv.CreateDirectAsync(me, req.TargetUserId);
        // Gửi tin
        var msg = await _service.SendAsync(me, conv.Id, req.Content, req.Attachments);
        return Ok(new { conversation = conv, message = msg });
    }


}
