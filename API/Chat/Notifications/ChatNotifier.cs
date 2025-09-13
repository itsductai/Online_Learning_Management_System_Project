using API.Chat.DTOs;
using API.Chat.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace API.Chat.Notifications
{
    public class ChatNotifier : IChatNotifier
    {
        private readonly IHubContext<ChatHub> _hub;

        public ChatNotifier(IHubContext<ChatHub> hub) { _hub = hub; }

        // gửi tới nhóm theo user: "user:{id}"
        private static string UG(int userId) => $"user:{userId}";

        public async Task ConversationUpsertedAsync(ConversationDTO conv, IEnumerable<int> userIds)
        {
            var groups = userIds.Distinct().Select(UG).ToList();
            foreach (var g in groups)
                await _hub.Clients.Group(g).SendAsync("ConversationUpserted", conv);
        }

        public async Task ConversationRemovedAsync(Guid conversationId, IEnumerable<int> userIds)
        {
            var groups = userIds.Distinct().Select(UG).ToList();
            foreach (var g in groups)
                await _hub.Clients.Group(g).SendAsync("ConversationRemoved", conversationId);
        }

        public async Task UnreadChangedAsync(int userId, Guid conversationId, int unreadTotal, int unreadForConversation)
        {
            await _hub.Clients.Group($"user:{userId}")
                .SendAsync("UnreadChanged", new
                {
                    conversationId,
                    unreadTotal,
                    unreadForConversation
                });
        }

        public async Task MessageReadAsync(Guid conversationId, int userId, DateTime readAt)
        {
            await _hub.Clients.Group(conversationId.ToString())
                .SendAsync("MessageRead", new
                {
                    conversationId,
                    userId,
                    readAt
                });
        }
    }
}
