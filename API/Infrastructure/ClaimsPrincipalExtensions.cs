using System.Security.Claims;

namespace API.Infrastructure
{
    public static class ClaimsPrincipalExtensions
    {
        public static int RequireUserId(this ClaimsPrincipal user)
        {
            var s = user.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(s)) throw new UnauthorizedAccessException("Missing user id.");
            return int.Parse(s);
        }
    }
}
