import api from "./api"

// Lấy tất cả mã giảm giá
export const getAllCoupons = async () => {
  try {
    const res = await api.get("/coupons")
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy danh sách mã giảm giá:", error)
    throw error
  }
}

// Lấy mã giảm giá theo ID
export const getCouponById = async (couponId) => {
  try {
    const res = await api.get(`/coupons/${couponId}`)
    return res.data
  } catch (error) {
    console.error(`Lỗi khi lấy mã giảm giá ID ${couponId}:`, error)
    throw error
  }
}

// Tạo mã giảm giá mới
export const createCoupon = async (couponData) => {
  try {
    const res = await api.post("/coupons", couponData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi tạo mã giảm giá:", error)
    throw error
  }
}

// Cập nhật mã giảm giá
export const updateCoupon = async (couponId, couponData) => {
  try {
    const res = await api.put(`/coupons/${couponId}`, couponData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi cập nhật mã giảm giá:", error)
    throw error
  }
}

// Vô hiệu hóa/kích hoạt mã giảm giá
export const toggleCouponStatus = async (couponId, isActive) => {
  try {
    const res = await api.patch(`/coupons/${couponId}/status`, { isActive })
    return res.data
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái mã giảm giá:", error)
    throw error
  }
}

// Kiểm tra mã giảm giá có hợp lệ không
export const validateCoupon = async (code, courseId) => {
  try {
    const res = await api.get(`/coupons/validate?code=${code}&courseId=${courseId}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi kiểm tra mã giảm giá:", error)
    throw error
  }
}

/*
Ví dụ API Request/Response:

1. Tạo mã giảm giá mới (POST /coupons)
Request:
{
  "code": "SUMMER20",
  "expiryDate": "2025-08-31T00:00:00",
  "maxUsageCount": 50,
  "discountPercent": 20,
  "discountAmount": null,
  "isActive": true
}
Response:
{
  "couponId": 2,
  "code": "SUMMER20",
  "expiryDate": "2025-08-31T00:00:00",
  "usageCount": 0,
  "maxUsageCount": 50,
  "discountPercent": 20,
  "discountAmount": null,
  "isActive": true,
  "createdAt": "2025-03-29T10:15:00"
}

2. Cập nhật mã giảm giá (PUT /coupons/{couponId})
Request:
{
  "expiryDate": "2025-09-30T00:00:00",
  "maxUsageCount": 100,
  "discountPercent": 25,
  "discountAmount": null,
  "isActive": true
}
Response:
{
  "couponId": 2,
  "code": "SUMMER20",
  "expiryDate": "2025-09-30T00:00:00",
  "usageCount": 12,
  "maxUsageCount": 100,
  "discountPercent": 25,
  "discountAmount": null,
  "isActive": true,
  "createdAt": "2025-03-01T10:15:00"
}

3. Thay đổi trạng thái mã giảm giá (PATCH /coupons/{couponId}/status)
Request:
{
  "isActive": false
}
Response:
{
  "couponId": 2,
  "code": "SUMMER20",
  "expiryDate": "2025-09-30T00:00:00",
  "usageCount": 12,
  "maxUsageCount": 100,
  "discountPercent": 25,
  "discountAmount": null,
  "isActive": false,
  "createdAt": "2025-03-01T10:15:00"
}

4. Kiểm tra mã giảm giá (GET /coupons/validate?code=SUMMER20&courseId=1)
Response (hợp lệ):
{
  "valid": true,
  "couponId": 2,
  "discountPercent": 25,
  "discountAmount": null,
  "message": "Mã giảm giá hợp lệ"
}
Response (không hợp lệ):
{
  "valid": false,
  "message": "Mã giảm giá đã hết hạn"
}
*/

// Giả lập API cho quản lý coupon
// const mockCoupons = [
//   {
//     couponId: 1,
//     code: "WELCOME10",
//     expiryDate: "2025-06-30T00:00:00",
//     usageCount: 5,
//     maxUsageCount: 100,
//     discountPercent: 10,
//     discountAmount: null,
//     isActive: true,
//     createdAt: "2025-01-15T08:30:00",
//   },
//   {
//     couponId: 2,
//     code: "SUMMER20",
//     expiryDate: "2025-08-31T00:00:00",
//     usageCount: 12,
//     maxUsageCount: 50,
//     discountPercent: 20,
//     discountAmount: null,
//     isActive: true,
//     createdAt: "2025-03-01T10:15:00",
//   },
//   {
//     couponId: 3,
//     code: "FLASH50",
//     expiryDate: "2025-04-15T00:00:00",
//     usageCount: 8,
//     maxUsageCount: 10,
//     discountPercent: 50,
//     discountAmount: null,
//     isActive: true,
//     createdAt: "2025-03-10T14:45:00",
//   },
//   {
//     couponId: 4,
//     code: "FIXED100K",
//     expiryDate: "2025-12-31T00:00:00",
//     usageCount: 3,
//     maxUsageCount: 100,
//     discountPercent: null,
//     discountAmount: 100000,
//     isActive: true,
//     createdAt: "2025-02-20T09:30:00",
//   },
//   {
//     couponId: 5,
//     code: "EXPIRED",
//     expiryDate: "2025-01-31T00:00:00",
//     usageCount: 20,
//     maxUsageCount: 20,
//     discountPercent: 15,
//     discountAmount: null,
//     isActive: false,
//     createdAt: "2025-01-01T11:00:00",
//   },
// ]