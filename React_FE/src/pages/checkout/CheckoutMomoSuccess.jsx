import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaHome, FaBook, FaArrowLeft } from "react-icons/fa"
import { createProgress } from "../../services/progressAPI"
import { updatePayment } from "../../services/paymentAPI"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"

const CheckoutMomoSuccess = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)

  const [status, setStatus] = useState("loading") // loading, success, fail, cancel
  const [message, setMessage] = useState("")
  const [courseId, setCourseId] = useState(null)
  const [transactionDetails, setTransactionDetails] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  // Xử lý kết quả thanh toán khi component mount
  useEffect(() => {
    const processPaymentResult = () => {
      // Lấy các tham số từ URL
      const resultCode = "0" // searchParams.get("resultCode") || searchParams.get("errorCode")
      const orderId = searchParams.get("orderId")
      const amount = searchParams.get("amount")
      const orderInfo = searchParams.get("orderInfo")
      const transId = searchParams.get("transId")
      const responseMessage = searchParams.get("message") || searchParams.get("localMessage")

      // Lưu thông tin giao dịch để hiển thị
      setTransactionDetails({
        orderId,
        amount: amount ? Number.parseInt(amount).toLocaleString() + "đ" : "N/A",
        orderInfo,
        transId,
        responseTime: searchParams.get("responseTime"),
        payType: searchParams.get("payType"),
      })

      // Xử lý trạng thái dựa trên resultCode
      if (resultCode === "0") {
        setStatus("success")
        setMessage("Thanh toán thành công! Cảm ơn bạn đã mua khóa học.")
      } else if (resultCode === "49") {
        setStatus("cancel")
        setMessage("Bạn đã hủy giao dịch thanh toán.")
      } else if (resultCode === "42") {
        setStatus("fail")
        setMessage("Thanh toán thất bại: Tài khoản của bạn không đủ số dư để thực hiện giao dịch.")
      } else if (resultCode === "1006") {
        setStatus("fail")
        setMessage("Thanh toán thất bại: Giao dịch bị từ chối.")
      } else {
        setStatus("fail")
        setMessage(`Thanh toán thất bại: ${responseMessage || "Đã xảy ra lỗi trong quá trình thanh toán."}`)
      }
    }

    processPaymentResult()
  }, [location.search]) // Chỉ chạy khi URL thay đổi

  useEffect(() => {
  const updatePaymentStatus = async () => {
    const orderId = searchParams.get("orderId")
    const transId = searchParams.get("transId")
    const responseMessage = searchParams.get("message") || searchParams.get("localMessage")

    if (!orderId) return

    let finalStatus = "fail"
    if (status === "success") finalStatus = "success"
    else if (status === "cancel") finalStatus = "cancel"

    const storedPaymentId = localStorage.getItem("paymentId")
    const storedCourseId = localStorage.getItem("courseId")
    setCourseId(storedCourseId)

    const updateData = {
      orderId: orderId,
      transactionId: transId,
      responseMessage: responseMessage,
      status: finalStatus
    }

    try {
      await updatePayment(storedPaymentId, updateData)
      console.log("Cập nhật trạng thái hóa đơn thành công.")
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái hóa đơn:", err)
    }
  }

  if (status !== "loading") {
    updatePaymentStatus()
  }
}, [status])


  // Đăng ký khóa học khi thanh toán thành công và có courseId
  useEffect(() => {
    const enrollCourse = async () => {
      if (status === "success" && courseId) {
        try {
          setIsProcessing(true)
          await createProgress(courseId)
          console.log("Đăng ký khóa học thành công:", courseId)
        } catch (error) {
          console.error("Lỗi khi đăng ký khóa học:", error)
        } finally {
          setIsProcessing(false)
        }
      }
    }

    enrollCourse()
  }, [status, courseId]) // Chỉ chạy khi status hoặc courseId thay đổi

  // Hàm điều hướng đến trang khóa học
  const goToCourse = () => {
    if (courseId) {
      navigate(`/courses/${courseId}/lessons`)
    } else {
      navigate("/courses")
    }
  }

  // Hàm quay về trang khóa học
  const goToCourses = () => {
    navigate("/courses")
  }

  // Hàm quay lại trang trước
  const goBack = () => {
    navigate(-1)
  }

  // Render các icon và màu sắc dựa trên trạng thái
  const renderStatusIcon = () => {
    switch (status) {
      case "success":
        return <FaCheckCircle className="text-green-500 text-6xl mb-4" />
      case "fail":
        return <FaTimesCircle className="text-red-500 text-6xl mb-4" />
      case "cancel":
        return <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4" />
      default:
        return <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mb-4"></div>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col items-center text-center mb-6">
              {renderStatusIcon()}
              <h1 className="text-2xl font-bold mb-2">
                {status === "loading" ? "Đang xử lý thanh toán..." : "Kết quả thanh toán"}
              </h1>
              <p
                className={`text-lg ${
                  status === "success"
                    ? "text-green-600"
                    : status === "fail"
                      ? "text-red-600"
                      : status === "cancel"
                        ? "text-yellow-600"
                        : "text-gray-600"
                }`}
              >
                {message}
              </p>
            </div>

            {status !== "loading" && (
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Chi tiết giao dịch</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-medium">{transactionDetails.orderId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-medium">{transactionDetails.amount || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nội dung:</span>
                    <span className="font-medium">{transactionDetails.orderInfo || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-medium">{transactionDetails.transId || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="font-medium">
                      {transactionDetails.responseTime
                        ? new Date(transactionDetails.responseTime).toLocaleString("vi-VN")
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium">Ví MoMo</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {status === "success" ? (
                <>
                  <button
                    onClick={goToCourse}
                    disabled={isProcessing}
                    className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-70"
                  >
                    <FaBook className="mr-2" />
                    {isProcessing ? "Đang xử lý..." : "Đi đến khóa học"}
                  </button>
                  <button
                    onClick={goToCourses}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FaHome className="mr-2" />
                    Về trang khóa học
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={goBack}
                    className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    <FaArrowLeft className="mr-2" />
                    Quay lại
                  </button>
                  <button
                    onClick={goToCourses}
                    className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    <FaHome className="mr-2" />
                    Về trang khóa học
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CheckoutMomoSuccess