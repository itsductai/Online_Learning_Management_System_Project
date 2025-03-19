import { useState } from "react"
import { motion } from "framer-motion"
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaCheckCircle } from "react-icons/fa"

const ProgressCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Tạo dữ liệu mẫu cho lịch học tập
  const generateSampleData = () => {
    const today = new Date()
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const activityData = {}

    // Tạo dữ liệu hoạt động ngẫu nhiên cho tháng hiện tại
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)

      // Chỉ tạo dữ liệu cho các ngày trong quá khứ
      if (date <= today) {
        // 70% cơ hội có hoạt động trong ngày
        if (Math.random() < 0.7) {
          activityData[i] = {
            minutes: Math.floor(Math.random() * 120) + 10, // 10-130 phút
            completed: Math.random() < 0.5, // 50% cơ hội hoàn thành bài học
          }
        }
      }
    }

    return activityData
  }

  const activityData = generateSampleData()

  // Lấy tên tháng và năm hiện tại
  const monthName = currentMonth.toLocaleString("vi-VN", { month: "long" })
  const year = currentMonth.getFullYear()

  // Chuyển đến tháng trước
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  // Chuyển đến tháng sau
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Tạo lưới lịch
  const renderCalendarGrid = () => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

    // Tên các ngày trong tuần
    const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

    // Tạo mảng các ô lịch
    const calendarCells = []

    // Thêm header cho các ngày trong tuần
    weekdays.forEach((day) => {
      calendarCells.push(
        <div key={`header-${day}`} className="text-center font-medium text-gray-500 text-sm py-2">
          {day}
        </div>,
      )
    })

    // Thêm ô trống cho các ngày trước ngày đầu tiên của tháng
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Thêm các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth.getMonth() &&
        new Date().getFullYear() === currentMonth.getFullYear()

      const hasActivity = activityData[day]

      calendarCells.push(
        <div key={`day-${day}`} className={`p-1 relative ${isToday ? "bg-primary bg-opacity-10 rounded-lg" : ""}`}>
          <div className="text-center">
            <span
              className={`inline-block w-7 h-7 rounded-full text-sm leading-7 
              ${isToday ? "bg-primary text-white" : "text-gray-700"}`}
            >
              {day}
            </span>
          </div>

          {hasActivity && (
            <div className="mt-1 flex justify-center">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center
                  ${hasActivity.completed ? "bg-green-500" : "bg-blue-500"}`}
                title={`${hasActivity.minutes} phút học${hasActivity.completed ? ", hoàn thành bài học" : ""}`}
              >
                {hasActivity.completed && <FaCheckCircle className="text-white text-xs" />}
              </div>
            </div>
          )}
        </div>,
      )
    }

    return calendarCells
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <FaCalendarAlt className="mr-2 text-primary" /> Lịch học tập
          </h2>

          <div className="flex items-center space-x-4">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
              <FaChevronLeft className="text-gray-600" />
            </button>

            <span className="font-medium">
              {monthName} {year}
            </span>

            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100 transition">
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">{renderCalendarGrid()}</div>

        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span>Học tập</span>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span>Hoàn thành bài học</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ProgressCalendar

