using Data.Chat;

namespace API.Chat.Repositories
{
    public interface IConversationRepository
    {
        Task<Conversation?> GetAsync(Guid id);
        Task<Conversation?> GetDirectByMembersAsync(int a, int b);
        Task<List<Conversation>> GetForUserAsync(int userId);
        Task<Conversation> CreateDirectAsync(int creatorId, int otherUserId);

        //  Thêm 2 hàm mới để service dùng
        Task SaveChangesAsync();
        Task DeleteAsync(Conversation c);

        Task<Conversation> CreateGroupAsync(int creatorId, string title, IEnumerable<int> memberIds);
        Task AddMembersAsync(Guid conversationId, IEnumerable<int> userIds, string role = "Member");
        Task RemoveMemberAsync(Guid conversationId, int userId);
        Task UpdateGroupTitleAsync(Guid conversationId, string newTitle);
        Task<bool> IsUserInConversationAsync(Guid conversationId, int userId);
        Task<bool> IsUserAdminAsync(Guid conversationId, int userId);
        Task<int> GetMemberCountAsync(Guid conversationId);
        Task MarkReadAsync(Guid conversationId, int userId, DateTime at);
        Task<int> CountUnreadAsync(Guid conversationId, int userId);
        Task<Message?> GetLastMessageAsync(Guid conversationId);
    }
}
