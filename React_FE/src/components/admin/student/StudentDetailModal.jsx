import { X, BookOpen, Clock, Award } from "lucide-react"
import { motion } from "framer-motion"

const StudentDetailModal = ({ student, progressStats, quizResults, onClose }) => {
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("vi-VN")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Chi tiết học viên</h2>

        {/* Student Info */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={student.imageUrl || "/placeholder.svg?height=96&width=96"}
              alt={student.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">{student.name}</h3>
            <p className="text-gray-600 mb-2">{student.email}</p>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  student.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {student.isActive ? "Đang hoạt động" : "Không hoạt động"}
              </span>
              <span className="text-sm text-gray-500">Tham gia từ: {formatDate(student.createdAt)}</span>
            </div>
            <p className="text-sm text-gray-500">Đăng nhập gần nhất: {formatDate(student.lastLogin)}</p>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Thống kê học tập</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium">Khóa học</h4>
              </div>
              <div className="flex justify-between">
                <span>Đã đăng ký:</span>
                <span className="font-semibold">{progressStats?.totalCourses || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Đã hoàn thành:</span>
                <span className="font-semibold">{progressStats?.completedCourses || 0}</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <h4 className="font-medium">Thời gian học</h4>
              </div>
              <div className="flex justify-between">
                <span>Tổng thời gian:</span>
                <span className="font-semibold">{progressStats?.totalHoursLearned?.toFixed(1) || 0} giờ</span>
              </div>
              <div className="flex justify-between">
                <span>Tiến độ trung bình:</span>
                <span className="font-semibold">{Math.round(progressStats?.averageProgress || 0)}%</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium">Kiểm tra</h4>
              </div>
              <div className="flex justify-between">
                <span>Số bài đã làm:</span>
                <span className="font-semibold">{quizResults?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Điểm trung bình:</span>
                <span className="font-semibold">
                  {quizResults?.length
                    ? (quizResults.reduce((sum, quiz) => sum + quiz.score, 0) / quizResults.length).toFixed(1)
                    : 0}
                  /10
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Results */}
        {quizResults?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Kết quả kiểm tra gần đây</h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bài kiểm tra</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Khóa học</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày làm</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {quizResults
                    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
                    .slice(0, 5)
                    .map((quiz, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{quiz.quizTitle}</td>
                        <td className="px-4 py-3 text-sm">{quiz.courseName}</td>
                        <td className="px-4 py-3 text-sm">{formatDate(quiz.submittedAt)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              quiz.score >= 8
                                ? "bg-green-100 text-green-800"
                                : quiz.score >= 5
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {quiz.score}/10
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentDetailModal

