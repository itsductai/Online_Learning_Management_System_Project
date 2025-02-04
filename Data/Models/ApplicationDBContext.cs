using Microsoft.EntityFrameworkCore;

namespace Data.Models 
{
    // DbContext quản lý các bảng trong database
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        // Cấu hình kết nối database
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    "Server=MSI;Database=learning_system_DB;User Id=sa;Password=123;TrustServerCertificate=True",
                    b => b.MigrationsAssembly("Data") //  Định nghĩa nơi lưu Migration
                );
            }
        }

        // Khai báo các bảng trong database
        public DbSet<User> Users { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizResult> QuizResults { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<LessonProgress> LessonProgress { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<CommunityPost> CommunityPosts { get; set; }
        public DbSet<CommunityMessage> CommunityMessages { get; set; }

        
    }
}
