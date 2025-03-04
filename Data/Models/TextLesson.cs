using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    public class TextLesson
    {
        [Key]
        public int TextId { get; set; }

        [ForeignKey("Lesson")]
        public int LessonId { get; set; }

        [Required]
        public string Content { get; set; } // Nội dung văn bản

        [MaxLength(255)]
        public string? Attachment { get; set; } // File đính kèm

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7);

        public Lesson? Lesson { get; set; }
    }
}
