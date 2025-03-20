import { useNavigate } from "react-router-dom"
import { FaStar, FaUsers, FaClock, FaBook, FaTimes, FaUser } from "react-icons/fa"
import useProgress from "../hooks/useProgress"

const CoursePopup = ({ course, onClose, instructors = [] }) => {
  const navigate = useNavigate()
  const { createNewProgress } = useProgress()

  // Tìm tên giảng viên dựa trên instructorId
  const instructorName = instructors.find((i) => i.userId === course.instructorId)?.name || "Chưa có"

  // Kiểm tra ngày hết hạn
  const isExpiringSoon = course.expiryDate && new Date(course.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000

  // Format ngày hết hạn
  const formattedExpiryDate = course.expiryDate
    ? new Date(course.expiryDate).toLocaleDateString("vi-VN")
    : "Không giới hạn"

  const handleJoinCourse = () => {
    // Goi them phan api dang ky khoa học ở đây
    if (!course.isJoin) {
      createNewProgress(course.courseId)
      navigate(`/courses/${course.courseId}/lessons`)
    }
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
            {/* Thêm thông tin giảng viên */}
            <div className="flex items-center">
              <FaUser className="text-gray-500 mr-1" />
              <span>{instructorName}</span>
            </div>
            {/* Cập nhật hiển thị ngày hết hạn */}
            <div className="flex items-center">
              <FaClock className={`mr-1 ${isExpiringSoon ? "text-red-500" : "text-gray-500"}`} />
              <span className={isExpiringSoon ? "text-red-500 font-medium" : "text-gray-700"}>
                HH: {formattedExpiryDate}
              </span>
            </div>
            <div className="flex items-center">
              <FaBook className="text-gray-500 mr-1" />
              <span>{course.totalLesson} bài học</span>
            </div>
          </div>

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