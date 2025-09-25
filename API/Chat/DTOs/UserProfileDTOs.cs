using System;
using System.Collections.Generic;

namespace API.Chat.DTOs
{
    // Thông tin thống kê cơ bản để hiển thị nhanh trên popup
    public class UserStatsDTO
    {
        public int TotalEnrolledCourses { get; set; }     // Tổng số khóa đã đăng ký
        public int CompletedCourses { get; set; }         // Số khóa đã hoàn thành
        public int TotalStudyHours { get; set; }          // Số giờ học (ước lượng từ tổng Duration bài học đã hoàn thành)
        public double AverageProgress { get; set; }       // Tiến độ trung bình (%)
    }

    // Khóa học rút gọn để hiển thị danh sách ngắn
    public class CourseBriefDTO
    {
        public int CourseId { get; set; }
        public string Title { get; set; } = "";
        public string? ImageUrl { get; set; }
        public bool IsCompleted { get; set; }
        public float ProgressPercent { get; set; }
        public DateTime? CompletionDate { get; set; }
    }

    // Hồ sơ rút gọn (popup)
    public class UserProfileMiniDTO
    {
        public int UserId { get; set; }
        public string Name { get; set; } = "";
        public string? AvatarUrl { get; set; }
        public string Role { get; set; } = "Student";
        public int Level { get; set; }                   // Cấp độ suy diễn từ stats
        public UserStatsDTO Stats { get; set; } = new();
        public List<CourseBriefDTO> TopCourses { get; set; } = new(); // Top các khóa đã học/hoàn thành
    }

    // Hồ sơ đầy đủ (xem thêm)
    public class UserProfileFullDTO : UserProfileMiniDTO
    {
        // Thông tin bổ sung (nếu là Instructor)
        public string? Specialization { get; set; }
        public string? Bio { get; set; }

        // Danh sách khóa đã đăng ký đầy đủ (phân trang có thể bổ sung sau)
        public List<CourseBriefDTO> EnrolledCourses { get; set; } = new();
    }
}
