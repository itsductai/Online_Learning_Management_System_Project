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

    public class QuizQuestionDto
    {
        public int QuizId { get; set; }  // Thêm ID câu hỏi
        public string Question { get; set; }
        public List<string> Options { get; set; }
        public int CorrectAnswer { get; set; } // Ẩn hoặc hiển thị tùy quyền truy cập
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
