namespace Data.Chat;

public class Message
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ConversationId { get; set; }
    public int SenderId { get; set; }
    public string Content { get; set; } = "";
    public string MessageType { get; set; } = "Text"; // Text|Image|File|System
    public Guid? ReplyToMessageId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EditedAt { get; set; }
    public DateTime? DeletedAt { get; set; }

    public Conversation Conversation { get; set; } = null!;
    public ICollection<MessageAttachment> Attachments { get; set; } = new List<MessageAttachment>();
}