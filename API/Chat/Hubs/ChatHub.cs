// API/Chat/Hubs/ChatHub.cs
using API.Chat.Common;
using API.Chat.DTOs;
using API.Chat.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.Chat.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IConversationService _conv;
    private readonly IMessageService _msg;
    public ChatHub(IConversationService conv, IMessageService msg) { _conv = conv; _msg = msg; }

    public async Task JoinConversation(Guid conversationId)
    {
        var uid = Context.User!.RequireUserId();
        var ok = await _conv.EnsureMemberAsync(conversationId, uid);
        if (!ok) throw new HubException("Not a member");
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
    }

    public async Task Typing(Guid conversationId)
    {
        var uid = Context.User!.RequireUserId();
        await Clients.OthersInGroup(conversationId.ToString())
                     .SendAsync("Typing", conversationId, uid, DateTime.UtcNow);
    }

    public async Task SendMessage(Guid conversationId, string content, List<AttachmentDTO>? atts)
    {
        var uid = Context.User!.RequireUserId();
        var dto = await _msg.SendAsync(uid, conversationId, content, atts);
        await Clients.Group(conversationId.ToString()).SendAsync("MessageCreated", dto);
    }
}
