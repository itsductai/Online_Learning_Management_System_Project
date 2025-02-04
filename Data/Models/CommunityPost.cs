using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    // Đại diện cho bảng CommunityPosts (Lưu bài viết trong cộng đồng học viên)
    public class CommunityPost
    {
        [Key]  // Khóa chính
        public int PostId { get; set; }

        [ForeignKey("User")]  // Khóa ngoại tham chiếu đến bảng Users
        public int UserId { get; set; }

        public string? Content { get; set; }  // Nội dung bài viết (có thể null)

        public string? Attachment { get; set; }  // File hoặc ảnh đính kèm (nếu có)

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  // Ngày đăng bài

        public User? User { get; set; }  // Navigation Property
    }
}
