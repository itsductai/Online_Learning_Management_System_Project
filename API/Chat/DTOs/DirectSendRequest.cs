using System.ComponentModel.DataAnnotations;

namespace API.Chat.DTOs
{

    public class DirectSendRequest
    {
        [Required] public int TargetUserId { get; set; }
        [Required] public string Content { get; set; } = "";
        public List<AttachmentDTO>? Attachments { get; set; }
    }
}
