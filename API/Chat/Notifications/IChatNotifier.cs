using API.Chat.DTOs;

namespace API.Chat.Notifications
{
    public interface IChatNotifier
    {
        Task ConversationUpsertedAsync(ConversationDTO conv, IEnumerable<int> userIds);
        Task ConversationRemovedAsync(Guid conversationId, IEnumerable<int> userIds);
    }
}
