import { useEffect, useState } from "react";
import { getEnrollments, getStatistics } from '../../services/progressAPI';
import { FaGraduationCap, FaBook, FaUsers } from "react-icons/fa";
import useCourses from '../../hooks/useCourses';
import { useAuth } from '../../context/AuthContext';

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
  const { user } = useAuth();
  const { courses } = useCourses();
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
        
        // Lọc khóa học theo instructor
        const filteredCourses = user.role === "Instructor"
          ? courses.filter(course => course.instructorId === user.userId)
          : courses;

        // Lấy danh sách ghi danh
        const enrollments = await getEnrollments();
        
        // Lọc enrollments theo khóa học của instructor
        const relevantEnrollments = user.role === "Instructor"
          ? enrollments.filter(enrollment => 
              filteredCourses.some(course => course.courseId === enrollment.courseId)
            )
          : enrollments;

        // Đếm số học viên unique
        const uniqueStudents = new Set(relevantEnrollments.map(e => e.userId)).size;

        // Đếm số khóa học
        const totalCourses = filteredCourses.length;

        // Tính tổng số bài học từ các khóa học đã lọc với kiểm tra số
        const totalLessons = filteredCourses.reduce((sum, course) => 
          sum + (course.totalLesson || 0), 0
        );

        // Lấy thống kê
        const statistics = await getStatistics();
        
        setStats({
          totalStudents: uniqueStudents,
          totalCourses: totalCourses,
          totalLessons: totalLessons,
        });
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [courses, user]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {loading ? (
        <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <>
          <StatCard icon={<FaUsers />} title="Tổng số học viên" value={stats.totalStudents} />
          <StatCard icon={<FaBook />} title="Tổng số khóa học" value={stats.totalCourses} />
          <StatCard icon={<FaGraduationCap />} title="Tổng số bài học" value={stats.totalLessons} />
        </>
      )}
    </div>
  );
}