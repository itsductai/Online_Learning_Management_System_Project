using Data.Chat;
using Microsoft.EntityFrameworkCore;

namespace API.Chat.Repositories;

public class ConversationRepository : IConversationRepository
{
    private readonly ChatDbContext _db;
    public ConversationRepository(ChatDbContext db) { _db = db; }

    public Task<Conversation?> GetAsync(Guid id) =>
        _db.Conversations.Include(c => c.Members).FirstOrDefaultAsync(c => c.Id == id);

    public Task<Conversation?> GetDirectByMembersAsync(int a, int b) =>
        _db.Conversations
           .Include(c => c.Members)
           .Where(c => c.Type == "Direct")
           .FirstOrDefaultAsync(c => c.Members.Any(m => m.UserId == a) && c.Members.Any(m => m.UserId == b));

    public async Task<List<Conversation>> GetForUserAsync(int userId)
    {
        return await _db.Conversations
            .Include(c => c.Members)
            .Where(c => c.Members.Any(m => m.UserId == userId))
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<Conversation> CreateDirectAsync(int creatorId, int otherUserId)
    {
        var c = new Conversation { Type = "Direct", CreatedByUserId = creatorId };
        c.Members.Add(new ConversationMember { UserId = creatorId, Role = "Admin" });
        c.Members.Add(new ConversationMember { UserId = otherUserId, Role = "Member" });
        _db.Conversations.Add(c);
        await _db.SaveChangesAsync();
        return c;
    }

    // Thêm mới
    public async Task SaveChangesAsync()
    {
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Conversation c)
    {
        _db.Conversations.Remove(c);
        await _db.SaveChangesAsync();
    }
}
