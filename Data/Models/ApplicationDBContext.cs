using Microsoft.EntityFrameworkCore;

namespace Data.Models 
{
    // DbContext quản lý các bảng trong database
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Course>()
                .Property(c => c.Price)
                .HasColumnType("decimal(10,2)") // Đảm bảo kiểu dữ liệu đúng với SQL Server
                .HasPrecision(10, 2); // Đảm bảo độ chính xác và tỷ lệ chính xác

            modelBuilder.Entity<Instructor>() // Định nghĩa quan hệ 1-1 giữa User và Instructor
                .HasOne(i => i.User) // Một Instructor chỉ thuộc về một User
                .WithOne(u => u.InstructorProfile) // Một User chỉ có một Instructor
                .HasForeignKey<Instructor>(i => i.UserId); // Khóa ngoại tham chiếu đến UserId trong bảng User

        }


        //// Cấu hình kết nối database
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        optionsBuilder.UseSqlServer(
        //            "Server=MSI;Database=learning_system_DB;User Id=sa;Password=123;TrustServerCertificate=True",
        //            b => b.MigrationsAssembly("Data") //  Định nghĩa nơi lưu Migration
        //        );
        //    }
        //}

        // Khai báo các bảng trong database
        public DbSet<User> Users { get; set; }
        public DbSet<Instructor> Instructors { get; set; }
        public DbSet<Course> Courses { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<TextLesson> TextLessons { get; set; }
        public DbSet<VideoLesson> VideoLessons { get; set; }
        public DbSet<Quiz> Quizzes { get; set; }
        public DbSet<QuizResult> QuizResults { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<LessonProgress> LessonProgress { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Coupon> Coupons { get; set; }
        public DbSet<CommunityMessage> CommunityMessages { get; set; }

        //Chạy Migration và tạo database
        //  dotnet ef migrations add InitialCreate -> Tạo migration từ các model.
        //  dotnet ef database update -> Áp dụng migration để tạo database.


        //Nếu muốn update database thì chạy lệnh sau:
        // dotnet ef migrations add UpdateDatabaseStructure
        //    dotnet ef database update

        // Nếu muốn xóa database và tạo lại từ đầu thì chạy lệnh sau:
        // Xóa db 
        //    dotnet ef database drop --force

        // Xóa thư mục Migrations
        //    Remove-Item -Recurse -Force Migrations

        // Tạo thư mục Migrations đầu tiên
        //    dotnet ef migrations add InitialCreate

        // Update db
        //    dotnet ef database update
    }
}
