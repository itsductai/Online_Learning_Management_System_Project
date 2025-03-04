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
using Services; // Thêm thư viện Google Auth

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
            builder.WithOrigins("http://localhost:5173", "http://localhost:7025") // Thêm cả Swagger
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
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
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme; // Dùng Google để xác thực
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme; // Dùng Cookies để lưu state
})
.AddCookie("Cookies", options =>
{
    //options.Cookie.Name = "GoogleAuthCookie";
    options.Cookie.SameSite = SameSiteMode.None; // Bắt buộc phải là None nếu chạy khác cổng
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;    // Nếu HTTPS, đổi thành Always

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
})
.AddGoogle(options =>
{
    var googleSettings = builder.Configuration.GetSection("Authentication:Google"); // Lấy thông tin Google Auth từ appsettings.json
    options.ClientId = googleSettings["ClientId"];
    options.ClientSecret = googleSettings["ClientSecret"];
    options.CallbackPath = new PathString("/api/auth/google-callback");

    options.SignInScheme = "Cookies"; // Google sử dụng Cookies để lưu state
    options.SaveTokens = true; // Lưu token sau khi đăng nhập

    options.CorrelationCookie.SameSite = SameSiteMode.None; // Sửa từ Lax thành None
    options.CorrelationCookie.HttpOnly = true;
    options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.Always; // None nếu chạy http, Always nếu chạy https   

    // 🔥 XÓA CORRELATION COOKIE TRƯỚC KHI REDIRECT
    options.Events.OnRedirectToAuthorizationEndpoint = context =>
    {
        var correlationCookies = context.HttpContext.Request.Cookies.Keys
            .Where(k => k.StartsWith(".AspNetCore.Correlation"));
        foreach (var cookie in correlationCookies)
        {
            context.HttpContext.Response.Cookies.Delete(cookie);
            Console.WriteLine($"🗑️ Deleted Correlation Cookie: {cookie} before redirect");
        }

        Console.WriteLine("🚀 Redirecting to Google: " + context.RedirectUri);
        context.Response.Redirect(context.RedirectUri);
        return Task.CompletedTask;
    };

    // 🔥 XÓA CORRELATION COOKIE SAU KHI CALLBACK
    options.Events.OnTicketReceived = context =>
    {
        Console.WriteLine($"📢 OAuth Ticket Received: {context.Principal?.Identity?.Name}");

        var correlationCookies = context.HttpContext.Request.Cookies.Keys
            .Where(k => k.StartsWith(".AspNetCore.Correlation"));
        foreach (var cookie in correlationCookies)
        {
            context.HttpContext.Response.Cookies.Delete(cookie);
            Console.WriteLine($"🗑️ Deleted Correlation Cookie: {cookie} after callback");
        }

        return Task.CompletedTask;
    };
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.Events.OnRedirectToLogin = context =>
    {
        Console.WriteLine("Redirecting to login, CorrelationCookie missing!");
        return Task.CompletedTask;
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

// Đăng ký Service
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICoursesService, CoursesService>();
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<ILessonService, LessonService>();

// Đăng ký Repositories
builder.Services.AddScoped<IUsersRepository, UsersRepository>();
builder.Services.AddScoped<ICoursesRepository, CoursesRepository>();
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<ILessonRepository, LessonRepository>();

// Đăng ký IPasswordHasher<User>
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();




var app = builder.Build();

app.UseCors("AllowReactApp");

app.Use(async (context, next) =>
{
    var cookies = context.Request.Cookies;
    foreach (var cookie in cookies)
    {
        Console.WriteLine($"Cookie: {cookie.Key} = {cookie.Value}");
    }
    await next();
});




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

// Chạy ứng dụng
app.Run();


