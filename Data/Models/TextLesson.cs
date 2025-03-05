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

        public Lesson? Lesson { get; set; }
    }
}
