namespace API.DTOs
{
    public class CoursesDTO
    {

        public class CoursesDto
        {
            public int CourseId { get; set; }
            public string Title { get; set; }
            public string ImageUrl { get; set; }
            public string Description { get; set; }
            public decimal Price { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class CourseDetailDto
        {
            public int CourseId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string ImageUrl { get; set; }
            public int Duration { get; set; }
            public int TotalLessons { get; set; }
            public int TotalStudents { get; set; }
            public int TotalReviews { get; set; }
            public decimal FullPrice { get; set; }
            public decimal DiscountPrice { get; set; }
            public decimal Rating { get; set; }
            public List<LessonDto> Lessons { get; set; }
        }

        public class LessonDto
        {
            public int LessonId { get; set; }
            public string Title { get; set; }
            public int Duration { get; set; }
            public string Url { get; set; }
        }
    }
}
