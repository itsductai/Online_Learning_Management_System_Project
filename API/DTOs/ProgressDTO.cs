namespace API.DTOs
{
    public class ProgressDTO
    {
        public class EnrollmentDto
        {
            public int CourseId { get; set; }
        }

        public class ProgressUpdateDto
        {
            public int CourseId { get; set; }
            public List<int> CompletedLessons { get; set; }
            public double ProgressPercent { get; set; }
            public DateTime LastUpdated { get; set; }
        }

        public class UserProgressDto
        {
            public int CourseId { get; set; }
            public List<int> CompletedLessons { get; set; }
            public double ProgressPercent { get; set; }
            public DateTime LastUpdated { get; set; }
            public bool IsCompleted { get; set; }
        }

        public class EnrollmentResponseDto
        {
            public int UserId { get; set; }
            public int CourseId { get; set; }
            public double ProgressPercent { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class ProgressStatisticsDto
        {
            public int TotalEnrollments { get; set; }
            public int CompletedEnrollments { get; set; }
        }

        public class ProcessDTO
        {
            public int TotalEnrolledCourses { get; set; } // Số khóa học đã tham gia
            public int CompletedCourses { get; set; }    // Số khóa học đã hoàn thành
            public int[] TotalStudyTime { get; set; }    // Tổng thời gian học [hours, minutes]
            public float AverageProgress { get; set; }   // Tiến độ trung bình (%)

            // Chỉ dành cho Admin
            public int TotalStudents { get; set; }       // Tổng số học viên
            public int TotalCourses { get; set; }        // Tổng số khóa học
            public int TotalLessons { get; set; }        // Tổng số bài học
        }

    }
}
