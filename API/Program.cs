using Microsoft.EntityFrameworkCore;
using Data.Models;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ Controllers (Web API)

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký DbContext với Connection String từ appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseCors(options =>
    options.WithOrigins("http://localhost:3000", "https://localhost:3000")
           .AllowAnyMethod()
           .AllowAnyHeader());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Bật Authorization (bảo vệ API)
app.UseAuthorization();

// Định nghĩa API Controllers
app.MapControllers();

// Chạy ứng dụng
app.Run();



