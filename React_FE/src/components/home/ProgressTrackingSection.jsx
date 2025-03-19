import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserProgressStats } from "../../services/progressAPI";
import { FaChartLine, FaGraduationCap, FaClock, FaTrophy } from "react-icons/fa";

const ProgressTrackingSection = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEnrolledCourses: 0, // Số khóa học đã tham gia
    completedCourses: 0, // Số khóa học đã hoàn thành
    totalStudyTime: [0, 0], // Thời gian học [hours, minutes]
    averageProgress: 0, // Tiến độ trung bình (%)
  });
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  console.log("Khoi tao: ", stats)

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const data = await getUserProgressStats();
          if (data) {
            setStats({
              totalEnrolledCourses: data.totalEnrolledCourses,
              completedCourses: data.completedCourses,
              totalStudyTime: data.totalStudyTime, // Mảng [hours, minutes]
              averageProgress: data.averageProgress,
            });
            console.log("Lay stats: ", stats)
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

  if (!user) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tiến độ học tập của bạn</h2>
            <p className="text-gray-600 mt-1">Theo dõi quá trình học tập và thành tích của bạn</p>
          </div>
          {location.pathname !== "/progress" && (
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
            {/* Khóa học đã tham gia */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <FaGraduationCap className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Khóa học đã tham gia</h3>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">{stats.totalEnrolledCourses}</div>
            </div>

            {/* Khóa học đã hoàn thành */}
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
              <div className="text-3xl font-bold text-gray-800">{stats.completedCourses}</div>
            </div>

            {/* Tổng thời gian học */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <FaClock className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Thời gian học</h3>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {stats.totalStudyTime[0]}h {stats.totalStudyTime[1]}m
              </div>
            </div>

            {/* Tiến độ trung bình */}
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
              <div className="text-3xl font-bold text-gray-800">{Math.round(stats.averageProgress)}%</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgressTrackingSection;
