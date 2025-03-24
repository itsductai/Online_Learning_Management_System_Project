using Microsoft.AspNetCore.Mvc;
using API.DTOs;
using API.Services;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IMomoService _momoService;

        public PaymentController(IMomoService momoService, IVnPayService vnPayService)
        {
            _momoService = momoService; 
            _vnPayService = vnPayService;
        }

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
