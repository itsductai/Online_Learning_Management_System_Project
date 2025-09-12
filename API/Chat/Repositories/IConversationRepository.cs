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
    }
}
