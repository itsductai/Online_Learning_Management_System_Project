namespace API.Chat.DTOs;

public class ConversationDTO
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "";
    public string? Title { get; set; }
    public int[] MemberIds { get; set; } = Array.Empty<int>();
    public DateTime CreatedAt { get; set; }
}