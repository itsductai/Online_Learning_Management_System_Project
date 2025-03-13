import { motion } from "framer-motion"
import CourseCard from "./CourseCard"

// Thêm prop emptyState để hiển thị trạng thái trống
const CourseGrid = ({
  courses = [],
  variant = "default",
  onCourseClick,
  showBookmark = false,
  animate = true,
  columns = { default: 3, tablet: 2, mobile: 1 },
  limit,
  emptyState = null,
}) => {
  // Giới hạn số lượng khóa học hiển thị nếu có limit
  const displayCourses = limit ? courses.slice(0, limit) : courses

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  // Xác định số cột dựa trên prop columns
  const getGridCols = () => {
    return `grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.default}`
  }

  // Wrapper component - có thể là motion.div hoặc div thường
  const GridWrapper = animate ? motion.div : "div"
  const wrapperProps = animate
    ? {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
      }
    : {}

  // Nếu không có khóa học và có emptyState, hiển thị emptyState
  if (displayCourses.length === 0 && emptyState) {
    return emptyState
  }

  return (
    <GridWrapper {...wrapperProps} className={`grid ${getGridCols()} gap-6`}>
      {displayCourses.map((course) => (
        <CourseCard
          key={course.courseId}
          course={course}
          variant={variant}
          onClick={onCourseClick}
          showBookmark={showBookmark}
          animate={animate}
        />
      ))}
    </GridWrapper>
  )
}

export default CourseGrid

