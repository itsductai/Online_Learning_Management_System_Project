import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useCourses from "../hooks/useCourses"
import useInstructors from "../hooks/useInstructors" // Thêm hook useInstructors
import CoursePopup from "../components/CoursePopup"

// Import các component
import HeroSection from "../components/home/HeroSection"
import RecentCourses from "../components/home/RecentCourses"
import ProgressTrackingSection from "../components/home/ProgressTrackingSection"
import RecommendedCourses from "../components/home/RecommendedCourses"
import Announcements from "../components/home/Announcements"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
  const { user } = useAuth();
  const { courses, loading, error } = useCourses();
  const { instructors } = useInstructors() // Lấy danh sách giảng viên
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  // Thêm hàm xử lý khi click vào khóa học
  const handleCourseClick = (course) => {
    console.log("Clicked course:", course)
    setSelectedCourse(course)
    if (course.isJoin) {
      navigate(`/courses/${course.courseId}/lessons`)
    } else {
      setShowPopup(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Hero Section - Đã được cải tạo */}
      <HeroSection user={user} />

      {/* Recent Courses Section - Hiển thị khóa học gần đây hoặc nổi bật */}
      <RecentCourses
        courses={courses}
        limit={3}
        onCourseClick={handleCourseClick}
        instructors={instructors} // Truyền danh sách giảng viên
      />

      {/* Recommended Courses Section */}
      <RecommendedCourses
        courses={courses}
        limit={3}
        onCourseClick={handleCourseClick}
        instructors={instructors} // Truyền danh sách giảng viên
      />

      {/* Announcements Section */}
      <Announcements />

      {/* Course Popup */}
      {showPopup && selectedCourse && (
        <CoursePopup
          course={selectedCourse}
          onClose={() => setShowPopup(false)}
          instructors={instructors} // Truyền danh sách giảng viên
        />
      )}

      <Footer />
    </div>
  );
}
