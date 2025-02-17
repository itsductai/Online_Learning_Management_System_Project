using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    //Sinh ra một chuỗi ngẫu nhiên dài 32 byte, mã hóa thành Base64 để làm Refresh Token.
    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32]; // Mảng byte 32 phần tử
        using (var rng = RandomNumberGenerator.Create()) // Tạo số ngẫu nhiên
        {
            rng.GetBytes(randomNumber); // Gán số ngẫu nhiên vào mảng
            return Convert.ToBase64String(randomNumber); // Chuyển thành chuỗi Base64
        }
    }

    public string GenerateToken(string userId, string role)
    {
        var jwtSettings = _config.GetSection("JwtSettings"); // lấy toàn bộ phần cấu hình có tên "JwtSettings" trong file `appsettings.json`

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId), // Lưu userId vào claim
            new Claim(ClaimTypes.Role, role) // Lưu role của user vào claim
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"])); // là một class trong thư viện `Microsoft.IdentityModel.Tokens Tạo khóa bí mật từ chuỗi Key trong appsettings.json
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256); //class chứa **thông tin chữ ký** khi tạo JWT, tạo chữ ký số (ký điện tử) bằng thuật toán HmacSha256

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"], // Người phát hành token (thường là server)
            audience: jwtSettings["Audience"], // Người nhận token (thường là client)
            claims: claims, // Các thông tin được lưu trong token (userId, role)
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryMinutes"])), // Thời gian token hết hạn (10 phút)
            signingCredentials: creds // Chữ ký số đảm bảo token không bị chỉnh sửa
        );

        return new JwtSecurityTokenHandler().WriteToken(token); // Chuyển đối tượng JwtSecurityToken thành chuỗi token (dạng JWT)
    }
}
