namespace API.Chat.DTOs
{
    public class LastMessageDTO
    {
        public Guid Id { get; set; }
        public string Content { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public UserSummaryDTO? Sender { get; set; }
    }
}
