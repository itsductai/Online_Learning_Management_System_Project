namespace API.Chat.DTOs
{
    // Thành viên (mini) dùng cho popup
    public class GroupMemberMiniDTO
    {
        public int UserId { get; set; }
        public string Name { get; set; } = "";
        public string? AvatarUrl { get; set; }

        // Vai trò trong group (ConversationMember.Role): "Admin" | "Member"
        public string MemberRole { get; set; } = "Member";

        // Vai trò toàn cục (Users.Role): "Student" | "Instructor" | "Admin"
        public string? GlobalRole { get; set; }
    }

    // Thành viên (full) dùng cho trang chi tiết
    public class GroupMemberFullDTO : GroupMemberMiniDTO
    {
        // Vai trò toàn cục trong hệ thống Users (Student/Instructor/Admin)
        public string? GlobalRole { get; set; }
        public DateTime JoinedAt { get; set; }
        public DateTime? LastReadAt { get; set; }
    }

    // Response mini
    public class GroupMembersMiniResponse
    {
        public Guid ConversationId { get; set; }
        public int Count { get; set; }
        // Vai trò của chính người gọi API trong group
        public string MyRole { get; set; } = "Member";
        public List<GroupMemberMiniDTO> Items { get; set; } = new();
    }

    // Response full
    public class GroupMembersFullResponse
    {
        public Guid ConversationId { get; set; }
        public int Count { get; set; }
        public string MyRole { get; set; } = "Member";
        public List<GroupMemberFullDTO> Items { get; set; } = new();
    }
}
