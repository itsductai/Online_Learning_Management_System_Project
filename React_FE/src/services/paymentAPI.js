import api from "./api"

// Kiểm tra mã giảm giá
export const checkPromoCode = async (promoCode, courseId) => {
  try {
    // Trong thực tế, bạn sẽ gọi API để kiểm tra mã giảm giá
    // const res = await api.post("/payment/check-promo", { promoCode, courseId });
    // return res.data;

    // Dữ liệu giả để test
    await new Promise((resolve) => setTimeout(resolve, 800)) // Giả lập độ trễ API

    // Danh sách mã giảm giá giả
    const validPromoCodes = {
      WELCOME10: { discountPercent: 10, valid: true },
      SUMMER20: { discountPercent: 20, valid: true },
      FLASH50: { discountPercent: 50, valid: true },
      EXPIRED: { valid: false, message: "Mã giảm giá đã hết hạn" },
      INVALID: { valid: false, message: "Mã giảm giá không áp dụng cho khóa học này" },
    }

    if (promoCode in validPromoCodes) {
      return validPromoCodes[promoCode]
    }

    return { valid: false, message: "Mã giảm giá không tồn tại" }
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã giảm giá:", error)
    throw error
  }
}

// Tạo đơn hàng và chuyển hướng đến cổng thanh toán VNPay
export const createPaymentVNPay = async (orderData) => {
  try {
    const res = await api.post("/payment/create-vnpay", orderData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error)
    throw error
  }
}

// Xác nhận thanh toán thành công
export const confirmPayment = async (paymentData) => {
  try {
    const res = await api.post("/payment/confirm", paymentData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi xác nhận thanh toán:", error)
    throw error
  }
}

// Lấy lịch sử thanh toán của người dùng
export const getPaymentHistory = async () => {
  try {
    const res = await api.get("/payment/history")
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy lịch sử thanh toán:", error)
    throw error
  }
}

