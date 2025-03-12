namespace API.DTOs
{
    public class QuizQuestionDto
    {
        public int QuizId { get; set; }
        public string Question { get; set; }
        public List<string> Options { get; set; }
        public int CorrectAnswer { get; set; } // 0=A, 1=B, 2=C, 3=D
        public string? ImageUrl { get; set; }
    }

    public class AddQuestionDto
    {
        public string Question { get; set; }
        public List<string> Options { get; set; }
        public int CorrectAnswer { get; set; }
        public string? ImageUrl { get; set; }
    }

    public class AddQuizDto
    {
        public string Title { get; set; }
        public int Duration { get; set; }
        public List<AddQuestionDto> Questions { get; set; }
    }

    public class UpdateQuizDto
    {
        public string Title { get; set; }
        public int Duration { get; set; }
        public List<QuizQuestionDto> Questions { get; set; }
    }
}
