// Hiển thị thông tin chung của khóa học, bao gồm ảnh, tiêu đề, mô tả, tiến độ hoàn thành và giá

import { useNavigate } from "react-router-dom"
import { FaHome, FaUser, FaClock } from "react-icons/fa"

const CourseHeader = ({ course, progress, error, instructors = [] }) => {
  // dùng để điều hướng người dùng
  const navigate = useNavigate()

  // Nếu course chưa có dữ liệu (ví dụ: API chưa load xong), component sẽ không render gì cả
  if (!course) return null

  // Tìm tên giảng viên dựa trên instructorId
  const instructorName = instructors.find((i) => i.userId === course.instructorId)?.name || "Chưa có"

  // Kiểm tra ngày hết hạn
  const isExpiringSoon = course.expiryDate && new Date(course.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000

  // Format ngày hết hạn
  const formattedExpiryDate = course.expiryDate ? new Date(course.expiryDate).toLocaleDateString("vi-VN") : null

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-start gap-6">
        <div className="w-48 h-32 rounded-lg overflow-hidden">
          <img src={course.imageUrl || "/placeholder.svg"} alt={course.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <button onClick={() => navigate("/courses")} className="text-primary hover:text-primary-dark">
              <FaHome className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">{course.description}</p>

          {/* Thêm thông tin giảng viên và ngày hết hạn */}
          <div className="flex flex-wrap items-center gap-4 mb-3">
            <div className="flex items-center text-sm text-gray-600">
              <FaUser className="mr-1" />
              <span>Giảng viên: {instructorName}</span>
            </div>

            {formattedExpiryDate && (
              <div className="flex items-center text-sm">
                <FaClock className={`mr-1 ${isExpiringSoon ? "text-red-500" : "text-gray-600"}`} />
                <span className={isExpiringSoon ? "text-red-500 font-medium" : "text-gray-600"}>
                  Hết hạn: {formattedExpiryDate}
                </span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">Tiến độ khóa học</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            {/* Hiển thị tiến độ hoàn thành của khóa học dựa trên giá trị progress (tính theo %) */}
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-2">
            {/* Hiển thị số lượng bài học có trong khóa học */}
            <span className="text-sm text-gray-500">{course.lessonCount || 0} bài học</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                course.isPaid ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
              }`}
            >
              {course.isPaid ? `${course.price?.toLocaleString()}đ` : "Miễn phí"}
            </span>
          </div>

          {/* Hiển thị thông báo lỗi khi lưu tiến độ */}
          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        </div>
      </div>
    </div>
  )
}

export default CourseHeader