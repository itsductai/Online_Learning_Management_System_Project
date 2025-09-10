using Microsoft.EntityFrameworkCore;
using Data.Models;
using API.Services;
using API.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Identity;
using API.DTOs;

using Data.Chat;
using API.Chat.Repositories;
using API.Chat.Services;
using API.Chat.Hubs;
using Microsoft.AspNetCore.SignalR;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    // Thêm xác thực JWT vào Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Nhập token theo format: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] { }
        }
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173", "http://localhost:7025", "https://c1ea-123-28-250-163.ngrok-free.app") // Thêm cả Swagger
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials()
                   .WithExposedHeaders("WWW-Authenticate"); // Đảm bảo phản hồi lỗi JWT được hiển thị;
        });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});


// Tạo một policy mới để bảo vệ API chỉ cho Instructor & Admin sử dụng.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireInstructorOrAdmin", policy =>
    {
        policy.RequireRole("Admin", "Instructor");
    });
});


builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"C:\Keys")) // 🔥 Lưu khóa vào file để tránh mất
    .SetApplicationName("OLMS")
    .DisableAutomaticKeyGeneration(); // 🔥 Tránh tạo khóa mới mỗi lần khởi động app





// Cấu hình Authentication JWT và Google OAuth
var jwtSettings = builder.Configuration.GetSection("JwtSettings");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // Dùng JWT để xác thực
    //options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme; // Dùng Google để xác thực
    //options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // Dùng Cookies để lưu state
})
.AddJwtBearer(options => // Thêm cấu hình JWT Auth, JWT chỉ dùng để xác thực token, không hỗ trợ việc SignIn Google.
{
    options.TokenValidationParameters = new TokenValidationParameters // Cấu hình Token Validation
    {
        ValidateIssuer = true, // Validate Issuer là thông tin của người tạo Token
        ValidateAudience = true, // Validate Audience là thông tin của người nhận Token
        ValidateLifetime = true, // Validate Lifetime là thời gian sống của Token
        ValidateIssuerSigningKey = true, // Validate Issuer Signing Key là thông tin mã hóa của người tạo Token
        ValidIssuer = jwtSettings["Issuer"], // Issuer là thông tin của người tạo Token
        ValidAudience = jwtSettings["Audience"], // Audience là thông tin của người nhận Token
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"])) // Issuer Signing Key là thông tin mã hóa của người tạo Token
    };

    // Cấu hình để JWT có thể dùng cho SignalR
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
            {
                context.Token = accessToken; // cho SignalR
            }
            return Task.CompletedTask;
        }
    };
});




// Thêm dịch vụ Controllers (Web API)

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<JwtService>();

// Đăng ký DbContext với Connection String từ appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký DbContext cho Chat module
builder.Services.AddDbContext<ChatDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Đăng ký SignalR
builder.Services.AddSignalR();

// DI cho module chat
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IConversationService, ConversationService>();
builder.Services.AddScoped<IMessageService, MessageService>();

// Đăng ký Service
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICoursesService, CoursesService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<ILessonService, LessonService>();
builder.Services.AddScoped<IQuizService, QuizService>(); // Đăng ký service Quiz
builder.Services.AddScoped<IProgressService, ProgressService>(); // Đăng ký service Progress
builder.Services.AddScoped<IInstructorService, InstructorService>(); // Đăng ký service Instructor
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ICouponService, CouponService>(); // Đăng ký service Coupon

// Đăng ký Repositories
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ICoursesRepository, CoursesRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<ILessonRepository, LessonRepository>();
builder.Services.AddScoped<IQuizRepository, QuizRepository>();
builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
builder.Services.AddScoped<IInstructorRepository, InstructorRepository>(); // Đăng ký repository Instructor
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<ICouponRepository, CouponRepository>(); // Đăng ký repository Coupon


// Đăng ký IPasswordHasher<User>
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services.Configure<MomoOptionModel>(builder.Configuration.GetSection("MomoAPI"));
builder.Services.AddScoped<IMomoService, MomoService>();


builder.Services.AddScoped<IVnPayService, VnPayService>(); // Đăng ký service VnPay


var app = builder.Build();

app.UseCors("AllowAll");




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    });
}

// Bật Authorization (bảo vệ API)
app.UseAuthentication(); // Bật Authentication
app.UseAuthorization();  // Bật Authorization

// Định nghĩa API Controllers
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat").RequireCors("AllowReactApp"); // Hub dùng policy có AllowCredentials

// Chạy ứng dụng
app.Run();

public partial class Program { }


