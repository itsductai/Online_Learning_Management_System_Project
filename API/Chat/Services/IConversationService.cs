// API/Chat/Services/IConversationService.cs
using API.Chat.DTOs;

namespace API.Chat.Services;

public interface IConversationService
{
    Task<List<ConversationDTO>> GetMyAsync(int userId);
    Task<ConversationDTO> CreateDirectAsync(int me, int otherUserId);
    Task<bool> EnsureMemberAsync(Guid conversationId, int userId);
    Task<bool> LeaveAsync(Guid conversationId, int userId);
}
