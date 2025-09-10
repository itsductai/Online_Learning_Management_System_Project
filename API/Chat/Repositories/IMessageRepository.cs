using Data.Chat;

namespace API.Chat.Repositories;

public interface IMessageRepository
{
    Task<Message> AddAsync(Message msg);
    Task<List<Message>> GetPageAsync(Guid conversationId, DateTime? before, int pageSize);
}