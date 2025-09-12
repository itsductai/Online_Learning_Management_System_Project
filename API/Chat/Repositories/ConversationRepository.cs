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

    public async Task<Conversation> CreateGroupAsync(int creatorId, string title, IEnumerable<int> memberIds)
    {
        var c = new Conversation
        {
            Type = "Group",
            Title = title,
            CreatedByUserId = creatorId,
            CreatedAt = DateTime.UtcNow
        };
        _db.Conversations.Add(c);
        await _db.SaveChangesAsync();

        // Thêm creator + các thành viên
        var all = memberIds?.Distinct().Where(id => id != creatorId).ToList() ?? new();
        var members = new List<ConversationMember>
    {
        new ConversationMember { ConversationId = c.Id, UserId = creatorId, Role = "Admin", JoinedAt = DateTime.UtcNow }
    };
        members.AddRange(all.Select(id => new ConversationMember
        {
            ConversationId = c.Id,
            UserId = id,
            Role = "Member",
            JoinedAt = DateTime.UtcNow
        }));

        _db.ConversationMembers.AddRange(members);
        await _db.SaveChangesAsync();
        return c;
    }

    public async Task AddMembersAsync(Guid conversationId, IEnumerable<int> userIds, string role = "Member")
    {
        var ids = userIds?.Distinct().ToList() ?? new();
        if (ids.Count == 0) return;

        var exists = await _db.ConversationMembers
            .Where(m => m.ConversationId == conversationId && ids.Contains(m.UserId))
            .Select(m => m.UserId).ToListAsync();

        var toAdd = ids.Except(exists)
            .Select(id => new ConversationMember
            {
                ConversationId = conversationId,
                UserId = id,
                Role = role,
                JoinedAt = DateTime.UtcNow
            }).ToList();

        if (toAdd.Count > 0)
        {
            _db.ConversationMembers.AddRange(toAdd);
            await _db.SaveChangesAsync();
        }
    }
    public async Task RemoveMemberAsync(Guid conversationId, int userId)
    {
        var member = await _db.ConversationMembers
            .FirstOrDefaultAsync(m => m.ConversationId == conversationId && m.UserId == userId);
        if (member != null)
        {
            _db.ConversationMembers.Remove(member);
            await _db.SaveChangesAsync();
        }
    }
    public async Task UpdateGroupTitleAsync(Guid conversationId, string newTitle)
    {
        var conv = await _db.Conversations.FirstOrDefaultAsync(c => c.Id == conversationId && c.Type == "Group");
        if (conv != null)
        {
            conv.Title = newTitle;
            await _db.SaveChangesAsync();
        }
    }
    public Task<bool> IsUserInConversationAsync(Guid conversationId, int userId) =>
        _db.ConversationMembers.AnyAsync(m => m.ConversationId == conversationId && m.UserId == userId);
    public Task<bool> IsUserAdminAsync(Guid conversationId, int userId) =>
        _db.ConversationMembers.AnyAsync(m => m.ConversationId == conversationId && m.UserId == userId && m.Role == "Admin");
    public Task<int> GetMemberCountAsync(Guid conversationId) =>
        _db.ConversationMembers.CountAsync(m => m.ConversationId == conversationId);
}
