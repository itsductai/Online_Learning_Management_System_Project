import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useCourses from "../hooks/useCourses"
import { getUserProgressStats } from "../services/progressAPI"

// Components
import CoursePopup from "../components/CoursePopup"
import ProgressHeader from "../components/progress/ProgressHeader"
import ProgressTrackingSection from "../components/home/ProgressTrackingSection"
import LearningPaths from "../components/progress/LearningPaths"
import ProgressCalendar from "../components/progress/ProgressCalendar"
import CourseFilter from "../components/progress/CourseFilter"
import CourseGrid from "../components/CourseGrid";

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
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all") // all, inProgress, completed
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  

  // Chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  // Lấy thống kê tiến độ học tập - chỉ fetch một lần
  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id && !dataFetched) {
        try {
          setLoading(true)
          const data = await getUserProgressStats()
          if (data) {
            setStats(data)
            setDataFetched(true)
          }
        } catch (error) {
          console.error("Lỗi khi lấy thống kê tiến độ:", error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchStats()
  }, [user, dataFetched])

  // Lọc và tìm kiếm khóa học
  const getFilteredCourses = useCallback(() => {
    return courses.filter((course) => {
      // Tìm kiếm theo tên
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase())

      // Lọc theo trạng thái
      if (filter === "inProgress") {
        return matchesSearch && course.isJoin && !course.isComplete
      } else if (filter === "completed") {
        return matchesSearch && course.isComplete
      } else {
        return matchesSearch && course.isJoin
      }
    })
  }, [courses, searchTerm, filter])

  const filteredCourses = getFilteredCourses()

  // Thêm hàm xử lý khi click vào khóa học
  const handleCourseClick = (course) => {
    console.log("Clicked course:", course)
    setSelectedCourse(course)
    if(course.isJoin) {
      navigate(`/courses/${course.courseId}/lessons`);
    } else {
      setShowPopup(true)
    }
  }

  // Xử lý khi đóng popup
  const handleClosePopup = () => {
    setShowPopup(false)
    setSelectedCourse(null)
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <ProgressHeader user={user} stats={stats} />

          {/* Stats Cards */}
          {<ProgressTrackingSection />}

          {/* Learning Paths */}
          <LearningPaths />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Calendar & Activity */}
            <div className="lg:col-span-2">
              <ProgressCalendar />
            </div>
          </div>

          {/* Course Filter */}
          <CourseFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            setFilter={setFilter}
            totalCourses={filteredCourses.length}
          />

          {/* Current Courses and Progress */}
          <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <CourseGrid courses={courses.slice(0, 3)} variant="progress" onCourseClick={handleCourseClick} />
            </div>
          </section>
        </div>
      </div>

      {/* Course Popup */}
      {showPopup && selectedCourse && <CoursePopup course={selectedCourse} onClose={handleClosePopup} />}

      <Footer />
    </div>
  )
}

export default ProgressPage

