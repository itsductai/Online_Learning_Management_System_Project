import { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer"
import useCourses from "../hooks/useCourses"
import useInstructors from "../hooks/useInstructors" // Thêm hook useInstructors
import { getUserProgressStats } from "../services/progressAPI";

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
  const { instructors } = useInstructors() // Lấy danh sách giảng viên
  const [stats, setStats] = useState({
    totalEnrolledCourses: 0, // Số khóa học đã tham gia
    completedCourses: 0, // Số khóa học đã hoàn thành
    totalStudyTime: [0, 0], // Thời gian học [hours, minutes]
    averageProgress: 0, // Tiến độ trung bình (%)
  });
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

    useEffect(() => {
    const fetchStats = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const data = await getUserProgressStats();
          if (data) {
            setStats({
              totalEnrolledCourses: data.totalEnrolledCourses ?? 0,
              completedCourses: data.completedCourses ?? 0,
              totalStudyTime: Array.isArray(data.totalStudyTime) ? data.totalStudyTime : [0, 0],
              averageProgress: data.averageProgress ?? 0,
            });
          }
        } catch (error) {
          console.error("Lỗi khi lấy thống kê tiến độ:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const filteredCourses = getFilteredCourses()

  // Thêm hàm xử lý khi click vào khóa học
  const handleCourseClick = (course) => {
    console.log("Clicked course:", course)
    setSelectedCourse(course)
    if (course.isJoin) {
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
      <NavBar />

      <div className="pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <ProgressHeader user={user} stats={stats} />

          {/* Stats Cards */}
          <ProgressTrackingSection stats={stats} loading={loading} />

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
              <CourseGrid
                courses={filteredCourses}
                variant="progress"
                onCourseClick={handleCourseClick}
                instructors={instructors} // Truyền danh sách giảng viên
              />
            </div>
          </section>

          {/* Learning Paths */}
          <LearningPaths />

          <div className="gap-8 mb-10">
            {/* Calendar & Activity */}
            <ProgressCalendar />
          </div>
        </div>
      </div>

      {/* Course Popup */}
      {showPopup && selectedCourse && (
        <CoursePopup
          course={selectedCourse}
          onClose={handleClosePopup}
          instructors={instructors} // Truyền danh sách giảng viên
        />
      )}

      <Footer />
    </div>
  )
}

export default ProgressPage