using API.Repositories;
using Data.Models;
using Microsoft.EntityFrameworkCore;
using static API.DTOs.PaymentDTO;

namespace API.Services
{
    public interface IPaymentService
    {
        Task<int> CreatePaymentAsync(CreatePaymentDTO dto);
        Task<bool> UpdatePaymentAsync(int paymentId, UpdatePaymentDTO dto);
        Task<List<object>> GetAllPaymentsAsync();
        Task<List<object>> GetPaymentsByUserAsync(int userId);
    }
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _paymentRepo;
        private readonly ICouponRepository _couponRepo;
        public PaymentService(IPaymentRepository paymentRepo, ICouponRepository couponRepo)
        {
            _paymentRepo = paymentRepo;
            _couponRepo = couponRepo;
        }

        public async Task<int> CreatePaymentAsync(CreatePaymentDTO dto)
        {
            var payment = new Payment
            {
                UserId = dto.UserId,
                CourseId = dto.CourseId,
                CouponId = dto.CouponId,
                Method = dto.Method,
                OrderInfo = dto.OrderInfo,
                Amount = dto.Amount,
                CreatedAt = DateTime.UtcNow.AddHours(7),
                Status = "waiting"
            };

            // Nếu có mã giảm giá => tăng UsageCount thủ công
            if (dto.CouponId.HasValue)
            {
                var coupon = await _couponRepo.GetByIdAsync(dto.CouponId.Value);
                if (coupon != null)
                {
                    coupon.UsageCount++;
                }
                await _couponRepo.UpdateAsync(coupon);
            }

            return await _paymentRepo.CreatePaymentAsync(payment);
        }

        public async Task<bool> UpdatePaymentAsync(int paymentId, UpdatePaymentDTO dto)
        {
            return await _paymentRepo.UpdatePaymentAsync(paymentId, dto.OrderId, dto.TransactionId, dto.ResponseMessage, dto.Status);
        }

        public async Task<List<object>> GetAllPaymentsAsync() => await _paymentRepo.GetAllPaymentsWithDetailsAsync();
        public async Task<List<object>> GetPaymentsByUserAsync(int userId) => await _paymentRepo.GetPaymentsByUserIdWithDetailsAsync(userId);
    }
}
