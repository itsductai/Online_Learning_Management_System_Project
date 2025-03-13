import { motion } from "framer-motion"
import { FaChartLine, FaGraduationCap, FaClock, FaTrophy } from "react-icons/fa"

const ProgressStats = ({ stats, loading }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="bg-white rounded-xl shadow-md p-6" variants={itemVariants}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <FaGraduationCap className="text-blue-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Khóa học</h3>
            <p className="text-gray-500 text-sm">Đang học</p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-3xl font-bold text-gray-800">{stats.inProgressCourses}</div>
          <div className="text-sm text-gray-500">Tổng: {stats.totalCourses}</div>
        </div>
      </motion.div>

      <motion.div className="bg-white rounded-xl shadow-md p-6" variants={itemVariants}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <FaTrophy className="text-green-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Hoàn thành</h3>
            <p className="text-gray-500 text-sm">Khóa học đã hoàn thành</p>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div className="text-3xl font-bold text-gray-800">{stats.completedCourses}</div>
          <div className="text-sm text-gray-500">
            {stats.totalCourses > 0 ? `${Math.round((stats.completedCourses / stats.totalCourses) * 100)}%` : "0%"}
          </div>
        </div>
      </motion.div>

      <motion.div className="bg-white rounded-xl shadow-md p-6" variants={itemVariants}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <FaClock className="text-purple-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Thời gian học</h3>
            <p className="text-gray-500 text-sm">Tổng số giờ đã học</p>
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-800">{stats.totalHoursLearned} giờ</div>
      </motion.div>

      <motion.div className="bg-white rounded-xl shadow-md p-6" variants={itemVariants}>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
            <FaChartLine className="text-orange-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Tiến độ</h3>
            <p className="text-gray-500 text-sm">Tiến độ trung bình</p>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-3xl font-bold text-gray-800">{Math.round(stats.averageProgress)}%</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${stats.averageProgress}%` }}></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProgressStats

