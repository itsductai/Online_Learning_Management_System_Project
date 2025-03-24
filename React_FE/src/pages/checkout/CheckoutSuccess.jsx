import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { confirmPayment } from "../../services/paymentAPI"

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState("loading")
  const navigate = useNavigate()

  useEffect(() => {
    const confirm = async () => {
      try {
        const query = Object.fromEntries([...searchParams])
        const result = await confirmPayment(query)

        if (result.success) {
          setStatus("success")
          // Nếu bạn có courseId ở OrderId, có thể redirect người dùng sau 3s
          // setTimeout(() => navigate(`/courses/${result.courseId}/lessons`), 3000)
        } else {
          setStatus("fail")
        }
      } catch (err) {
        setStatus("fail")
      }
    }

    confirm()
  }, [])

  return (
    <div className="p-10 text-center">
      {status === "loading" && <p>Đang xác nhận thanh toán...</p>}
      {status === "success" && (
        <div>
          <h1 className="text-green-600 text-2xl font-bold mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-700">Cảm ơn bạn đã mua khóa học. Hệ thống sẽ tự động chuyển bạn đến trang học tập.</p>
        </div>
      )}
      {status === "fail" && (
        <div>
          <h1 className="text-red-600 text-2xl font-bold mb-2">Thanh toán thất bại!</h1>
          <p className="text-gray-700">Vui lòng thử lại hoặc liên hệ hỗ trợ.</p>
        </div>
      )}
    </div>
  )
}

export default CheckoutSuccess
