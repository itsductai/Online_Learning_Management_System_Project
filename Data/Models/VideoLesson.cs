﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    public class VideoLesson
    {
        [Key]
        public int VideoId { get; set; }

        [ForeignKey("Lesson")]
        public int LessonId { get; set; }
        
        [MaxLength(255)]
        public string  YoutubeUrl { get; set; }

        public Lesson? Lesson { get; set; }

    }
}
