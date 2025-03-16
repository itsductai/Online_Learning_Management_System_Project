import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaExclamationTriangle } from "react-icons/fa"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import useStudentLessons from "../hooks/useStudentLessons"
import useCourses from "../hooks/useCourses"
import useProgress from "../hooks/useProgress"
import { useAuth } from "../context/AuthContext"
import ChatAIWidget from "../components/ChatAIWidget"

// Import các component con
import CourseHeader from "../components/course-lesson/CourseHeader"
import LessonList from "../components/course-lesson/LessonList"
import LessonContent from "../components/course-lesson/LessonContent"

export default function CourseLesson() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const { courses } = useCourses()
  const { user } = useAuth()
  const currentCourse = courses.find((c) => c.courseId === Number(courseId))
 
  // Sử dụng custom hooks
  // Lấy danh sách bài học
  const { lessons, loading, error: lessonError, selectedLesson, setSelectedLesson } = useStudentLessons(courseId)


  // Lấy các hàm định nghĩa để quản lý tiến trình
  const {
    progress, // Truyền trạng thái mặc định của tiến trình (được khởi tạo từ init ở hook)
    watchTime, // Truyền thời gian xem của trạng thái watch
    lessonUnlocked, // Truyền các giá trị đã được unlock khởi tạo
    error: progressError, // Truyền lỗi
    isLessonLocked, // Truyền hàm kiểm tra có mở khóa chưa
    saveProgress, // Truyền hàm xử lý khi có tiến trình pphát sinh
    trackWatchTime, // Truyền bộ đếm theo dõi thời gian xem bài
    resetWatchTime, // Truyền hàm reset thời gian khi chuyển bài học
    initLessonUnlocked, // Truyền hàm khởi tạo
    completedLessons, // Lấy danh sách bài học đã hoàn thành từ api
  } = useProgress(courseId) // truyền props

  // Khởi tạo trạng thái mở khóa bài học khi danh sách bài học thay đổi
  useEffect(() => {
    if (lessons.length > 0) {
      console.log("--- Cập nhật trạng thái mở khóa bài học:", completedLessons, lessons);
      // Khởi tạo trạng thái mở khóa
      initLessonUnlocked(completedLessons, lessons);
      
      // Nếu chưa có bài học nào được chọn, chọn bài đầu tiên
      if (!selectedLesson) {
        setSelectedLesson(lessons[0]);
      }
    }
  }, [lessons, completedLessons, initLessonUnlocked, selectedLesson, setSelectedLesson]);

  useEffect(() => {
    if (lessons.length > 0) {
      saveProgress(null, lessons);
      console.log("Dang trong effect save Progress")
    }
  }, [lessons]);

  // Xử lý khi chọn bài học
  const handleLessonSelect = (lesson) => {
    // Kiểm tra xem bài học có bị khóa không
    if (isLessonLocked(lesson.lessonId)) {
      alert("Bạn cần hoàn thành bài học trước để mở khóa bài này!")
      return
    }

    // Reset thời gian xem khi chuyển bài học
    resetWatchTime()
    setSelectedLesson(lesson)
  }

  // Xử lý khi hoàn thành bài học
  const handleLessonComplete = (lessonId) => {
    saveProgress(lessonId, lessons)
  }

  // Xử lý trường hợp không có khóa học
  if (!currentCourse) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy khóa học</h2>
            <p className="text-gray-600 mb-6">Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Quay lại trang khóa học
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Xử lý trường hợp đang tải
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải nội dung khóa học...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Xử lý trường hợp lỗi
  if (lessonError) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đã xảy ra lỗi</h2>
            <p className="text-gray-600 mb-6">{lessonError}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Xử lý trường hợp không có bài học
  if (lessons.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <CourseHeader course={currentCourse} progress={progress} error={progressError} />

          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Chưa có bài học</h2>
            <p className="text-gray-600 mb-6">Khóa học này hiện chưa có bài học nào. Vui lòng quay lại sau.</p>
            <button
              onClick={() => navigate("/courses")}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              Quay lại trang khóa học
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Course Info & Progress */}
        <CourseHeader course={currentCourse} progress={progress} error={progressError} />

        <div className="grid grid-cols-12 gap-6">
          {/* Lessons List */}
          <div className="col-span-12 lg:col-span-4">
            <LessonList
              lessons={lessons} // Truyền vào danh sách bài hcoj
              selectedLesson={selectedLesson} // Truyền vào bài học đang chọn
              lessonUnlocked={lessonUnlocked} // Truyền danh sách bài hcoj đã mở khóa
              onSelectLesson={handleLessonSelect} // Truyền hàm khởi tạo khi chọn 1 bài học (xử lsy ở phía trên)
            />
          </div>

          {/* Lesson Content */}
          <div className="col-span-12 lg:col-span-8">
            <LessonContent
              lesson={selectedLesson} // Truyền vào giá trị lesson đang được chọn
              watchTime={watchTime} // Truyền vào thời gian bắt đầu xem (mặc định là 0)
              onWatchTimeUpdate={trackWatchTime} // Truyền hàm cập nhật thời gian xem
              onLessonComplete={handleLessonComplete} // Truyền hàm khi hoàn thành 1 bài học (nói trắng ra là truyền saveprogress(lessonId, lessonlesson))
            />
          </div>
        </div>
      </div>

      {/* Chat AI Widget */}
      <ChatAIWidget courseId={courseId} lessonId={selectedLesson?.lessonId} />
      <Footer />
    </div>
  )
}

