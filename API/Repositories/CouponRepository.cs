using Data.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace API.Repositories
{
    public interface ICouponRepository
    {
        Task<IEnumerable<Coupon>> GetAllAsync(); // Lấy danh sách tất cả các mã giảm giá
        Task<Coupon> GetByIdAsync(int id); // Lấy mã giảm giá theo id
        Task<Coupon> GetByCodeAsync(string code); // Lấy mã giảm giá theo code
        Task AddAsync(Coupon coupon); // Thêm mã giảm giá
        Task UpdateAsync(Coupon coupon); // Cập nhật mã giảm giá
    }

    public class CouponRepository : ICouponRepository
    {
        private readonly ApplicationDbContext _context;

        public CouponRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Coupon>> GetAllAsync() => await _context.Coupons.ToListAsync();

        public async Task<Coupon> GetByIdAsync(int id) => await _context.Coupons.FindAsync(id);

        public async Task<Coupon> GetByCodeAsync(string code) =>
            await _context.Coupons.FirstOrDefaultAsync(c => c.Code == code);

        public async Task AddAsync(Coupon coupon)
        {
            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Coupon coupon)
        {
            _context.Coupons.Update(coupon);
            await _context.SaveChangesAsync();
        }
    }

}
