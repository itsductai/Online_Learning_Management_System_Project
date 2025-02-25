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
            if (!result) return BadRequest("Không thể cập nhật thông tin!");

            return Ok("Cập nhật thông tin thành công!");
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

        // ✅ API xóa tài khoản (Admin có thể xóa bất kỳ user, Student chỉ xóa chính mình)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAccount(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var roleClaim = User.FindFirst(ClaimTypes.Role)?.Value;

            if (!int.TryParse(userIdClaim, out var currentUserId))
                return Unauthorized("Không thể xác định danh tính người dùng!");

            var result = await _usersService.DeleteAccount(currentUserId, id, roleClaim);
            if (!result) return Forbid("Bạn không có quyền xóa tài khoản này!");

            return Ok("Xóa tài khoản thành công!");
        }
    }
}
