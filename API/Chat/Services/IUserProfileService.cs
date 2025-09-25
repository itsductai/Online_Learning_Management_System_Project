using System.Collections.Generic;
using System.Threading.Tasks;
using API.Chat.DTOs;

namespace API.Chat.Services
{
    public interface IUserProfileService
    {
        Task<UserProfileMiniDTO?> GetMiniAsync(int userId);
        Task<UserProfileFullDTO?> GetFullAsync(int userId);

        Task<List<UserProfileMiniDTO>> GetMiniBatchAsync(IEnumerable<int> userIds); // Tối ưu cho nhóm
        Task<List<UserProfileFullDTO>> GetFullBatchAsync(IEnumerable<int> userIds); // Dùng khi cần đầy đủ cho nhóm
    }
}
