// API/Chat/Common/UserExtensions.cs
using System.Security.Claims;

namespace API.Chat.Common;

public static class UserExtensions
{
    public static int RequireUserId(this ClaimsPrincipal user)
    {
        string? raw =
            user.FindFirstValue(ClaimTypes.NameIdentifier) ?? // đang dùng NameIdentifier
            user.FindFirstValue("uid") ??
            user.FindFirstValue("sub");

        if (string.IsNullOrWhiteSpace(raw))
            throw new UnauthorizedAccessException("UserId claim is missing.");
        return int.Parse(raw);
    }
}
