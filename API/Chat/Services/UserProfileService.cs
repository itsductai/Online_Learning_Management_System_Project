using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Chat.DTOs;
using API.Services;              // IProgressService
using Data.Models;               // ApplicationDbContext + entities
using Microsoft.EntityFrameworkCore;

namespace API.Chat.Services
{
    // Đọc hồ sơ người dùng từ ApplicationDbContext và gom stats từ ProgressService cũ
    public class UserProfileService : IUserProfileService
    {
        private readonly ApplicationDbContext _db;
        private readonly IProgressService _progress; // dùng API cũ cho số liệu thống kê

        public UserProfileService(ApplicationDbContext db, IProgressService progress)
        {
            _db = db;
            _progress = progress;
        }

        // Snap enrollment có kiểu tường minh để tránh dynamic
        private sealed class EnrollmentSnap
        {
            public int UserId { get; set; }
            public int CourseId { get; set; }
            public bool IsCompleted { get; set; }
            public float ProgressPercent { get; set; }
            public DateTime? CompletionDate { get; set; }
        }

        // Lấy stats từ ProgressService cũ; fallback nhẹ nếu có sự cố
        private async Task<UserStatsDTO> GetStatsAsync(int userId)
        {
            try
            {
                var p = await _progress.GetProcessAsync(userId, "Student");
                // p.TotalStudyTime = [hours, minutes]
                var hours = 0;
                if (p.TotalStudyTime != null && p.TotalStudyTime.Length >= 2)
                    hours = p.TotalStudyTime[0]; // chỉ lấy giờ theo output hiện tại

                return new UserStatsDTO
                {
                    TotalEnrolledCourses = p.TotalEnrolledCourses,
                    CompletedCourses = p.CompletedCourses,
                    TotalStudyHours = hours,
                    AverageProgress = p.AverageProgress
                };
            }
            catch
            {
                // fallback khi ProgressService chưa sẵn sàng
                var totalEnrolled = await _db.Enrollments.CountAsync(e => e.UserId == userId);
                var completed = await _db.Enrollments.CountAsync(e => e.UserId == userId && e.IsCompleted);
                var avg = await _db.Enrollments
                           .Where(e => e.UserId == userId)
                           .Select(e => (double?)e.ProgressPercent)
                           .AverageAsync() ?? 0.0;

                // ước lượng giờ học từ LessonProgress hoàn thành
                var completedLessonMinutes = await (from lp in _db.LessonProgress
                                                    join l in _db.Lessons on lp.LessonId equals l.LessonId
                                                    where lp.UserId == userId && lp.IsCompleted
                                                    select l.Duration).SumAsync();
                var totalHours = (int)Math.Floor(completedLessonMinutes / 60.0);

                return new UserStatsDTO
                {
                    TotalEnrolledCourses = totalEnrolled,
                    CompletedCourses = completed,
                    TotalStudyHours = totalHours,
                    AverageProgress = Math.Round(avg, 2)
                };
            }
        }

        // Top N khóa ưu tiên hoàn thành, sau đó theo progress/ thời gian
        private async Task<List<CourseBriefDTO>> GetTopCoursesAsync(int userId, int topN)
        {
            var enrs = await _db.Enrollments
                .Where(e => e.UserId == userId)
                .Select(e => new EnrollmentSnap
                {
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    IsCompleted = e.IsCompleted,
                    ProgressPercent = e.ProgressPercent,
                    CompletionDate = e.CompletionDate
                })
                .ToListAsync();

            var courseIds = enrs.Select(x => x.CourseId).Distinct().ToList();
            var courses = await _db.Courses
                .Where(c => courseIds.Contains(c.CourseId))
                .Select(c => new { c.CourseId, c.Title, c.ImageUrl })
                .ToListAsync();
            var map = courses.ToDictionary(c => c.CourseId, c => c);

            return enrs
                .OrderByDescending(e => e.IsCompleted)
                .ThenByDescending(e => e.CompletionDate ?? DateTime.MinValue)
                .ThenByDescending(e => e.ProgressPercent)
                .Take(topN)
                .Select(e => new CourseBriefDTO
                {
                    CourseId = e.CourseId,
                    Title = map.TryGetValue(e.CourseId, out var c) ? c.Title : $"Course #{e.CourseId}",
                    ImageUrl = map.TryGetValue(e.CourseId, out var c2) ? c2.ImageUrl : null,
                    IsCompleted = e.IsCompleted,
                    ProgressPercent = e.ProgressPercent,
                    CompletionDate = e.CompletionDate
                })
                .ToList();
        }

        public async Task<UserProfileMiniDTO?> GetMiniAsync(int userId)
        {
            var u = await _db.Users
                .Where(x => x.UserId == userId && x.IsActive)
                .Select(x => new { x.UserId, x.Name, x.AvatarUrl, x.Role })
                .FirstOrDefaultAsync();
            if (u == null) return null;

            var stats = await GetStatsAsync(userId);
            var top = await GetTopCoursesAsync(userId, 3);

            return new UserProfileMiniDTO
            {
                UserId = u.UserId,
                Name = u.Name,
                AvatarUrl = u.AvatarUrl,
                Role = u.Role,
                Level = 0,        // để 0; sau này map thẳng từ API cũ nếu có trường level
                Stats = stats,
                TopCourses = top
            };
        }

        public async Task<UserProfileFullDTO?> GetFullAsync(int userId)
        {
            var baseInfo = await _db.Users
                .Where(x => x.UserId == userId && x.IsActive)
                .Select(x => new { x.UserId, x.Name, x.AvatarUrl, x.Role })
                .FirstOrDefaultAsync();
            if (baseInfo == null) return null;

            var stats = await GetStatsAsync(userId);
            var top = await GetTopCoursesAsync(userId, 5);

            var instructor = await _db.Instructors
                .Where(i => i.UserId == userId)
                .Select(i => new { i.Specialization, i.Bio })
                .FirstOrDefaultAsync();

            var enrs = await _db.Enrollments
                .Where(e => e.UserId == userId)
                .OrderByDescending(e => e.CompletionDate ?? DateTime.MinValue)
                .ThenByDescending(e => e.ProgressPercent)
                .ToListAsync();

            var courseIds = enrs.Select(e => e.CourseId).Distinct().ToList();
            var courses = await _db.Courses
                .Where(c => courseIds.Contains(c.CourseId))
                .Select(c => new { c.CourseId, c.Title, c.ImageUrl })
                .ToListAsync();
            var map = courses.ToDictionary(c => c.CourseId, c => c);

            var enrolled = enrs.Select(e => new CourseBriefDTO
            {
                CourseId = e.CourseId,
                Title = map.TryGetValue(e.CourseId, out var c) ? c.Title : $"Course #{e.CourseId}",
                ImageUrl = map.TryGetValue(e.CourseId, out var c2) ? c2.ImageUrl : null,
                IsCompleted = e.IsCompleted,
                ProgressPercent = e.ProgressPercent,
                CompletionDate = e.CompletionDate
            }).ToList();

            return new UserProfileFullDTO
            {
                UserId = baseInfo.UserId,
                Name = baseInfo.Name,
                AvatarUrl = baseInfo.AvatarUrl,
                Role = baseInfo.Role,
                Level = 0,            // để 0; sau này map thẳng từ API cũ nếu có trường level
                Stats = stats,
                TopCourses = top,
                Specialization = instructor?.Specialization,
                Bio = instructor?.Bio,
                EnrolledCourses = enrolled
            };
        }

        public async Task<List<UserProfileMiniDTO>> GetMiniBatchAsync(IEnumerable<int> userIds)
        {
            var ids = userIds?.Distinct().ToList() ?? new();
            if (ids.Count == 0) return new();

            var users = await _db.Users
                .Where(x => ids.Contains(x.UserId) && x.IsActive)
                .Select(x => new { x.UserId, x.Name, x.AvatarUrl, x.Role })
                .ToListAsync();

            // Batch enrollments
            var enrs = await _db.Enrollments
                .Where(e => ids.Contains(e.UserId))
                .Select(e => new EnrollmentSnap
                {
                    UserId = e.UserId,
                    CourseId = e.CourseId,
                    IsCompleted = e.IsCompleted,
                    ProgressPercent = e.ProgressPercent,
                    CompletionDate = e.CompletionDate
                })
                .ToListAsync();

            var byUser = enrs.GroupBy(e => e.UserId)
                             .ToDictionary(g => g.Key, g => g.ToList());

            // Batch courses
            var allCourseIds = enrs.Select(e => e.CourseId).Distinct().ToList();
            var courses = await _db.Courses
                .Where(c => allCourseIds.Contains(c.CourseId))
                .Select(c => new { c.CourseId, c.Title, c.ImageUrl })
                .ToListAsync();
            var courseMap = courses.ToDictionary(c => c.CourseId, c => c);

            // Stats dùng ProgressService theo từng user (đúng số liệu), nếu cần tối ưu có thể song song
            var result = new List<UserProfileMiniDTO>();
            foreach (var u in users)
            {
                var stats = await GetStatsAsync(u.UserId);

                var list = byUser.TryGetValue(u.UserId, out var tmp) ? tmp : new List<EnrollmentSnap>();
                var top = list
                    .OrderByDescending(e => e.IsCompleted)
                    .ThenByDescending(e => e.CompletionDate ?? DateTime.MinValue)
                    .ThenByDescending(e => e.ProgressPercent)
                    .Take(3)
                    .Select(e => new CourseBriefDTO
                    {
                        CourseId = e.CourseId,
                        Title = courseMap.TryGetValue(e.CourseId, out var c) ? c.Title : $"Course #{e.CourseId}",
                        ImageUrl = courseMap.TryGetValue(e.CourseId, out var c2) ? c2.ImageUrl : null,
                        IsCompleted = e.IsCompleted,
                        ProgressPercent = e.ProgressPercent,
                        CompletionDate = e.CompletionDate
                    })
                    .ToList();

                result.Add(new UserProfileMiniDTO
                {
                    UserId = u.UserId,
                    Name = u.Name,
                    AvatarUrl = u.AvatarUrl,
                    Role = u.Role,
                    Level = 0,      // giữ 0 cho đến khi API cũ cung cấp hoặc quy ước rõ
                    Stats = stats,
                    TopCourses = top
                });
            }
            return result;
        }

        public async Task<List<UserProfileFullDTO>> GetFullBatchAsync(IEnumerable<int> userIds)
        {
            var ids = userIds?.Distinct().ToList() ?? new();
            if (ids.Count == 0) return new();

            var minis = await GetMiniBatchAsync(ids);
            var miniMap = minis.ToDictionary(x => x.UserId, x => x);

            var ins = await _db.Instructors
                .Where(i => ids.Contains(i.UserId))
                .Select(i => new { i.UserId, i.Specialization, i.Bio })
                .ToListAsync();
            var insMap = ins.ToDictionary(x => x.UserId, x => x);

            var enrs = await _db.Enrollments
                .Where(e => ids.Contains(e.UserId))
                .OrderByDescending(e => e.CompletionDate ?? DateTime.MinValue)
                .ThenByDescending(e => e.ProgressPercent)
                .ToListAsync();

            var courseIds = enrs.Select(e => e.CourseId).Distinct().ToList();
            var courses = await _db.Courses
                .Where(c => courseIds.Contains(c.CourseId))
                .Select(c => new { c.CourseId, c.Title, c.ImageUrl })
                .ToListAsync();
            var courseMap = courses.ToDictionary(c => c.CourseId, c => c);

            var enByUser = enrs.GroupBy(e => e.UserId).ToDictionary(g => g.Key, g => g.ToList());

            var result = new List<UserProfileFullDTO>();
            foreach (var id in ids)
            {
                if (!miniMap.TryGetValue(id, out var m)) continue;
                insMap.TryGetValue(id, out var iv);

                var enrolled = enByUser.TryGetValue(id, out var list) ? list : new List<Enrollment>();
                var enrolledDtos = enrolled.Select(e => new CourseBriefDTO
                {
                    CourseId = e.CourseId,
                    Title = courseMap.TryGetValue(e.CourseId, out var c) ? c.Title : $"Course #{e.CourseId}",
                    ImageUrl = courseMap.TryGetValue(e.CourseId, out var c2) ? c2.ImageUrl : null,
                    IsCompleted = e.IsCompleted,
                    ProgressPercent = e.ProgressPercent,
                    CompletionDate = e.CompletionDate
                }).ToList();

                result.Add(new UserProfileFullDTO
                {
                    UserId = m.UserId,
                    Name = m.Name,
                    AvatarUrl = m.AvatarUrl,
                    Role = m.Role,
                    Level = 0,                 // đồng bộ như trên
                    Stats = m.Stats,
                    TopCourses = m.TopCourses,
                    Specialization = iv?.Specialization,
                    Bio = iv?.Bio,
                    EnrolledCourses = enrolledDtos
                });
            }
            return result;
        }
    }
}
