import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CourseGrid from "../components/CourseGrid";
import CoursePopup from "../components/CoursePopup";
import useCourses from "../hooks/useCourses";
import useInstructors from "../hooks/useInstructors"; // Thêm hook useInstructors
import { FaSearch, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"

// Animation variants
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
}

const CoursesPage = () => {
  const { courses, error } = useCourses()
  const { instructors } = useInstructors() // Lấy danh sách giảng viên
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCourses, setFilteredCourses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 9
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

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

  useEffect(() => {
    const filtered = courses.filter((course) => course.title.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredCourses(filtered)
    setCurrentPage(1)
  }, [searchTerm, courses])

  const indexOfLastCourse = currentPage * coursesPerPage
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)


  // Lấy khóa học mới nhất dựa vào createdAt
  const getNewestCourses = (count = 4) => {
    if (!courses || courses.length === 0) return []

    return [...courses]
      .sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
      .slice(0, count)
  }

  // Lấy khóa học đánh giá cao nhất
  const getTopRatedCourses = (count = 5) => {
    if (!courses || courses.length === 0) return []
    return [...courses].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, count)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow bg-gray-100">
        {/* Top-rated Courses Slider */}
        <section className="bg-gradient-to-r from-primary to-secondary py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-8">Khóa học đánh giá cao nhất</h2>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 3,
                },
              }}
            >
              {getTopRatedCourses().map((course) => (
                <SwiperSlide key={course.courseId}>
                  <div
                    className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
                    onClick={() => handleCourseClick(course)}
                  >
                    <img
                      src={course.imageUrl || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 truncate">{course.title}</h3>
                      <div className="flex items-center mb-2">
                        <FaStar className="text-yellow-400 mr-1" />
                        <span>
                          {course.rating || 0} ({course.reviewCount || 0} đánh giá)
                        </span>
                      </div>
                      <button className="bg-primary text-white py-2 px-4 rounded-full text-sm hover:bg-opacity-90 transition">
                        Xem khóa học
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Current Courses and Progress */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Khóa học của bạn</h2>
            <CourseGrid
              courses={courses.slice(0, 3)}
              variant="progress"
              onCourseClick={handleCourseClick}
              instructors={instructors} // Truyền danh sách giảng viên
            />
          </div>
        </section>

        {/* Explore Courses */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Khám phá khóa học</h2>

            <div className="mb-8 flex flex-col md:flex-row justify-between items-center">
              <div className="relative w-full md:w-1/2 mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <CourseGrid
              courses={currentCourses}
              variant="default"
              showBookmark={true}
              onCourseClick={handleCourseClick}
              instructors={instructors} // Truyền danh sách giảng viên
            />

            {filteredCourses.length > coursesPerPage && (
              <div className="mt-8 flex justify-center">
                {Array.from({ length: Math.ceil(filteredCourses.length / coursesPerPage) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => paginate(i + 1)}
                    className={`mx-1 px-4 py-2 rounded ${
                      currentPage === i + 1 ? "bg-primary text-white" : "bg-white text-primary"
                    } hover:bg-opacity-90 transition`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* New Courses */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Khóa học mới</h2>
            <CourseGrid
              courses={getNewestCourses()}
              variant="compact"
              columns={{ default: 4, tablet: 2, mobile: 1 }}
              onCourseClick={handleCourseClick}
              instructors={instructors} // Truyền danh sách giảng viên
            />
          </div>
        </section>

        {/* Student Testimonials */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Học viên nói gì về chúng tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((testimonial) => (
                <motion.div
                  key={testimonial}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={`https://i.pravatar.cc/60?img=${testimonial}`}
                      alt="Student"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-bold">Học viên {testimonial}</h4>
                      <div className="flex text-yellow-400">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">
                    "Khóa học này thực sự đã giúp tôi nâng cao kỹ năng và mở ra nhiều cơ hội mới trong sự nghiệp. Tôi
                    rất hài lòng với chất lượng giảng dạy và nội dung khóa học."
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

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
  )
}

export default CoursesPage

