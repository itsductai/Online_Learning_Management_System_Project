using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng CommunityMessages (Lưu tin nhắn trong cộng đồng)
    public class CommunityMessage
    {
        [Key]  // Khóa chính
        public int MessageId { get; set; }

        [ForeignKey("User")]  // Khóa ngoại tham chiếu đến bảng Users
        public int SenderId { get; set; }  // Người gửi tin nhắn

        [Required]  // Nội dung tin nhắn
        public string Content { get; set; } = string.Empty;

        public string? Attachment { get; set; }  // File hoặc ảnh đính kèm (nếu có)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Ngày gửi tin nhắn

        public User? User { get; set; }  // Navigation Property
    }
}
