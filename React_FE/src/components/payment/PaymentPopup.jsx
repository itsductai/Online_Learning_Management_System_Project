import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaTimes, FaTag, FaCheck, FaExclamationCircle, FaCreditCard, FaWallet } from "react-icons/fa"
import { checkPromoCode, createMomoPayment } from "../../services/paymentAPI"
import { useAuth } from "../../context/AuthContext"

const PaymentPopup = ({ course, onClose, instructors = [], onPaymentComplete }) => {
  const { user } = useAuth()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [isCheckingPromo, setIsCheckingPromo] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [promoError, setPromoError] = useState("")
  const [promoSuccess, setPromoSuccess] = useState("")
  const [finalPrice, setFinalPrice] = useState(course.price || 0)
  const [paymentMethod, setPaymentMethod] = useState("momo") // Mặc định là momo

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
        setPromoError(result.message || "Mã giảm giá không hợp lệ")
      }
    } catch (error) {
      setPromoError("Lỗi khi kiểm tra mã giảm giá. Vui lòng thử lại.")
      console.error("Lỗi kiểm tra mã giảm giá:", error)
    } finally {
      setIsCheckingPromo(false)
    }
  }

  // Xử lý khi nhấn nút thanh toán VNPay
  const handleVNPayPayment = () => {
    // Trong thực tế, đây là nơi bạn sẽ chuyển hướng đến trang thanh toán VNPay
    alert(`Chuyển hướng đến cổng thanh toán VNPay với số tiền: ${finalPrice.toLocaleString()}đ`)

    // Gọi callback khi thanh toán hoàn tất
    if (onPaymentComplete) {
      onPaymentComplete()
    }
  }

  // Xử lý khi nhấn nút thanh toán MoMo
  const handleMomoPayment = async () => {
    try {
      setIsProcessingPayment(true)

      // Tạo mã đơn hàng ngẫu nhiên với courseId để có thể trích xuất sau này
      const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}_${course.courseId}`

      // Chuẩn bị dữ liệu thanh toán
      const paymentData = {
        fullName: user?.name || "Học viên",
        orderId: orderId,
        orderInfo: `Thanh toán khóa học: ${course.title}`,
        amount: finalPrice.toString(),
      }

      // Gọi API tạo thanh toán MoMo
      const response = await createMomoPayment(paymentData)

      // Chuyển hướng người dùng đến URL thanh toán MoMo
      if (response && response.paymentUrl) {
        window.location.href = response.paymentUrl
      } else {
        throw new Error("Không nhận được URL thanh toán từ MoMo")
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán qua MoMo:", error)
      alert("Có lỗi xảy ra khi thanh toán qua MoMo. Vui lòng thử lại sau.")
    } finally {
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"

      >
        <div className="relative">
          <img
            src={course.imageUrl || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <h2 className="text-xl font-bold text-white p-4">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
          >
            <FaTimes className="w-4 h-4 text-gray-700" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between items-center mb-1 text-sm">
                <span className="text-gray-600">Giảng viên:</span>
                <span className="font-medium">{instructorName}</span>
              </div>
              {formattedExpiryDate && (
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span className="text-gray-600">Thời hạn:</span>
                  <span className="font-medium">{formattedExpiryDate}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Bài học:</span>
                <span className="font-medium">{course.totalLesson || 0}</span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FaTag className="text-primary mr-2 text-sm" />
              <h3 className="text-base font-semibold">Mã giảm giá</h3>
            </div>

            <div className="flex space-x-2 mb-1">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Nhập mã giảm giá"
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                disabled={isCheckingPromo}
              />
              <button
                onClick={handleCheckPromoCode}
                disabled={isCheckingPromo}
                className="px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50"
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
                  className="flex items-center text-red-500 text-xs mt-1"
                >
                  <FaExclamationCircle className="mr-1 text-xs" />
                  <span>{promoError}</span>
                </motion.div>
              )}

              {promoSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center text-green-500 text-xs mt-1"
                >
                  <FaCheck className="mr-1 text-xs" />
                  <span>{promoSuccess}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-gray-200 pt-3 mb-4">
            <div className="flex justify-between items-center mb-1 text-sm">
              <span className="text-gray-600">Giá gốc:</span>
              <span className="font-medium">{course.price?.toLocaleString()}đ</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center mb-1 text-green-600 text-sm">
                <span>Giảm giá ({discount}%):</span>
                <span>-{((course.price * discount) / 100).toLocaleString()}đ</span>
              </div>
            )}

            <div className="flex justify-between items-center text-base font-bold mt-2">
              <span>Tổng thanh toán:</span>
              <span className="text-primary">{finalPrice.toLocaleString()}đ</span>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2">Phương thức thanh toán</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod("vnpay")}
                className={`flex items-center justify-center p-2 border rounded-lg transition text-sm ${
                  paymentMethod === "vnpay"
                    ? "border-primary bg-primary bg-opacity-10"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FaCreditCard className={`mr-1 ${paymentMethod === "vnpay" ? "text-primary" : "text-gray-600"}`} />
                <span className={paymentMethod === "vnpay" ? "font-medium text-primary" : "text-gray-700"}>VNPay</span>
              </button>

              <button
                onClick={() => setPaymentMethod("momo")}
                className={`flex items-center justify-center p-2 border rounded-lg transition text-sm ${
                  paymentMethod === "momo"
                    ? "border-[#d82d8b] bg-[#d82d8b] bg-opacity-10"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FaWallet className={`mr-1 ${paymentMethod === "momo" ? "text-[#d82d8b]" : "text-gray-600"}`} />
                <span className={paymentMethod === "momo" ? "font-medium text-[#d82d8b]" : "text-gray-700"}>MoMo</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {paymentMethod === "vnpay" ? (
              <button
                onClick={handleVNPayPayment}
                disabled={isProcessingPayment}
                className="flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition w-full disabled:opacity-70"
              >
                <FaCreditCard className="mr-2" />
                {isProcessingPayment ? "Đang xử lý..." : "Thanh toán với VNPay"}
              </button>
            ) : (
              <button
                onClick={handleMomoPayment}
                disabled={isProcessingPayment}
                className="flex items-center justify-center px-4 py-2 bg-[#d82d8b] text-white rounded-lg hover:bg-opacity-90 transition w-full disabled:opacity-70"
              >
                <FaWallet className="mr-2" />
                {isProcessingPayment ? "Đang xử lý..." : "Thanh toán với MoMo"}
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isProcessingPayment}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition w-full disabled:opacity-70"
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