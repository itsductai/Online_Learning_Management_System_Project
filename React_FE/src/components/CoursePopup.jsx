// Popup chi tiết khóa học

import { useNavigate } from "react-router-dom"
import { FaStar, FaUsers, FaClock, FaBook, FaTimes } from "react-icons/fa"

const CoursePopup = ({ course, onClose }) => {
  const navigate = useNavigate()

  const handleJoinCourse = () => {
    navigate(`/courses/${course.courseId}/lessons`)
  }

  return (
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
            <div className="flex items-center">
              <FaClock className="text-gray-500 mr-1" />
              <span>{course.totalDuration || 8} giờ học</span>
            </div>
            <div className="flex items-center">
              <FaBook className="text-gray-500 mr-1" />
              <span>{course.lessonCount || 12} bài học</span>
            </div>
          </div>

          {/* Hiển thị tiến độ nếu đã bắt đầu học */}
          {course.progress > 0 && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tiến độ của bạn</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">Hoàn thành</span>
                <span className="text-sm font-medium text-gray-700">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Đã hoàn thành {course.completedLessons || 0}/{course.totalLessons || 0} bài học
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
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
            >
              {course.progress > 0 ? "Tiếp tục học" : "Tham gia khóa học"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePopup