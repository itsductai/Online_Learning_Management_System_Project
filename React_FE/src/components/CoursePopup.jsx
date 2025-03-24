import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaStar, FaUsers, FaClock, FaBook, FaTimes, FaUser, FaExclamationTriangle } from "react-icons/fa"
import useProgress from "../hooks/useProgress"
import PaymentPopup from "./payment/PaymentPopup"

const CoursePopup = ({ course, onClose, instructors = [] }) => {
  const navigate = useNavigate()
  const { createNewProgress } = useProgress()
  const [showPaymentPopup, setShowPaymentPopup] = useState(false)
  const [showExpiryWarning, setShowExpiryWarning] = useState(false)

  // Tìm tên giảng viên dựa trên instructorId
  const instructorName = instructors.find((i) => i.userId === course.instructorId)?.name || "Chưa có"

  // Kiểm tra ngày hết hạn
  const isExpired = course.expiryDate && new Date(course.expiryDate) < new Date()
  const isExpiringSoon =
    course.expiryDate && !isExpired && new Date(course.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000

  // Format ngày hết hạn
  const formattedExpiryDate = course.expiryDate
    ? new Date(course.expiryDate).toLocaleDateString("vi-VN")
    : "Không giới hạn"

  const handleJoinCourse = () => {
    // Kiểm tra xem khóa học đã hết hạn chưa
    if (isExpired) {
      setShowExpiryWarning(true)
      return
    }

    // Nếu khóa học có phí và chưa tham gia, hiển thị popup thanh toán
    if (course.isPaid && !course.isJoin) {
      setShowPaymentPopup(true)
    } else {
      // Nếu miễn phí hoặc đã tham gia, đăng ký và chuyển đến trang bài học
      if (!course.isJoin) {
        createNewProgress(course.courseId)
      }
      navigate(`/courses/${course.courseId}/lessons`)
    }
  }

  const handlePaymentComplete = () => {
    // Sau khi thanh toán thành công, đăng ký khóa học và chuyển đến trang bài học
    createNewProgress(course.courseId)
    setShowPaymentPopup(false)
    navigate(`/courses/${course.courseId}/lessons`)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <img
              src={course.imageUrl || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
            >
              <FaTimes className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center">
                <FaStar className="text-yellow-400 mr-1" />
                <span>
                  {course.rating || 4.5} ({course.reviewCount || 12} đánh giá)
                </span>
              </div>
              <div className="flex items-center">
                <FaUsers className="text-gray-500 mr-1" />
                <span>{course.studentCount || 120} học viên</span>
              </div>
              {/* Thêm thông tin giảng viên */}
              <div className="flex items-center">
                <FaUser className="text-gray-500 mr-1" />
                <span>{instructorName}</span>
              </div>
              {/* Cập nhật hiển thị ngày hết hạn */}
              <div className="flex items-center">
                <FaClock
                  className={`mr-1 ${isExpired ? "text-red-600" : isExpiringSoon ? "text-red-500" : "text-gray-500"}`}
                />
                <span
                  className={
                    isExpired
                      ? "text-red-600 font-medium"
                      : isExpiringSoon
                        ? "text-red-500 font-medium"
                        : "text-gray-700"
                  }
                >
                  {isExpired ? "Đã hết hạn: " : "HH: "}
                  {formattedExpiryDate}
                </span>
              </div>
              <div className="flex items-center">
                <FaBook className="text-gray-500 mr-1" />
                <span>{course.totalLesson} bài học</span>
              </div>
            </div>

            {/* Hiển thị cảnh báo nếu khóa học đã hết hạn */}
            {isExpired && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
                <FaExclamationTriangle className="text-red-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-700">Khóa học đã hết hạn đăng ký</h4>
                  <p className="text-red-600 text-sm">
                    Khóa học này đã hết hạn đăng ký vào ngày {formattedExpiryDate}. Vui lòng liên hệ quản trị viên để
                    biết thêm thông tin.
                  </p>
                </div>
              </div>
            )}

            {/* Hiển thị cảnh báo nếu khóa học sắp hết hạn */}
            {!isExpired && isExpiringSoon && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start">
                <FaExclamationTriangle className="text-yellow-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-700">Khóa học sắp hết hạn đăng ký</h4>
                  <p className="text-yellow-600 text-sm">
                    Khóa học này sẽ hết hạn đăng ký vào ngày {formattedExpiryDate}. Hãy đăng ký sớm để không bỏ lỡ cơ
                    hội học tập.
                  </p>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Mô tả khóa học</h3>
              <p className="text-gray-700">{course.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Bạn sẽ học được gì</h3>
              <ul className="list-disc pl-5 space-y-1">
                {course.learningOutcomes?.map((outcome, index) => (
                  <li key={index} className="text-gray-700">
                    {outcome}
                  </li>
                )) || (
                  <>
                    <li className="text-gray-700">Hiểu và áp dụng các khái niệm cơ bản</li>
                    <li className="text-gray-700">Phát triển kỹ năng thực hành</li>
                    <li className="text-gray-700">Giải quyết các bài toán thực tế</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-primary">
                {course.isPaid ? `${course.price?.toLocaleString()}đ` : "Miễn phí"}
              </div>
              <button
                onClick={handleJoinCourse}
                disabled={isExpired}
                className={`px-6 py-3 rounded-lg transition ${
                  isExpired ? "bg-gray-400 text-white cursor-not-allowed" : "bg-primary text-white hover:bg-opacity-90"
                }`}
              >
                {course.progress > 0
                  ? "Tiếp tục học"
                  : course.isPaid
                    ? `Mua với ${course.price?.toLocaleString()}đ`
                    : "Tham gia khóa học"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popup thanh toán */}
      {showPaymentPopup && (
        <PaymentPopup
          course={course}
          instructors={instructors}
          onClose={() => setShowPaymentPopup(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}

      {/* Popup cảnh báo hết hạn */}
      {showExpiryWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center mb-4 text-red-600">
              <FaExclamationTriangle className="text-2xl mr-3" />
              <h3 className="text-xl font-bold">Không thể tham gia</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Khóa học này đã hết hạn đăng ký vào ngày {formattedExpiryDate}. Vui lòng liên hệ quản trị viên để biết
              thêm thông tin.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowExpiryWarning(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CoursePopup