using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;

namespace API.DTOs
{
    public class LessonDto
    {
        public int LessonId { get; set; }
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string LessonType { get; set; }
        public int Duration { get; set; }

        // Video Lesson
        public string YoutubeUrl { get; set; }

        // Text Lesson
        public string Content { get; set; }

        // Quiz Lesson
        public List<QuizQuestionDto> Questions { get; set; }
    }

    public class AddLessonDto
    {
        public int CourseId { get; set; }
        public string Title { get; set; }
        public string LessonType { get; set; }
        public int Duration { get; set; }

        // Video Lesson
        public string YoutubeUrl { get; set; }

        // Text Lesson
        public string Content { get; set; }
    }

    public class UpdateLessonDto
    {
        public string Title { get; set; }
        public string LessonType { get; set; }
        public string YoutubeUrl { get; set; }
        public string Content { get; set; }
        public int Duration { get; set; }
    }
}
