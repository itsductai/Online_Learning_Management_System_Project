import { Link } from "react-router-dom"
import CourseCard from "../CourseCard"

const RecommendedCourses = ({ courses, limit = 3, onCourseClick, instructors = [] }) => {
  // Lấy các khóa học được đề xuất (có rating cao)
  const getRecommendedCourses = () => {
    if (!courses || courses.length === 0) return []

    // Sắp xếp theo rating từ cao đến thấp
    const sortedCourses = [...courses].sort((a, b) => (b.rating || 0) - (a.rating || 0))

    // Giới hạn số lượng khóa học hiển thị
    return sortedCourses.slice(0, limit)
  }

  const recommendedCourses = getRecommendedCourses()

  if (recommendedCourses.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Khóa học đề xuất cho bạn</h2>
            <p className="text-gray-600 mt-1">Dựa trên sở thích và lịch sử học tập của bạn</p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              variant="default"
              showBookmark={true}
              onClick={onCourseClick}
              animate={true}
              instructors={instructors} // Truyền danh sách giảng viên
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecommendedCourses