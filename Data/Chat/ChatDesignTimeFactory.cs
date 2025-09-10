using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Data.Chat
{
    public class ChatDesignTimeFactory : IDesignTimeDbContextFactory<ChatDbContext>
    {
        public ChatDbContext CreateDbContext(string[] args)
        {
            // BasePath = chính thư mục Data (nơi bạn đang chạy lệnh)
            var basePath = Directory.GetCurrentDirectory();

            var config = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false)             // <-- Data/appsettings.json
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddJsonFile("appsettings.Design.json", optional: true)       // (tuỳ chọn) nếu muốn cấu hình riêng cho design-time
                .AddEnvironmentVariables()
                .Build();

            var connStr = config.GetConnectionString("DefaultConnection");
            if (string.IsNullOrWhiteSpace(connStr))
                throw new InvalidDataException("Missing ConnectionStrings:DefaultConnection in Data/appsettings.json");

            var options = new DbContextOptionsBuilder<ChatDbContext>()
                .UseSqlServer(connStr, opt => opt.MigrationsAssembly("Data")) // migration nằm trong project Data
                .Options;

            return new ChatDbContext(options);
        }
    }
}
