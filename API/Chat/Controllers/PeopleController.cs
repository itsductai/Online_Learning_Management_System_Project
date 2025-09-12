using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Data.Models;

namespace API.Chat.Controllers;

[ApiController]
[Route("api/chat/people")]
[Authorize]
public class PeopleController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public PeopleController(ApplicationDbContext db) { _db = db; }

    // /api/chat/people/search?q=...
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] string q, [FromQuery] int take = 10)
    {
        q = q?.Trim() ?? "";
        if (q.Length == 0) return Ok(Array.Empty<object>());

        var me = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        var list = await _db.Users
            .Where(u => u.IsActive && u.UserId != me &&
                        (EF.Functions.Like(u.Name, $"%{q}%") || EF.Functions.Like(u.Email, $"%{q}%")))
            .OrderBy(u => u.Name)
            .Take(Math.Clamp(take, 1, 50))
            .Select(u => new { u.UserId, u.Name, u.AvatarUrl })
            .ToListAsync();

        return Ok(list);
    }
}
