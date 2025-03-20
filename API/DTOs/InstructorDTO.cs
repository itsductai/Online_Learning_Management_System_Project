namespace API.DTOs
{
    public class InstructorDTO //Chứa thông tin giáo viên + tổng số khóa học + tổng số học viên.
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public int TotalCourses { get; set; } // Số khóa học đã tạo
        public int TotalStudents { get; set; } // Tổng số học viên đã tham gia khóa học của họ
    }

    public class AssignInstructorDTO //Dùng để gán instructor cho khóa học.
    {
        public int CourseId { get; set; }
        public int InstructorId { get; set; }
    }
}