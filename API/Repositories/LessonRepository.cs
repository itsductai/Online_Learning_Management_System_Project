using Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public interface ILessonRepository
    {
        Task<List<Lesson>> GetLessonsByCourseAsync(int courseId);
        Task<Lesson?> GetLessonByIdAsync(int lessonId);
        Task AddLessonAsync(Lesson lesson);
        Task AddVideoLessonAsync(VideoLesson videoLesson);
        Task AddTextLessonAsync(TextLesson textLesson);
        Task UpdateLessonAsync(Lesson lesson);
        Task DeleteLessonAsync(Lesson lesson);
        Task<VideoLesson?> GetVideoLessonByLessonIdAsync(int lessonId);
        Task<TextLesson?> GetTextLessonByLessonIdAsync(int lessonId);
        Task UpdateVideoLessonByLessonIdAsync(int lessonId, string youtubeUrl);
        Task UpdateTextLessonByLessonIdAsync(int lessonId, string content);
        Task SaveChangesAsync();
    }


    public class LessonRepository : ILessonRepository
    {
        private readonly ApplicationDbContext _context;

        public LessonRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Lesson>> GetLessonsByCourseAsync(int courseId)
        {
            return await _context.Lessons
                .Where(l => l.CourseId == courseId)
                .ToListAsync();
        }

        public async Task<Lesson?> GetLessonByIdAsync(int lessonId)
        {
            return await _context.Lessons.FindAsync(lessonId);
        }

        public async Task AddLessonAsync(Lesson lesson)
        {
            _context.Lessons.Add(lesson);
            await _context.SaveChangesAsync();
        }

        public async Task AddVideoLessonAsync(VideoLesson videoLesson)
        {
            _context.VideoLessons.Add(videoLesson);
            await _context.SaveChangesAsync();
        }

        public async Task AddTextLessonAsync(TextLesson textLesson)
        {
            _context.TextLessons.Add(textLesson);
            await _context.SaveChangesAsync();
        }

        public async Task<VideoLesson?> GetVideoLessonByLessonIdAsync(int lessonId)
        {
            return await _context.VideoLessons.FirstOrDefaultAsync(v => v.LessonId == lessonId);
        }

        public async Task<TextLesson?> GetTextLessonByLessonIdAsync(int lessonId)
        {
            return await _context.TextLessons.FirstOrDefaultAsync(t => t.LessonId == lessonId);
        }

        public async Task UpdateLessonAsync(Lesson lesson)
        {
            _context.Lessons.Update(lesson);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteLessonAsync(Lesson lesson)
        {
            _context.Lessons.Remove(lesson);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateVideoLessonByLessonIdAsync(int lessonId, string youtubeUrl)
        {
            var videoLesson = await _context.VideoLessons.FirstOrDefaultAsync(v => v.LessonId == lessonId);
            if (videoLesson != null)
            {
                videoLesson.YoutubeUrl = youtubeUrl;
                _context.VideoLessons.Update(videoLesson);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateTextLessonByLessonIdAsync(int lessonId, string content)
        {
            var textLesson = await _context.TextLessons.FirstOrDefaultAsync(t => t.LessonId == lessonId);
            if (textLesson != null)
            {
                textLesson.Content = content;
                _context.TextLessons.Update(textLesson);
                await _context.SaveChangesAsync();
            }
        }
    }
}
