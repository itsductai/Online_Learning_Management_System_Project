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

    public class QuizSubmissionDto
    {
        public int LessonId { get; set; } // ID bài học chứa quiz
        public Dictionary<int, int> Answers { get; set; } = new(); // Key: Index câu hỏi, Value: Đáp án chọn
    }

    // Kết quả chi tiết từng câu
    public class QuizAnswerResultDto
    {
        public int QuizId { get; set; } // QuizId tương ứng
        public string Question { get; set; } = string.Empty; // Câu hỏi
        public int CorrectAnswer { get; set; } // Đáp án đúng
        public int SelectedAnswer { get; set; } // Đáp án học viên chọn
        public bool IsCorrect { get; set; } // Học viên trả lời đúng hay sai
    }


    public class QuizResultDto
    {
        public int UserId { get; set; }
        public int LessonId { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Score { get; set; } // Điểm số (0 - 10)
        public DateTime SubmittedAt { get; set; }
        public List<QuizAnswerResultDto> AnswerResults { get; set; } = new();
    }

    public class QuizCompleteDto
    {
        public int ResultId { get; set; }
        public int UserId { get; set; }
        public int LessonId { get; set; }
        public int TotalQuestions { get; set; }
        public int CorrectAnswers { get; set; }
        public double Score { get; set; } // Điểm số (0 - 10)
        public DateTime SubmittedAt { get; set; }

    }

}
