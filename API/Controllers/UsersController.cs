using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static API.DTOs.UsersDTO;

namespace API.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUsersService _usersService;

        public UsersController(IUsersService usersService)
        {
            _usersService = usersService;
        }

        // ✅ API cập nhật thông tin cá nhân (Tên, Email)
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDTO updateProfileDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Không thể xác định danh tính người dùng!");

            var result = await _usersService.UpdateProfile(userId, updateProfileDto);
            if (result == null) return BadRequest("Không thể cập nhật thông tin!");

            return Ok(result);
        }

        // ✅ API đổi mật khẩu
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO changePasswordDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Không thể xác định danh tính người dùng!");

            var result = await _usersService.ChangePassword(userId, changePasswordDto);
            if (!result) return BadRequest("Mật khẩu cũ không đúng hoặc không thể đổi mật khẩu!");

            return Ok("Đổi mật khẩu thành công!");
        }

        // ✅ API upload ảnh đại diện
        [HttpPost("upload-avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] UploadAvatarDTO uploadAvatarDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return Unauthorized("Không thể xác định danh tính người dùng!");

            var result = await _usersService.UploadAvatar(userId, uploadAvatarDto);
            if (!result) return BadRequest("Không thể cập nhật ảnh đại diện!");

            return Ok(new { message = "Ảnh đại diện đã cập nhật!" });
        }

        // API vô hiệu hóa/kích hoạt tài khoản (Admin có thể vô hiệu hóa bất kỳ user, Student chỉ vô hiệu hóa chính mình)
        [HttpPut("disable/{id}")]
        public async Task<IActionResult> ToggleUserStatus(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (!int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized("Không thể xác định danh tính người dùng!");

            var result = await _usersService.ToggleUserStatus(currentUserId, id, roleClaim);
            if (!result) return Forbid("Bạn không có quyền vô hiệu hóa tài khoản này!");

            return Ok("Thay đổi trạng thái tài khoản thành công!");
        }
    }
}
