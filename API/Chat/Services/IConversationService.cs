// API/Chat/Services/IConversationService.cs
using API.Chat.DTOs;

namespace API.Chat.Services;

public interface IConversationService
{
    Task<List<ConversationDTO>> GetMyAsync(int userId);
    Task<ConversationDTO> CreateDirectAsync(int me, int otherUserId);
    Task<bool> EnsureMemberAsync(Guid conversationId, int userId);
    Task<bool> LeaveAsync(Guid conversationId, int userId);
    Task<ConversationDTO> CreateGroupAsync(int creatorId, string title, IEnumerable<int> memberIds);
    Task<ConversationDTO?> RenameGroupAsync(Guid conversationId, int userId, string newTitle);
    Task<bool> AddMembersAsync(Guid conversationId, int userId, IEnumerable<int> memberIds);
    Task<bool> RemoveMemberAsync(Guid conversationId, int requesterId, int targetUserId);
    Task MarkReadAsync(Guid conversationId, int userId);
    // Task<GroupMembersMiniResult?> GetMembersMiniAsync(Guid conversationId, int userId);
    Task<string?> GetMyGroupRoleAsync(Guid conversationId, int userId);
}
