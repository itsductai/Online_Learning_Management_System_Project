// API/Chat/Services/ConversationService.cs
using API.Chat.DTOs;
using API.Chat.Repositories;
using Data.Chat;

namespace API.Chat.Services;

public class ConversationService : IConversationService
{
    private readonly IConversationRepository _repo;

    public ConversationService(IConversationRepository repo) { _repo = repo; }

    public async Task<List<ConversationDTO>> GetMyAsync(int userId)
    {
        var list = await _repo.GetForUserAsync(userId);
        return list.Select(c => new ConversationDTO
        {
            Id = c.Id,
            Type = c.Type,
            Title = c.Title,
            MemberIds = c.Members.Select(m => m.UserId).ToArray(),
            CreatedAt = c.CreatedAt
        }).ToList();
    }

    public async Task<ConversationDTO> CreateDirectAsync(int me, int otherUserId)
    {
        var exist = await _repo.GetDirectByMembersAsync(me, otherUserId);
        var c = exist ?? await _repo.CreateDirectAsync(me, otherUserId);

        return new ConversationDTO
        {
            Id = c.Id,
            Type = c.Type,
            Title = c.Title,
            MemberIds = c.Members.Select(m => m.UserId).ToArray(),
            CreatedAt = c.CreatedAt
        };
    }

    public async Task<bool> EnsureMemberAsync(Guid conversationId, int userId)
    {
        var c = await _repo.GetAsync(conversationId);
        return c?.Members.Any(m => m.UserId == userId) == true;
    }
}
