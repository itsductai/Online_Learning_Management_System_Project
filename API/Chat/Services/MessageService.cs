// API/Chat/Services/MessageService.cs
using API.Chat.DTOs;
using API.Chat.Repositories;
using Data.Chat;
using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Chat.Services;

public class MessageService : IMessageService
{
    private readonly IConversationRepository _convRepo;
    private readonly IMessageRepository _msgRepo;
    private readonly ApplicationDbContext _usersDb;

    public MessageService(IConversationRepository convRepo, IMessageRepository msgRepo, ApplicationDbContext usersDb)
    {
        _convRepo = convRepo;
        _msgRepo = msgRepo;
        _usersDb = usersDb;
    }

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

        // --- load Sender cho DTO (tránh Unknown trên FE)
        var u = await _usersDb.Users
            .Where(x => x.UserId == msg.SenderId)
            .Select(x => new { x.UserId, x.Name, x.AvatarUrl, x.Role })
            .FirstOrDefaultAsync();

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
            }).ToList(),
            Sender = u == null ? null : new UserSummaryDTO
            {
                UserId = u.UserId,
                Name = u.Name,
                AvatarUrl = u.AvatarUrl,
                Role = u.Role
            }
        };
    }

    public async Task<List<MessageDTO>> GetPageAsync(int userId, Guid conversationId, DateTime? before, int pageSize)
    {
        var conv = await _convRepo.GetAsync(conversationId);
        if (conv == null || !conv.Members.Any(m => m.UserId == userId))
            throw new UnauthorizedAccessException("Not a member");

        var list = await _msgRepo.GetPageAsync(conversationId, before, pageSize);

        // --- batch load senders để tránh N+1
        var senderIds = list.Select(m => m.SenderId).Distinct().ToList();
        var senders = await _usersDb.Users
            .Where(x => senderIds.Contains(x.UserId))
            .Select(x => new { x.UserId, x.Name, x.AvatarUrl, x.Role })
            .ToListAsync();
        var sd = senders.ToDictionary(x => x.UserId, x => x);

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
            }).ToList(),
            Sender = sd.TryGetValue(m.SenderId, out var su)
                ? new UserSummaryDTO { UserId = su.UserId, Name = su.Name, AvatarUrl = su.AvatarUrl, Role = su.Role }
                : null
        }).ToList();
    }
}
