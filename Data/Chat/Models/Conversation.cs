namespace Data.Chat;

public class Conversation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Type { get; set; } = "Direct"; // Direct | Group
    public string? Title { get; set; }
    public int CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<ConversationMember> Members { get; set; } = new List<ConversationMember>();
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}