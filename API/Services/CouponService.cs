using API.Repositories;
using Data.Models;
using static API.DTOs.CouponDTO;

namespace API.Services
{
    public interface ICouponService
    {
        Task<IEnumerable<Coupon>> GetAllAsync(); // Lấy danh sách tất cả các mã giảm giá
        Task<Coupon> GetByIdAsync(int id); // Lấy mã giảm giá theo id
        Task<Coupon> CreateAsync(CreateCouponDTO dto); // Tạo mã giảm giá
        Task<Coupon> UpdateAsync(int id, UpdateCouponDTO dto); // Cập nhật mã giảm giá
        Task<Coupon> ToggleStatusAsync(int id, bool isActive); // Vô hiệu mã giảm giá
        Task<object> ValidateAsync(string code, int courseId); // Xác thực mã giảm giá
    }

    public class CouponService : ICouponService
    {
        private readonly ICouponRepository _repo;

        public CouponService(ICouponRepository repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<Coupon>> GetAllAsync() => await _repo.GetAllAsync();

        public async Task<Coupon> GetByIdAsync(int id) => await _repo.GetByIdAsync(id);

        public async Task<Coupon> CreateAsync(CreateCouponDTO dto)
        {
            var coupon = new Coupon
            {
                Code = dto.Code,
                ExpiryDate = dto.ExpiryDate,
                MaxUsageCount = dto.MaxUsageCount,
                DiscountPercent = dto.DiscountPercent,
                DiscountAmount = dto.DiscountAmount,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow.AddHours(7),
                UsageCount = 0
            };
            await _repo.AddAsync(coupon);
            return coupon;
        }

        public async Task<Coupon> UpdateAsync(int id, UpdateCouponDTO dto)
        {
            var coupon = await _repo.GetByIdAsync(id);
            if (coupon == null) return null;

            coupon.ExpiryDate = dto.ExpiryDate;
            coupon.MaxUsageCount = dto.MaxUsageCount;
            coupon.DiscountPercent = dto.DiscountPercent;
            coupon.DiscountAmount = dto.DiscountAmount;
            coupon.IsActive = dto.IsActive;

            await _repo.UpdateAsync(coupon);
            return coupon;
        }

        public async Task<Coupon> ToggleStatusAsync(int id, bool isActive)
        {
            var coupon = await _repo.GetByIdAsync(id);
            if (coupon == null) return null;

            coupon.IsActive = isActive;
            await _repo.UpdateAsync(coupon);
            return coupon;
        }

        public async Task<object> ValidateAsync(string code, int courseId)
        {
            var coupon = await _repo.GetByCodeAsync(code);
            if (coupon == null || !coupon.IsActive)
                return new { valid = false, message = "Mã giảm giá không tồn tại hoặc không còn hiệu lực" };

            if (coupon.ExpiryDate < DateTime.UtcNow.AddHours(7))
                return new { valid = false, message = "Mã giảm giá đã hết hạn" };

            if (coupon.UsageCount >= coupon.MaxUsageCount)
                return new { valid = false, message = "Mã giảm giá đã được sử dụng quá giới hạn" };

            return new
            {
                valid = true,
                coupon.CouponId,
                coupon.DiscountPercent,
                coupon.DiscountAmount,
                message = "Mã giảm giá hợp lệ"
            };
        }
    }

}
