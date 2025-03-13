import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useCourses from "../hooks/useCourses"
import { getUserProgressStats } from "../services/progressAPI"

// Tái sử dụng các component hiện có
import CourseGrid from "../components/CourseGrid"
import CoursePopup from "../components/CoursePopup"
import ProgressStats from "../components/progress/ProgressStats"
import LearningPaths from "../components/progress/LearningPaths"
import CourseFilter from "../components/progress/CourseFilter"

const ProgressPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { courses } = useCourses()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursLearned: 0,
    averageProgress: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // all, inProgress, completed
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  // Lấy thống kê tiến độ học tập
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          setLoading(true)
          const data = await getUserProgressStats(user.id)
          if (data) {
            setStats(data)
          }
        } catch (error) {
          console.error("Lỗi khi lấy thống kê tiến độ:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchStats()
  }, [user])

  // Lọc và tìm kiếm khóa học
  const filteredCourses = courses.filter((course) => {
    // Tìm kiếm theo tên
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())

    // Lọc theo trạng thái
    if (filter === "inProgress") {
      return matchesSearch && course.progress && course.progress > 0 && course.progress < 100
    } else if (filter === "completed") {
      return matchesSearch && course.progress && course.progress >= 100
    } else {
      return matchesSearch && course.progress && course.progress > 0
    }
  })

  // Xử lý khi click vào khóa học
  const handleCourseClick = (course) => {
    // Nếu khóa học đã có tiến độ, chuyển đến trang bài học
    if (course.progress && course.progress > 0) {
      navigate(`/courses/${course.courseId}/lessons`)
    } else {
      // Nếu chưa có tiến độ, hiển thị popup thông tin khóa học
      setSelectedCourse(course)
      setShowPopup(true)
    }
  }

  // Xử lý khi đóng popup
  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedCourse(null)
  }

  // Hiển thị thông báo khi không có khóa học
  const renderEmptyState = () => (
    <div className="bg-white rounded-lg p-8 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Không tìm thấy khóa học</h3>
      <p className="text-gray-600 mb-4">
        {filter === "all"
          ? "Bạn chưa bắt đầu khóa học nào. Hãy khám phá các khóa học của chúng tôi."
          : filter === "inProgress"
            ? "Bạn không có khóa học nào đang học. Hãy bắt đầu một khóa học mới."
            : "Bạn chưa hoàn thành khóa học nào. Hãy tiếp tục học tập để hoàn thành khóa học."}
      </p>
      <button
        onClick={() => navigate("/courses")}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
      >
        Khám phá khóa học
      </button>
    </div>
  )

  if (!user) {
    return null // Sẽ chuyển hướng trong useEffect
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tiến độ học tập của bạn
          </motion.h1>

          {/* Stats Cards */}
          <ProgressStats stats={stats} loading={loading} />

          {/* Learning Paths */}
          <LearningPaths />

          {/* Course List - Sử dụng CourseGrid */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Khóa học của bạn</h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <CourseGrid
                courses={filteredCourses}
                variant="progress"
                onCourseClick={handleCourseClick}
                animate={true}
                emptyState={renderEmptyState()}
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Course Popup */}
      {showPopup && selectedCourse && <CoursePopup course={selectedCourse} onClose={handleClosePopup} />}

      <Footer />
    </div>
  )
}

export default ProgressPage

