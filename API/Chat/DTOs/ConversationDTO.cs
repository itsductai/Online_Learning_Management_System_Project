namespace API.Chat.DTOs;

public class ConversationDTO
{
    public Guid Id { get; set; }
    public string Type { get; set; } = "Direct"; // Direct | Group
    public string? Title { get; set; }
    public string? AvatarUrl { get; set; } // để dành cho Group
    public DateTime CreatedAt { get; set; }

    public List<int> MemberIds { get; set; } = new();
    // Group: FE có thể hiển thị danh sách thành viên
    public List<UserSummaryDTO> Members { get; set; } = new();

    // Direct: đối phương
    public UserSummaryDTO? OtherUser { get; set; }
}