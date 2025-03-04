using API.Repositories;
using API.DTOs;
using Data.Models;
using System.Transactions;

namespace Services
{
    public interface ILessonService
    {
        Task<List<LessonDto>> GetLessonsByCourseAsync(int courseId);
        Task AddLessonAsync(AddLessonDto lessonDto);
        Task UpdateLessonAsync(int lessonId, UpdateLessonDto lessonDto);
        Task DeleteLessonAsync(int lessonId);
    }

    public class LessonService : ILessonService
    {
        private readonly ILessonRepository _lessonRepository;

        public LessonService(ILessonRepository lessonRepository)
        {
            _lessonRepository = lessonRepository;
        }

        public async Task<List<LessonDto>> GetLessonsByCourseAsync(int courseId)
        {
            var lessons = await _lessonRepository.GetLessonsByCourseAsync(courseId);
            var lessonDtos = new List<LessonDto>();

            foreach (var lesson in lessons)
            {
                var lessonDto = new LessonDto
                {
                    LessonId = lesson.LessonId,
                    CourseId = lesson.CourseId,
                    Title = lesson.Title,
                    LessonType = lesson.LessonType,
                    Duration = lesson.Duration
                };

                if (lesson.LessonType == "video")
                {
                    var videoLesson = await _lessonRepository.GetVideoLessonByLessonIdAsync(lesson.LessonId);
                    if(videoLesson != null)
                    {
                        lessonDto.YoutubeUrl = videoLesson.YoutubeUrl;
                    }
                        
                }
                else if (lesson.LessonType == "text")
                {
                    var textLesson = await _lessonRepository.GetTextLessonByLessonIdAsync(lesson.LessonId);
                    if (textLesson != null)
                    {
                        lessonDto.Content = textLesson.Content;
                    }
                }

                lessonDtos.Add(lessonDto);
            }

            return lessonDtos;
        }

        public async Task AddLessonAsync(AddLessonDto lessonDto)
        {
            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var lesson = new Lesson
                {
                    CourseId = lessonDto.CourseId,
                    Title = lessonDto.Title,
                    LessonType = lessonDto.LessonType,
                    Duration = lessonDto.Duration
                };

                await _lessonRepository.AddLessonAsync(lesson);

                if (lessonDto.LessonType == "video")
                {
                    var videoLesson = new VideoLesson
                    {
                        LessonId = lesson.LessonId,
                        YoutubeUrl = lessonDto.YoutubeUrl
                    };
                    await _lessonRepository.AddVideoLessonAsync(videoLesson);
                }
                else if (lessonDto.LessonType == "text")
                {
                    var textLesson = new TextLesson
                    {
                        LessonId = lesson.LessonId,
                        Content = lessonDto.Content
                    };
                    await _lessonRepository.AddTextLessonAsync(textLesson);
                }

                transaction.Complete();
            }
        }

        public async Task UpdateLessonAsync(int lessonId, UpdateLessonDto lessonDto)
        {
            var lesson = await _lessonRepository.GetLessonByIdAsync(lessonId);
            if (lesson == null) throw new Exception("Bài học không tồn tại.");

            using (var transaction = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                // Cập nhật thông tin chung của bài học
                lesson.Title = lessonDto.Title;
                lesson.Duration = lessonDto.Duration;

                await _lessonRepository.UpdateLessonAsync(lesson);

                // Cập nhật VideoLesson nếu bài học là Video
                if (lessonDto.LessonType == "video")
                {
                    await _lessonRepository.UpdateVideoLessonByLessonIdAsync(lessonId, lessonDto.YoutubeUrl);
                }
                // Cập nhật TextLesson nếu bài học là Text
                else if (lessonDto.LessonType == "text")
                {
                    await _lessonRepository.UpdateTextLessonByLessonIdAsync(lessonId, lessonDto.Content);
                }

                await _lessonRepository.SaveChangesAsync(); // Đảm bảo lưu tất cả thay đổi
                transaction.Complete();
            }
        }





        public async Task DeleteLessonAsync(int lessonId)
        {
            var lesson = await _lessonRepository.GetLessonByIdAsync(lessonId);
            if (lesson == null) throw new Exception("Bài học không tồn tại.");

            await _lessonRepository.DeleteLessonAsync(lesson);
        }
    }
}
