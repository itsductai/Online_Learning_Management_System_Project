import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { getUserProgressStats } from "../../services/progressAPI"
import { FaChartLine, FaGraduationCap, FaClock, FaTrophy } from "react-icons/fa"

const ProgressTrackingSection = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    totalHoursLearned: 0,
    averageProgress: 0,
  })
  const [loading, setLoading] = useState(true)
  const location = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          setLoading(true)
          const data = await getUserProgressStats(user.id)
          if (data) {
            setStats(data)
          }
        } catch (error) {
          console.error("Lỗi khi lấy thống kê tiến độ:", error)
        } finally {
          setLoading(false)
        }
      } else {
        // Nếu chưa đăng nhập, hiển thị dữ liệu mẫu
        setStats({
          totalCourses: 0,
          completedCourses: 0,
          inProgressCourses: 0,
          totalHoursLearned: 0,
          averageProgress: 0,
        })
        setLoading(false)
      }
    }

    fetchStats()
  }, [user])

  if (!user) {
    return null // Không hiển thị nếu chưa đăng nhập
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tiến độ học tập của bạn</h2>
            <p className="text-gray-600 mt-1">Theo dõi quá trình học tập và thành tích của bạn</p>
          </div>
            {location.pathname !== "/progress" && ( // Kiểm tra nếu không phải trang /progress thì hiển thị
              <Link
                to="/progress"
                className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
              >
                Xem chi tiết
              </Link>
            )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
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
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
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
                  {stats.totalCourses > 0
                    ? `${Math.round((stats.completedCourses / stats.totalCourses) * 100)}%`
                    : "0%"}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
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
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
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
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProgressTrackingSection

