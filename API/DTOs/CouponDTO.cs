namespace API.DTOs
{
    public class CouponDTO
    {
        public class CreateCouponDTO
        {
            public string Code { get; set; }
            public DateTime ExpiryDate { get; set; }
            public int MaxUsageCount { get; set; }
            public int? DiscountPercent { get; set; }
            public decimal? DiscountAmount { get; set; }
            public bool IsActive { get; set; }
        }

        public class UpdateCouponDTO
        {
            public DateTime ExpiryDate { get; set; }
            public int MaxUsageCount { get; set; }
            public int? DiscountPercent { get; set; }
            public decimal? DiscountAmount { get; set; }
            public bool IsActive { get; set; }
        }

        public class ToggleCouponStatusDTO
        {
            public bool IsActive { get; set; }
        }

    }
}
