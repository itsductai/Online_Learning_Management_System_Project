using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    public class VideoLesson
    {
        [Key]
        public int VideoId { get; set; }

        [ForeignKey("Lessons")]
        public int LessonId { get; set; }
        
        [Required,MaxLength(20)]
        public string StorageType { get; set; }
        
        [MaxLength(255)]
        public string?  YoutubeUrl { get; set; }

        [MaxLength(255)]
        public string? FilePath { get; set; }

        [MaxLength(255)]
        public string? ThumbnailUrl { get; set; }

        [MaxLength(50)]
        public string? Duration { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Lesson? Lessons { get; set; }

    }
}
