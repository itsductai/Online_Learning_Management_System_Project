// API/Chat/Services/MessageService.cs
using API.Chat.DTOs;
using API.Chat.Repositories;
using Data.Chat;

namespace API.Chat.Services;

public class MessageService : IMessageService
{
    private readonly IConversationRepository _convRepo;
    private readonly IMessageRepository _msgRepo;

    public MessageService(IConversationRepository convRepo, IMessageRepository msgRepo)
    { _convRepo = convRepo; _msgRepo = msgRepo; }

    public async Task<MessageDTO> SendAsync(int userId, Guid conversationId, string content, IEnumerable<AttachmentDTO>? atts = null)
    {
        var conv = await _convRepo.GetAsync(conversationId);
        if (conv == null || !conv.Members.Any(m => m.UserId == userId))
            throw new UnauthorizedAccessException("Not a member");

        var msg = new Message
        {
            ConversationId = conversationId,
            SenderId = userId,
            Content = content,
            MessageType = (atts != null && atts.Any()) ? "File" : "Text",
            CreatedAt = DateTime.UtcNow
        };

        msg = await _msgRepo.AddAsync(msg);

        if (atts != null)
        {
            msg.Attachments = atts.Select(a => new MessageAttachment
            {
                Id = a.Id != Guid.Empty ? a.Id : Guid.NewGuid(),
                MessageId = msg.Id,
                Url = a.Url,
                FileName = a.FileName,
                FileSize = a.FileSize,
                ContentType = a.ContentType
            }).ToList();
        }

        return new MessageDTO
        {
            Id = msg.Id,
            ConversationId = msg.ConversationId,
            SenderId = msg.SenderId,
            Content = msg.Content,
            MessageType = msg.MessageType,
            ReplyToMessageId = msg.ReplyToMessageId,
            CreatedAt = msg.CreatedAt,
            Attachments = msg.Attachments.Select(a => new AttachmentDTO
            {
                Id = a.Id,
                Url = a.Url,
                FileName = a.FileName,
                FileSize = a.FileSize,
                ContentType = a.ContentType
            }).ToList()
        };
    }

    public async Task<List<MessageDTO>> GetPageAsync(int userId, Guid conversationId, DateTime? before, int pageSize)
    {
        var conv = await _convRepo.GetAsync(conversationId);
        if (conv == null || !conv.Members.Any(m => m.UserId == userId))
            throw new UnauthorizedAccessException("Not a member");

        var list = await _msgRepo.GetPageAsync(conversationId, before, pageSize);
        return list.Select(m => new MessageDTO
        {
            Id = m.Id,
            ConversationId = m.ConversationId,
            SenderId = m.SenderId,
            Content = m.Content,
            MessageType = m.MessageType,
            ReplyToMessageId = m.ReplyToMessageId,
            CreatedAt = m.CreatedAt,
            Attachments = m.Attachments.Select(a => new AttachmentDTO
            {
                Id = a.Id,
                Url = a.Url,
                FileName = a.FileName,
                FileSize = a.FileSize,
                ContentType = a.ContentType
            }).ToList()
        }).ToList();
    }
}
