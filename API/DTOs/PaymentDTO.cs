namespace API.DTOs
{
    public class PaymentDTO
    {
        public class CreatePaymentDTO
        {
            public int UserId { get; set; }
            public int CourseId { get; set; }
            public int? CouponId { get; set; }
            public string Method { get; set; } = "momo";
            public string OrderInfo { get; set; }
            public decimal Amount { get; set; }
        }

        public class UpdatePaymentDTO
        {
            public string OrderId { get; set; }
            public string TransactionId { get; set; }
            public string ResponseMessage { get; set; }
            public string Status { get; set; } // "success", "fail", "cancel"
        }

    }
}
