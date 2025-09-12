namespace API.Chat.DTOs
{
    public class CreateGroupRequest
    {
        public string Title { get; set; } = "";
        public List<int> MemberIds { get; set; } = new(); // không gồm creator, FE gửi các user được chọn
    }

    public class UpdateGroupTitleRequest
    {
        public string Title { get; set; } = "";
    }

    public class AddMembersRequest
    {
        public List<int> MemberIds { get; set; } = new();
    }
}
