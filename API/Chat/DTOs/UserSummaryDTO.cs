namespace API.Chat.DTOs;

public class UserSummaryDTO
{
    public int UserId { get; set; }
    public string Name { get; set; } = "";
    public string? AvatarUrl { get; set; }
    public string? Role { get; set; }
}