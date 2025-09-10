// API/Chat/Services/IMessageService.cs
using API.Chat.DTOs;

namespace API.Chat.Services;

public interface IMessageService
{
    Task<MessageDTO> SendAsync(int userId, Guid conversationId, string content, IEnumerable<AttachmentDTO>? atts = null);
    Task<List<MessageDTO>> GetPageAsync(int userId, Guid conversationId, DateTime? before, int pageSize);
}
