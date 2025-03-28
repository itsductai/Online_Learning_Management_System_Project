using System.ComponentModel.DataAnnotations;

namespace Data.Models
{
    public class Coupon
    {
        [Key]
        public int CouponId { get; set; }

        [Required, MaxLength(20)]
        public string Code { get; set; }

        public DateTime ExpiryDate { get; set; } // Hạn sử dụng của mã

        public int UsageCount { get; set; } = 0; // Số lần mã được sử dụng (tăng dần)

        public int MaxUsageCount { get; set; } = 1; // Số lượt tối đa có thể dùng mã (default 1)

        public int? DiscountPercent { get; set; } // Phần trăm giảm giá (ví dụ 10%)

        public decimal? DiscountAmount { get; set; } // Số tiền giảm cứng (ví dụ 50000đ)

        public bool IsActive { get; set; } = true; // còn hiệu lưc hay không

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow.AddHours(7); // Ngày tạo mã

        // Navigation property
        public ICollection<Payment>? Payments { get; set; }
    }
}
