import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaTag, FaCheck, FaExclamationCircle, FaCreditCard } from "react-icons/fa"
import { checkPromoCode } from "../../services/paymentAPI"

const PaymentPopup = ({ course, onClose, instructors = [], onPaymentComplete }) => {
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")
  const [finalPrice, setFinalPrice] = useState(course.price || 0)

  // Tìm tên giảng viên dựa trên instructorId
  const instructorName = instructors.find((i) => i.userId === course.instructorId)?.name || "Chưa có"

  // Format ngày hết hạn
  const formattedExpiryDate = course.expiryDate ? new Date(course.expiryDate).toLocaleDateString("vi-VN") : null

  // Cập nhật giá cuối cùng khi discount thay đổi
  useEffect(() => {
    if (course.price) {
      const discountAmount = (course.price * discount) / 100
      setFinalPrice(course.price - discountAmount)
    }
  }, [discount, course.price])

  // Xử lý kiểm tra mã giảm giá
  const handleCheckPromoCode = async () => {
    if (!promoCode.trim()) {
      setPromoError("Vui lòng nhập mã giảm giá")
      return
    }

    setIsCheckingPromo(true)
    setPromoError("")
    setPromoSuccess("")

    try {
      const result = await checkPromoCode(promoCode, course.courseId)

      if (result.valid) {
        setDiscount(result.discountPercent)
        setPromoSuccess(`Áp dụng thành công: Giảm ${result.discountPercent}%`)
      } else {
        setDiscount(0)
        setPromoError(result.message || "Mã giảm giá không hợp lệ")
      }
    } catch (error) {
      setDiscount(0)
      setPromoError("Lỗi khi kiểm tra mã giảm giá. Vui lòng thử lại.")
      console.error("Lỗi kiểm tra mã giảm giá:", error)
    } finally {
      setIsCheckingPromo(false)
    }
  }

  // Xử lý khi nhấn nút thanh toán
  const handlePayment = () => {
    // Trong thực tế, đây là nơi bạn sẽ chuyển hướng đến trang thanh toán VNPay
    // Hiện tại chỉ hiển thị thông báo thành công
    alert(`Chuyển hướng đến cổng thanh toán VNPay với số tiền: ${finalPrice.toLocaleString()}đ`)

    // Gọi callback khi thanh toán hoàn tất
    if (onPaymentComplete) {
      onPaymentComplete()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="relative">
          <img
            src={course.imageUrl || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h2 className="text-2xl font-bold text-white p-6">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          >
            <FaTimes className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thông tin thanh toán</h3>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Giảng viên:</span>
                <span className="font-medium">{instructorName}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Thời hạn truy cập:</span>
                <span className="font-medium">
                  {formattedExpiryDate ? `Đến hết ngày ${formattedExpiryDate}` : "Vĩnh viễn"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bao gồm:</span>
                <span className="font-medium">{course.totalLesson || 0} bài học</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FaTag className="text-primary mr-2" />
              <h3 className="text-lg font-semibold">Mã giảm giá</h3>
            </div>

            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isCheckingPromo}
              />
              <button
                onClick={handleCheckPromoCode}
                disabled={isCheckingPromo}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
              >
                {isCheckingPromo ? "Đang kiểm tra..." : "Áp dụng"}
              </button>
            </div>

            <AnimatePresence>
              {promoError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center text-red-500 text-sm mt-1"
                >
                  <FaExclamationCircle className="mr-1" />
                  <span>{promoError}</span>
                </motion.div>
              )}

              {promoSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center text-green-500 text-sm mt-1"
                >
                  <FaCheck className="mr-1" />
                  <span>{promoSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-gray-200 pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Giá gốc:</span>
              <span className="font-medium">{course.price?.toLocaleString()}đ</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center mb-2 text-green-600">
                <span>Giảm giá ({discount}%):</span>
                <span>-{((course.price * discount) / 100).toLocaleString()}đ</span>
              </div>
            )}

            <div className="flex justify-between items-center text-lg font-bold mt-2">
              <span>Tổng thanh toán:</span>
              <span className="text-primary">{finalPrice.toLocaleString()}đ</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              onClick={handlePayment}
              className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition w-full"
            >
              <FaCreditCard className="mr-2" />
              Thanh toán với VNPay
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full"
            >
              Hủy
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default PaymentPopup