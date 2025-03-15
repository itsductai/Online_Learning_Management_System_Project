// Hiển thị thông tin chung của khóa học, bao gồm ảnh, tiêu đề, mô tả, tiến độ hoàn thành và giá

import { useNavigate } from "react-router-dom"
import { FaHome } from "react-icons/fa"

const CourseHeader = ({ course, progress, error }) => {
  // dùng để điều hướng người dùng
  const navigate = useNavigate()

  // Nếu course chưa có dữ liệu (ví dụ: API chưa load xong), component sẽ không render gì cả
  if (!course) return null

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

