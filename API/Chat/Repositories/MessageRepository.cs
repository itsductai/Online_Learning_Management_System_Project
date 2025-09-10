using Data.Chat;
using Microsoft.EntityFrameworkCore;

namespace API.Chat.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly ChatDbContext _db;
    public MessageRepository(ChatDbContext db) { _db = db; }

    public async Task<Message> AddAsync(Message msg)
    {
        _db.Messages.Add(msg);
        await _db.SaveChangesAsync();
        return msg;
    }

    public async Task<List<Message>> GetPageAsync(Guid conversationId, DateTime? before, int pageSize)
    {
        var q = _db.Messages.Include(m => m.Attachments)
            .Where(m => m.ConversationId == conversationId);

        if (before.HasValue) q = q.Where(m => m.CreatedAt < before.Value);

        return await q.OrderByDescending(m => m.CreatedAt)
                      .Take(pageSize)
                      .ToListAsync();
    }
}