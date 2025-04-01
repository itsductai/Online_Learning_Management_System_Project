import api from "./api"

// // Kiểm tra mã giảm giá
// export const checkPromoCode = async (promoCode, courseId) => {
//   try {
//     // Trong thực tế, bạn sẽ gọi API để kiểm tra mã giảm giá
//     // const res = await api.post("/payment/check-promo", { promoCode, courseId });
//     // return res.data;

//     // Dữ liệu giả để test
//     await new Promise((resolve) => setTimeout(resolve, 800)) // Giả lập độ trễ API

//     // Danh sách mã giảm giá giả
//     const validPromoCodes = {
//       WELCOME10: { discountPercent: 10, valid: true },
//       SUMMER20: { discountPercent: 20, valid: true },
//       FLASH50: { discountPercent: 50, valid: true },
//       EXPIRED: { valid: false, message: "Mã giảm giá đã hết hạn" },
//       INVALID: { valid: false, message: "Mã giảm giá không áp dụng cho khóa học này" },
//     }

//     if (promoCode in validPromoCodes) {
//       return validPromoCodes[promoCode]
//     }

//     return { valid: false, message: "Mã giảm giá không tồn tại" }
//   } catch (error) {
//     console.error("Lỗi khi kiểm tra mã giảm giá:", error)
//     throw error
//   }
// }

// Tạo hóa đơn thanh toán lưu DB
export const createPayment = async (paymentData) => {
  try {
    const res = await api.post("/payment/", paymentData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi tạo payment:", error)
    throw error
  }
}

// Cập nhật hóa đơn thanh toán khi ở trang checkout Momo
export const updatePayment = async (storedPaymentId, updateData) => {
  try {
    const res = await api.put(`/payment/${storedPaymentId}`, updateData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi cập nhật payment:", error)
    throw error
  }
}

// Lấy tòan bộ hóa đơn cho amdin thống kê
//  GET /api/payment/all
export const getAllPayments = async () => {
  try {
    const res = await api.get("/payment/all")
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy tất cả payment:", error)
    throw error
  }
}

// Lấy lịch sử mua cho user
// GET /api/payment/user/:userId
export const getPaymentsByUser = async (userId) => {
  try {
    const res = await api.get(`/payment/user/${userId}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy payment theo user:", error)
    throw error
  }
}


// Tạo thanh toán MoMo
export const createMomoPayment = async (paymentData) => {
  try {
    const res = await api.post("http://localhost:7025/api/Payment/create-momo", {
      fullName: paymentData.fullName,
      orderId: paymentData.orderId,
      orderInfo: paymentData.orderInfo || `Thanh toán khóa học: ${paymentData.courseName}`,
      amount: paymentData.amount.toString(),
    })

    // API trả về paymentUrl để chuyển hướng người dùng
    return res.data
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán MoMo:", error)
    throw error
  }
}

// Tạo đơn hàng và chuyển hướng đến cổng thanh toán VNPay
export const createPaymentVNPay = async (orderData) => {
  try {
    const res = await api.post("/payment/createpaymenturl", orderData) // đúng route API backend
    return res.data // { paymentUrl: "https://..." }
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error)
    throw error
  }
}


// Xác nhận thanh toán thành công VNpay
export const confirmPayment = async (query) => {
  try {
    const queryString = new URLSearchParams(query).toString()
    const res = await api.get(`/payment/paymentcallback?${queryString}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi xác nhận thanh toán:", error)
    throw error
  }
}

