import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import CourseCard from "../CourseCard"

const RecentCourses = ({ courses, limit = 3, onCourseClick }) => {
  const { user } = useAuth()

  // Lọc các khóa học đang học gần đây
  const getRecentCourses = () => {
    if (!courses || courses.length === 0) return []

    // Lấy các khóa học có tiến độ (đang học)
    const inProgressCourses = courses.filter(
      (course) => course.progress && course.progress > 0 && course.progress < 100,
    )

    // Sắp xếp theo thời gian cập nhật gần nhất
    const sortedCourses = [...inProgressCourses].sort((a, b) => {
      if (!a.lastUpdated || !b.lastUpdated) return 0
      return new Date(b.lastUpdated) - new Date(a.lastUpdated)
    })

    // Giới hạn số lượng khóa học hiển thị
    return sortedCourses.slice(0, limit)
  }

  const recentCourses = getRecentCourses()

  // Nếu không có khóa học đang học, hiển thị các khóa học nổi bật
  const displayCourses = recentCourses.length > 0 ? recentCourses : courses.slice(0, limit)

  // Tiêu đề section dựa vào có khóa học đang học hay không
  const sectionTitle = recentCourses.length > 0 ? "Khóa học gần đây của bạn" : "Khóa học nổi bật"

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
            <p className="text-gray-600 mt-1">
              {recentCourses.length > 0
                ? "Tiếp tục học tập từ nơi bạn đã dừng lại"
                : "Khám phá các khóa học được đánh giá cao"}
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCourses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              variant={recentCourses.length > 0 ? "progress" : "default"}
              onClick={onCourseClick}
              animate={true}
            />
          ))}
        </div>

        {displayCourses.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có khóa học nào</h3>
            <p className="text-gray-600 mb-4">
              Bắt đầu hành trình học tập của bạn bằng cách khám phá các khóa học của chúng tôi.
            </p>
            <Link to="/courses" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition">
              Khám phá khóa học
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default RecentCourses
