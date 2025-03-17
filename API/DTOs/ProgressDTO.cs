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

    }
}
