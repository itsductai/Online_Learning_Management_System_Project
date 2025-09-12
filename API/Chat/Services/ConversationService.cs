using API.Chat.DTOs;
using API.Chat.Repositories;
using Data.Chat;
using Data.Models;             // <--- để map sang Users
using Microsoft.EntityFrameworkCore;
using API.Chat.Notifications;

namespace API.Chat.Services;

public class ConversationService : IConversationService
{
    private readonly IConversationRepository _repo;
    private readonly ApplicationDbContext _usersDb;
    private readonly IChatNotifier _notify;

    public ConversationService(
        IConversationRepository repo,
        ApplicationDbContext usersDb,
        IChatNotifier notify)
    {
        _repo = repo;
        _usersDb = usersDb;
        _notify = notify;
    }

    public async Task<List<ConversationDTO>> GetMyAsync(int userId)
    {
        var list = await _repo.GetForUserAsync(userId);

        // gom hết userIds rồi load 1 lần để tránh N+1
        var allUserIds = list.SelectMany(c => c.Members.Select(m => m.UserId)).Distinct().ToList();
        var users = await _usersDb.Users
            .Where(u => allUserIds.Contains(u.UserId))
            .Select(u => new { u.UserId, u.Name, u.AvatarUrl, u.Role })
            .ToListAsync();

        UserSummaryDTO? MapUser(int id)
        {
            var u = users.FirstOrDefault(x => x.UserId == id);
            return u == null ? null : new UserSummaryDTO
            {
                UserId = u.UserId,
                Name = u.Name,
                AvatarUrl = u.AvatarUrl,
                Role = u.Role
            };
        }

        var result = new List<ConversationDTO>();
        foreach (var c in list)
        {
            var dto = new ConversationDTO
            {
                Id = c.Id,
                Type = c.Type,
                Title = c.Title,
                CreatedAt = c.CreatedAt,
                MemberIds = c.Members.Select(m => m.UserId).ToList()
            };

            if (c.Type == "Direct")
            {
                var otherId = c.Members.FirstOrDefault(m => m.UserId != userId)?.UserId;
                dto.OtherUser = otherId.HasValue ? MapUser(otherId.Value) : null;
            }
            else
            {
                // Group: để sẵn danh sách members -> FE dễ render header, member list
                dto.Members = c.Members
                    .Select(m => MapUser(m.UserId)!)
                    .Where(x => x != null)
                    .ToList();
            }

            result.Add(dto);
        }

        return result;
    }

    public async Task<ConversationDTO> CreateDirectAsync(int me, int otherUserId)
    {
        if (me == otherUserId) throw new InvalidOperationException("Cannot start direct chat with yourself.");

        var exist = await _repo.GetDirectByMembersAsync(me, otherUserId);
        var c = exist ?? await _repo.CreateDirectAsync(me, otherUserId);

        // map lại theo DTO enrich để FE có ngay OtherUser
        var myCons = await GetMyAsync(me);
        var myView = myCons.First(x => x.Id == c.Id);

        //  bắn cho cả 2 phía: tôi và đối phương
        var theyCons = await GetMyAsync(otherUserId);
        var theirView = theyCons.First(x => x.Id == c.Id);

        await _notify.ConversationUpsertedAsync(myView, new[] { me });
        await _notify.ConversationUpsertedAsync(theirView, new[] { otherUserId });

        return myView;
    }

    public async Task<bool> EnsureMemberAsync(Guid conversationId, int userId)
    {
        var c = await _repo.GetAsync(conversationId);
        return c?.Members.Any(m => m.UserId == userId) == true;
    }

    public async Task<bool> LeaveAsync(Guid conversationId, int userId)
    {
        var c = await _repo.GetAsync(conversationId);
        if (c == null) return false;

        var m = c.Members.FirstOrDefault(x => x.UserId == userId);
        if (m == null) return false;

        c.Members.Remove(m);
        await _repo.SaveChangesAsync();

        if (!c.Members.Any())
        {
            await _repo.DeleteAsync(c);
            //  gỡ khỏi sidebar của người rời
            await _notify.ConversationRemovedAsync(conversationId, new[] { userId });
        }
        else
        {
            //  gỡ khỏi sidebar phía người rời
            await _notify.ConversationRemovedAsync(conversationId, new[] { userId });

            // (tuỳ chọn) upsert cho những người còn lại (cập nhật member list)
            var remainIds = c.Members.Select(x => x.UserId).ToList();
            if (remainIds.Count > 0)
            {
                var any = remainIds[0];
                var view = (await GetMyAsync(any)).First(x => x.Id == c.Id);
                await _notify.ConversationUpsertedAsync(view, remainIds);
            }
        }
        return true;
    }

    // ==== Group phần dưới giữ nguyên như bạn đã viết ====

    public async Task<ConversationDTO> CreateGroupAsync(int creatorId, string title, IEnumerable<int> memberIds)
    {
        var c = await _repo.CreateGroupAsync(creatorId, title.Trim(), memberIds ?? Array.Empty<int>());
        var my = await GetMyAsync(creatorId);
        return my.First(x => x.Id == c.Id);
    }

    public async Task<ConversationDTO?> RenameGroupAsync(Guid conversationId, int userId, string newTitle)
    {
        var c = await _repo.GetAsync(conversationId);
        if (c == null || c.Type != "Group") return null;
        var me = c.Members.FirstOrDefault(x => x.UserId == userId);
        if (me?.Role != "Admin") return null;

        c.Title = (newTitle ?? "").Trim();
        await _repo.SaveChangesAsync();

        var my = await GetMyAsync(userId);
        return my.FirstOrDefault(x => x.Id == c.Id);
    }

    public async Task<bool> AddMembersAsync(Guid conversationId, int userId, IEnumerable<int> memberIds)
    {
        var c = await _repo.GetAsync(conversationId);
        if (c == null || c.Type != "Group") return false;

        var me = c.Members.FirstOrDefault(x => x.UserId == userId);
        if (me?.Role != "Admin") return false;

        await _repo.AddMembersAsync(conversationId, memberIds);
        return true;
    }

    public async Task<bool> RemoveMemberAsync(Guid conversationId, int requesterId, int targetUserId)
    {
        var c = await _repo.GetAsync(conversationId);
        if (c == null || c.Type != "Group") return false;

        var req = c.Members.FirstOrDefault(x => x.UserId == requesterId);
        if (req?.Role != "Admin") return false;

        var m = c.Members.FirstOrDefault(x => x.UserId == targetUserId);
        if (m == null) return false;

        c.Members.Remove(m);
        await _repo.SaveChangesAsync();

        if (!c.Members.Any()) await _repo.DeleteAsync(c);
        return true;
    }
}
