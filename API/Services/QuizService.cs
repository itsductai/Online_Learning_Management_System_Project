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
    }
}
