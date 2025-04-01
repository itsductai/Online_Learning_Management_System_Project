import { useEffect, useState } from "react";
import { getUserProgressStats } from "../../services/progressAPI";
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaUsers } from "react-icons/fa";

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 hover:transform hover:scale-105">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold mt-2">{value}</h3>
      </div>
      <div className="text-primary opacity-80 text-3xl">{icon}</div>
    </div>
  </div>
);

export default function StatsOverview() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    totalLessons: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getUserProgressStats();
        if (data) {
          setStats({
            totalStudents: data.totalStudents,
            totalCourses: data.totalCourses,
            totalLessons: data.totalLessons,
          });
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <>
          <StatCard icon={<FaUsers />} title="Tổng số học viên" value={stats.totalStudents} />
          <StatCard icon={<FaBook />} title="Tổng số khóa học" value={stats.totalCourses} />
          <StatCard icon={<FaChalkboardTeacher />} title="Tổng số bài học" value={stats.totalLessons} />
        </>
      )}
    </div>
  );
}
