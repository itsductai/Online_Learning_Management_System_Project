namespace API.Chat.DTOs;

public class MessageDTO
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public int SenderId { get; set; }
    public string Content { get; set; } = "";
    public string MessageType { get; set; } = "Text";
    public Guid? ReplyToMessageId { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<AttachmentDTO> Attachments { get; set; } = new();
}
