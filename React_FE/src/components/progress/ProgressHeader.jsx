"use client"

import { motion } from "framer-motion"
import { FaGraduationCap } from "react-icons/fa"

const ProgressHeader = ({ user, stats }) => {
  // Tính toán cấp độ người dùng dựa trên số khóa học đã hoàn thành
  const getUserLevel = () => {
    const completedCourses = stats.completedCourses || 0

    if (completedCourses >= 10) return { level: "Chuyên gia", color: "text-purple-600" }
    if (completedCourses >= 5) return { level: "Cao cấp", color: "text-blue-600" }
    if (completedCourses >= 3) return { level: "Trung cấp", color: "text-green-600" }
    return { level: "Người mới", color: "text-orange-600" }
  }

  const userLevel = getUserLevel()

  return (
    <motion.div
      className="bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg p-8 mb-10 text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative">
            <img
              src={user?.avatarUrl || "/placeholder.svg?height=80&width=80"}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-md"
            />
            <div className="absolute -bottom-2 -right-2 bg-white text-primary rounded-full p-1 shadow-md">
              <FaGraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="ml-5">
            <h1 className="text-3xl font-bold">Xin chào, {user.name}</h1>
            <div className="flex items-center mt-1">
              <span className="text-white text-opacity-90">Cấp độ: </span>
              <span className={`ml-2 font-semibold bg-white ${userLevel.color} px-2 py-0.5 rounded-full text-sm`}>
                {userLevel.level}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
          <div className="text-center">
            <p className="text-white text-opacity-90 mb-1">Mục tiêu học tập</p>
            <div className="flex items-center justify-center gap-2">
              <div className="text-2xl font-bold">{stats.completedCourses}</div>
              <div className="text-white text-opacity-80 text-sm">/</div>
              <div className="text-white text-opacity-80">{stats.totalCourses} khóa học</div>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{
                  width: `${stats.totalCourses > 0 ? (stats.completedCourses / stats.totalCourses) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProgressHeader

