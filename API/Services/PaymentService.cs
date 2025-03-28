using API.Repositories;
using Data.Models;
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
        public PaymentService(IPaymentRepository paymentRepo)
        {
            _paymentRepo = paymentRepo;
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
            return await _paymentRepo.CreatePaymentAsync(payment);
        }

        public async Task<bool> UpdatePaymentAsync(int paymentId, UpdatePaymentDTO dto)
        {
            return await _paymentRepo.UpdatePaymentAsync(paymentId, dto.TransactionId, dto.ResponseMessage, dto.Status);
        }

        public async Task<List<object>> GetAllPaymentsAsync() => await _paymentRepo.GetAllPaymentsWithDetailsAsync();
        public async Task<List<object>> GetPaymentsByUserAsync(int userId) => await _paymentRepo.GetPaymentsByUserIdWithDetailsAsync(userId);
    }
}
