import { motion } from "framer-motion" // Sử dụng Framer Motion để thêm hiệu ứng cho các thẻ khóa học
import { FaStar, FaUser, FaClock } from "react-icons/fa"
import BookmarkButton from "./BookmarkButton"

// Animation cho thẻ khóa học
const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1.4,
    },
  },
}
// Component chínhcourse
// course đối tượng chứa thông tin khóa học
// variant	Kiểu hiển thị (default, compact, progress)
// onClick	Hàm được gọi khi click vào khóa học
// showBookmark	Hiển thị nút lưu khóa học
// animate dùng animation
const CourseCard = ({
  course,
  variant = "default",
  onClick,
  showBookmark = false,
  animate = true,
  instructors = [],
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(course) // Gọi hàm onClick(course) để điều hướng đến chi tiết khóa học
    }
  }

  // Tìm tên giảng viên dựa trên instructorId
  const instructorName = instructors.find((i) => i.userId === course.instructorId)?.name || "Chưa có"

  // Kiểm tra ngày hết hạn
  const isExpiringSoon = course.expiryDate && new Date(course.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000

  // Format ngày hết hạn
  const formattedExpiryDate = course.expiryDate ? new Date(course.expiryDate).toLocaleDateString("vi-VN") : null

  // Wrapper component - có thể là motion.div hoặc div thường
  const CardWrapper = animate ? motion.div : "div"
  const wrapperProps = animate
    ? {
        variants: cardVariants, // Áp dụng hiệu ứng xuất hiện
        whileHover: { y: -5 }, // // Khi hover, thẻ nhấc lên 5px
        whileTap: { scale: 0.98 }, // // Khi click, thẻ thu nhỏ 2%
      }
    : {}

  // Render card dựa vào variant
  const renderCard = () => {
    switch (variant) {
      case "compact":
        return (
          <CardWrapper
            {...wrapperProps}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="relative">
              <img
                src={course.imageUrl || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              {showBookmark && (
                <BookmarkButton courseId={course.courseId} size="md" className="absolute top-2 right-2" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{course.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <FaStar className="text-yellow-400 mr-1" />
                <span>{course.rating || 4.5}</span>
                <span className="mx-2">•</span>
                <span>{course.studentCount || 0} học viên</span>
              </div>

              {/* Thêm thông tin giảng viên */}
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <FaUser className="mr-1" />
                <span>{instructorName}</span>
              </div>

              {/* Thêm ngày hết hạn nếu có */}
              {formattedExpiryDate && (
                <div className="flex items-center text-sm">
                  <FaClock className={`mr-1 ${isExpiringSoon ? "text-red-500" : "text-gray-500"}`} />
                  <span className={isExpiringSoon ? "text-red-500 font-medium" : "text-gray-500"}>
                    HH: {formattedExpiryDate}
                  </span>
                </div>
              )}
            </div>
          </CardWrapper>
        )

      case "progress":
        const progress = course.progressPercent || 0
        return (
          <CardWrapper
            {...wrapperProps}
            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="relative">
              <img
                src={course.imageUrl || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex justify-between items-center text-white">
                  <span className="text-sm font-medium">Tiến độ</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-1.5 mt-1">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{course.title}</h3>

              {/* Thêm thông tin giảng viên */}
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <FaUser className="mr-1" />
                <span>{instructorName}</span>
              </div>

              {/* Thêm ngày hết hạn nếu có */}
              {formattedExpiryDate && (
                <div className="flex items-center text-sm mb-2">
                  <FaClock className={`mr-1 ${isExpiringSoon ? "text-red-500" : "text-gray-500"}`} />
                  <span className={isExpiringSoon ? "text-red-500 font-medium" : "text-gray-500"}>
                    HH: {formattedExpiryDate}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{course.totalLesson || 0} bài học</span>
                <button
                  className="text-primary text-sm font-medium hover:underline"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onClick) {
                      onClick(course)
                    }
                  }}
                >
                  {progress >= 100 ? "Xem lại" : "Tiếp tục"}
                </button>
              </div>
            </div>
          </CardWrapper>
        )

      default:
        return (
          <CardWrapper
            {...wrapperProps}
            className="bg-white backdrop-blur-sm rounded-xl shadow-md overflow-hidden cursor-pointer"
            onClick={handleCardClick}
          >
            <div className="relative">
              <img
                src={course.imageUrl || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              {showBookmark && (
                <BookmarkButton courseId={course.courseId} size="md" className="absolute top-2 right-2" />
              )}
              <div className="absolute bottom-0 left-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-tr-lg">
                {course.isPaid ? `${course.price?.toLocaleString()}đ` : "Miễn phí"}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-1">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

              {/* Thêm thông tin giảng viên */}
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <FaUser className="mr-1" />
                <span>{instructorName}</span>
              </div>

              {/* Thêm ngày hết hạn nếu có */}
              {formattedExpiryDate && (
                <div className="flex items-center text-sm mb-2">
                  <FaClock className={`mr-1 ${isExpiringSoon ? "text-red-500" : "text-gray-500"}`} />
                  <span className={isExpiringSoon ? "text-red-500 font-medium" : "text-gray-500"}>
                    HH: {formattedExpiryDate}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm">{course.rating || 4.5}</span>
                </div>
                <span className="text-xs text-gray-500">{course.studentCount || 0} học viên</span>
              </div>
            </div>
          </CardWrapper>
        )
    }
  }

  return renderCard()
}

export default CourseCard