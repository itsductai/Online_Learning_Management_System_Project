using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; } // Khóa chính của bảng

        [Required]
        public int UserId { get; set; } // Khóa ngoại đến bảng Users

        [Required]
        public int CourseId { get; set; } // Khóa ngoại đến bảng Courses

        public int? CouponId { get; set; } // Khóa ngoại đến bảng Coupons (nullable)

        [Required]
        [MaxLength(50)]
        public string Method { get; set; } // Ví dụ: "momo", "vnpay"

        [Required]
        public string OrderInfo { get; set; } // Nội dung đơn hàng: VD: "Thanh toán khóa học ABC"

        [Required]
        public decimal Amount { get; set; } // Số tiền

        [Required]
        public DateTime CreatedAt { get; set; } // Ngày tạo hóa đơn

        public string? TransactionId { get; set; } // Mã giao dịch từ Momo (transId)

        public string? ResponseMessage { get; set; } // Message từ Momo callback

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } // "waiting", "success", "fail", "cancel"

        // Navigation Properties
        [ForeignKey("UserId")]
        public User User { get; set; }

        [ForeignKey("CourseId")]
        public Course Course { get; set; }

        [ForeignKey("CouponId")]
        public Coupon? Coupon { get; set; }
    }
}
