using Data.Models;
using System;

namespace API.Repositories
{
    public interface IPaymentRepository
    {
        Task<int> CreatePaymentAsync(Payment payment);
        Task<bool> UpdatePaymentAsync(int paymentId, string? transactionId, string? responseMessage, string status);
        Task<List<object>> GetAllPaymentsWithDetailsAsync();
        Task<List<object>> GetPaymentsByUserIdWithDetailsAsync(int userId);
    }
    public class PaymentRepository : IPaymentRepository
    {
        private readonly ApplicationDbContext _context;
        public PaymentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreatePaymentAsync(Payment payment)
        {
            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();
            return payment.PaymentId;
        }

        public async Task<bool> UpdatePaymentAsync(int paymentId, string? transactionId, string? responseMessage, string status)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return false;
            payment.TransactionId = transactionId;
            payment.ResponseMessage = responseMessage;
            payment.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<object>> GetAllPaymentsWithDetailsAsync()
        {
            return await _context.Payments
                .Include(p => p.User)
                .Include(p => p.Course)
                .Include(p => p.Coupon)
                .Select(p => new
                {
                    p.PaymentId,
                    UserName = p.User.Name,
                    CourseTitle = p.Course.Title,
                    CouponCode = p.Coupon != null ? p.Coupon.Code : null,
                    p.Method,
                    p.Amount,
                    p.Status,
                    p.CreatedAt
                }).ToListAsync<object>();
        }

        public async Task<List<object>> GetPaymentsByUserIdWithDetailsAsync(int userId)
        {
            return await _context.Payments
                .Where(p => p.UserId == userId)
                .Include(p => p.Course)
                .Include(p => p.Coupon)
                .Select(p => new
                {
                    p.PaymentId,
                    CourseTitle = p.Course.Title,
                    CouponCode = p.Coupon != null ? p.Coupon.Code : null,
                    p.Method,
                    p.Amount,
                    p.Status,
                    p.CreatedAt
                }).ToListAsync<object>();
        }
    }
}
