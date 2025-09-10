namespace Data.Chat;

public class ConversationMember
{
    public int Id { get; set; }
    public Guid ConversationId { get; set; }
    public int UserId { get; set; }
    public string Role { get; set; } = "Member"; // Member|Admin
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastReadAt { get; set; }

    public Conversation Conversation { get; set; } = null!;
}