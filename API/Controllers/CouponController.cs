using API.Services;
using Microsoft.AspNetCore.Mvc;
using static API.DTOs.CouponDTO;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CouponsController : ControllerBase
    {
        private readonly ICouponService _couponService;

        public CouponsController(ICouponService couponService)
        {
            _couponService = couponService;
        }

        // Lấy tất cả coupon
        [HttpGet]
        public async Task<IActionResult> GetAll() => Ok(await _couponService.GetAllAsync());

        // Lấy coupon theo id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _couponService.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Tạo coupon
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCouponDTO dto)
        {
            var result = await _couponService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.CouponId }, result);
        }

        // Cập nhật coupon
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCouponDTO dto)
        {
            var result = await _couponService.UpdateAsync(id, dto);
            if (result == null) return NotFound();
            return Ok(result);
        }


        // Vô hiệu coupon
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> ToggleStatus(int id, [FromBody] ToggleCouponStatusDTO dto)
        {
            var result = await _couponService.ToggleStatusAsync(id, dto.IsActive);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // Xác thực coupon
        [HttpGet("validate")]
        public async Task<IActionResult> Validate([FromQuery] string code, [FromQuery] int courseId)
        {
            var result = await _couponService.ValidateAsync(code, courseId);
            return Ok(result);
        }
    }

}
