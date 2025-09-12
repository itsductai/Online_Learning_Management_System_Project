using API.Chat.DTOs;
using API.Chat.Services;
using API.Infrastructure;
using Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Chat.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMessageService _messageService;
        private readonly IConversationService _convService;
        private readonly ApplicationDbContext _usersDb;
        private static string UG(int userId) => $"user:{userId}";


        public ChatHub(IMessageService messageService, IConversationService convService, ApplicationDbContext usersDb)
        {
            _messageService = messageService;
            _convService = convService;
            _usersDb = usersDb;
        }

        public async Task JoinConversation(Guid conversationId)
        {
            var me = Context.User!.RequireUserId();
            var isMember = await _convService.EnsureMemberAsync(conversationId, me);
            if (!isMember) throw new HubException("Not a member.");

            await Groups.AddToGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task LeaveConversation(Guid conversationId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, conversationId.ToString());
        }

        public async Task SendMessage(Guid conversationId, string content, List<AttachmentDTO>? attachments)
        {
            var me = Context.User!.RequireUserId();
            var msg = await _messageService.SendAsync(me, conversationId, content, attachments);
            await Clients.Group(conversationId.ToString())
                .SendAsync("MessageCreated", msg);
        }

        public async Task Typing(Guid conversationId)
        {
            var me = Context.User!.RequireUserId();
            // phát "đang nhập" cho những người khác trong room
            var u = await _usersDb.Users
                .Where(x => x.UserId == me)
                .Select(x => new UserSummaryDTO { UserId = x.UserId, Name = x.Name, AvatarUrl = x.AvatarUrl })
                .FirstOrDefaultAsync();

            if (u != null)
            {
                await Clients.OthersInGroup(conversationId.ToString())
                    .SendAsync("UserTyping", u);
            }
        }


        public override async Task OnConnectedAsync()
        {
            var me = Context.User!.RequireUserId();
            await Groups.AddToGroupAsync(Context.ConnectionId, UG(me));
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var me = Context.User!.RequireUserId();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, UG(me));
            await base.OnDisconnectedAsync(exception);
        }
    }
}
