using API.Repositories;
using API.DTOs;
using Data.Models;
using System.Transactions;

namespace API.Services
{
    public interface IQuizService
    {
        Task<int> AddQuizAsync(int courseId, AddQuizDto quizDto);
        Task UpdateQuizAsync(int lessonId, UpdateQuizDto quizDto);
        Task<QuizResultDto> SubmitQuizAsync(int userId, QuizSubmissionDto submission);
        Task<QuizCompleteDto> GeQuizResultByUserAsync(int userId, int lessonId);
        Task<List<QuizCompleteDto>> GetUserQuizResultsAsync(int userId);
        Task<List<QuizResultDto>> GetAllQuizResultsAsync();
        Task<List<QuizResultDto>> GetSortedQuizResultsAsync(string order);
    }

    public class QuizService : IQuizService
    {
        private readonly ILessonRepository _lessonRepository;
        private readonly IQuizRepository _quizRepository;

        public QuizService(ILessonRepository lessonRepository, IQuizRepository quizRepository)
        {
            _lessonRepository = lessonRepository;
            _quizRepository = quizRepository;
        }

        public async Task<int> AddQuizAsync(int courseId, AddQuizDto quizDto)
        {
            if (quizDto.Questions == null || quizDto.Questions.Count == 0)
                throw new Exception("Danh sách câu hỏi không được rỗng!");

            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var lesson = new Lesson
                {
                    CourseId = courseId,
                    Title = quizDto.Title,
                    LessonType = "quiz",
                    Duration = quizDto.Duration
                };

                await _lessonRepository.AddLessonAsync(lesson);

                foreach (var question in quizDto.Questions)
                {
                    var quiz = new Quiz
                    {
                        LessonId = lesson.LessonId,
                        Question = question.Question,
                        ImageUrl = string.IsNullOrWhiteSpace(question.ImageUrl) ? null : question.ImageUrl,
                        OptionA = question.Options[0],
                        OptionB = question.Options[1],
                        OptionC = question.Options[2],
                        OptionD = question.Options[3],
                        CorrectAnswer = question.CorrectAnswer
                    };

                    await _quizRepository.AddQuizAsync(quiz);
                }

                transaction.Complete();
                return lesson.LessonId;
            }
        }

        public async Task UpdateQuizAsync(int lessonId, UpdateQuizDto quizDto)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var lesson = await _lessonRepository.GetLessonByIdAsync(lessonId);
                if (lesson == null) throw new Exception("Bài học không tồn tại.");

                lesson.Title = quizDto.Title;
                lesson.Duration = quizDto.Duration;
                await _lessonRepository.UpdateLessonAsync(lesson);

                await _quizRepository.DeleteQuizzesByLessonIdAsync(lessonId);

                foreach (var question in quizDto.Questions)
                {
                    var quiz = new Quiz
                    {
                        LessonId = lessonId,
                        Question = question.Question,
                        ImageUrl = question.ImageUrl,
                        OptionA = question.Options[0],
                        OptionB = question.Options[1],
                        OptionC = question.Options[2],
                        OptionD = question.Options[3],
                        CorrectAnswer = question.CorrectAnswer
                    };

                    await _quizRepository.AddQuizAsync(quiz);
                }

                transaction.Complete();
            }
        }

        // Chấm điêmr bài kiểm tra
        public async Task<QuizResultDto> SubmitQuizAsync(int userId, QuizSubmissionDto submission)
        {
            // Lấy tất cả các câu hỏi của bài học
            var quizzes = await _quizRepository.GetQuizzesByLessonIdAsync(submission.LessonId);

            int totalQuestions = quizzes.Count;
            int correctAnswers = 0;

            // Kết quả từng câu hỏi để trả về cho FE
            var questionResults = new List<QuizAnswerResultDto>();

            for (int i = 0; i < totalQuestions; i++)
            {
                var quiz = quizzes[i]; // QuizId tương ứng với thứ tự index

                if (submission.Answers.ContainsKey(i)) // Kiểm tra nếu học viên đã chọn đáp án
                {
                    int selectedAnswer = submission.Answers[i];
                    bool isCorrect = selectedAnswer == quiz.CorrectAnswer;

                    if (isCorrect) correctAnswers++;

                    // Thêm kết quả chi tiết của câu hỏi
                    questionResults.Add(new QuizAnswerResultDto
                    {
                        QuizId = quiz.QuizId,
                        Question = quiz.Question,
                        CorrectAnswer = quiz.CorrectAnswer,
                        SelectedAnswer = selectedAnswer,
                        IsCorrect = isCorrect
                    });
                }
            }

            // Tính điểm số trên thang 10
            double score = Math.Round((double)correctAnswers / totalQuestions * 10, 2);

            // Lưu kết quả bài kiểm tra vào database
            var quizResult = new QuizResult
            {
                UserId = userId,
                LessonId = submission.LessonId, // Lưu LessonId thay vì QuizId
                Score = (int)score,
                CorrectAnswers = (int)correctAnswers,
                TotalQuestions = (int)totalQuestions,
                SubmittedAt = DateTime.UtcNow.AddHours(7)
            };

            await _quizRepository.SubmitQuizResultAsync(quizResult);

            // Trả về thông tin chi tiết cho FE
            return new QuizResultDto
            {
                UserId = userId,
                LessonId = submission.LessonId,
                TotalQuestions = totalQuestions,
                CorrectAnswers = correctAnswers,
                Score = score,
                SubmittedAt = quizResult.SubmittedAt,
                AnswerResults = questionResults // Danh sách kết quả chi tiết của từng câu hỏi
            };
        }

        // Lấy kết quả bài kiểm tra theo lessonId
        public async Task<QuizCompleteDto> GeQuizResultByUserAsync(int userId, int lessonId)
        {
            var results = await _quizRepository.GetLatestQuizResultByUserAsync(userId, lessonId);

            var res = new QuizCompleteDto
            {
                ResultId = results.ResultId,
                UserId = results.UserId,
                LessonId = results.LessonId,
                Score = results.Score,
                SubmittedAt = results.SubmittedAt,
                CorrectAnswers = results.CorrectAnswers,
                TotalQuestions = results.TotalQuestions,
            };

            return res;
        }

        // Lấy kết quả tất cả bài kiểm tra của 1 user
        public async Task<List<QuizCompleteDto>> GetUserQuizResultsAsync(int userId)
        {
            var results = await _quizRepository.GetUserQuizResultsAsync(userId);

            return results.Select(q => new QuizCompleteDto
            {
                UserId = q.UserId,
                LessonId = q.LessonId,
                Score = q.Score,
                SubmittedAt = q.SubmittedAt,
                ResultId = q.ResultId,
                TotalQuestions = q.TotalQuestions,
                CorrectAnswers = q.CorrectAnswers
            }).ToList();
        }

        public async Task<List<QuizResultDto>> GetAllQuizResultsAsync()
        {
            var results = await _quizRepository.GetAllQuizResultsAsync();

            return results.Select(q => new QuizResultDto
            {
                UserId = q.UserId,
                LessonId = q.LessonId,
                Score = q.Score,
                SubmittedAt = q.SubmittedAt
            }).ToList();
        }

        public async Task<List<QuizResultDto>> GetSortedQuizResultsAsync(string order)
        {
            var results = await _quizRepository.GetSortedQuizResultsAsync(order);

            return results.Select(q => new QuizResultDto
            {
                UserId = q.UserId,
                LessonId = q.LessonId,
                Score = q.Score,
                SubmittedAt = q.SubmittedAt
            }).ToList();
        }
    }
}
