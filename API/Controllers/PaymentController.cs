using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using API.Services;
using static API.DTOs.PaymentDTO;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IMomoService _momoService;
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService, IMomoService momoService, IVnPayService vnPayService)
        {
            _paymentService = paymentService;
            _momoService = momoService; 
            _vnPayService = vnPayService;
        }
        // ======================= Các thành phần xử lý thanh toán ở database ===========================

        // Tạo hóa đơn
        [HttpPost]
        public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentDTO dto)
        {
            var id = await _paymentService.CreatePaymentAsync(dto);
            return Ok(new { PaymentId = id });
        }

        // Cập nhật trạng thái thanh toán
        [HttpPut("{paymentId}")]
        public async Task<IActionResult> UpdatePayment(int paymentId, [FromBody] UpdatePaymentDTO dto)
        {
            var result = await _paymentService.UpdatePaymentAsync(paymentId, dto);
            if (!result) return NotFound();
            return NoContent();
        }

        // Lấy tất cả hóa đơn
        [HttpGet("all")]
        public async Task<IActionResult> GetAllPayments()
        {
            var data = await _paymentService.GetAllPaymentsAsync();
            return Ok(data);
        }

        // Lấy hóa đơn theo user
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPayments(int userId)
        {
            var data = await _paymentService.GetPaymentsByUserAsync(userId);
            return Ok(data);
        }

        // ======================= Các thành phần xử lý thanh toán qua cổng thanh toán ===========================

        // Tạo thanh toán Momo
        [HttpPost("create-momo")]
        public async Task<IActionResult> CreatePaymentMomo([FromBody] OrderInfoModel model)
        {
            var response = await _momoService.CreatePaymentMomo(model);
            return Ok(new { paymentUrl = response.PayUrl });
        }

        [HttpGet("momo-return")]
        public IActionResult MomoReturn()
        {
            var result = _momoService.PaymentExecuteAsync(HttpContext.Request.Query);
            return Ok(result); // hoặc redirect sang FE nếu muốn
        }

        [HttpPost("momo-notify")]
        public IActionResult MomoNotify()
        {
            var result = _momoService.PaymentExecuteAsync(HttpContext.Request.Query);
            // TODO: xử lý lưu DB nếu cần
            return Ok();
        }

        [HttpPost("CreatePaymentUrl")]
        public IActionResult CreatePaymentUrl([FromBody] PaymentInformationModel model)
        {
            var url = _vnPayService.CreatePaymentUrl(model, HttpContext);
            return Ok(new { paymentUrl = url });
        }

        [HttpGet("PaymentCallback")]
        public IActionResult PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            return Ok(response); // FE sẽ hiển thị kết quả
        }

        [HttpGet("checkout/paymentcallback")]
        public IActionResult PaymentCallbackVnpay()
        {
            try
            {
                var response = _vnPayService.PaymentExecute(Request.Query);

                if (!response.Success)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Thanh toán thất bại hoặc sai chữ ký"
                    });
                }

                return Ok(new
                {
                    success = true,
                    orderId = response.OrderId,
                    paymentId = response.PaymentId,
                    amount = Request.Query["vnp_Amount"],
                    message = "Thanh toán thành công"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = "Lỗi hệ thống: " + ex.Message
                });
            }
        }


    }
}
