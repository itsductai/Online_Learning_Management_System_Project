import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { getEnrollments } from '../../services/progressAPI';
import useCourses from '../../hooks/useCourses';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function Charts() {
  const { user } = useAuth();
  const { courses } = useCourses();
  const [chartData, setChartData] = useState({
    enrollments: [],
    revenue: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách ghi danh
        const enrollments = await getEnrollments();
        
        // Lọc khóa học theo instructor
        const instructorCourses = courses.filter(course => 
          user.role === "Instructor" ? course.instructorId === user.userId : true
        );

        // Lọc enrollments theo khóa học của instructor
        const filteredEnrollments = enrollments.filter(enrollment =>
          instructorCourses.some(course => course.courseId === enrollment.courseId)
        );

        // Xử lý dữ liệu cho biểu đồ
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        }).reverse();

        // Thống kê số học viên đăng ký theo ngày
        const enrollmentsByDay = last7Days.map(date => {
          return filteredEnrollments.filter(e => 
            new Date(e.createdAt).toISOString().split('T')[0] === date
          ).length;
        });

        // Thống kê doanh thu theo ngày
        const revenueByDay = last7Days.map(date => {
          const dayEnrollments = filteredEnrollments.filter(e => 
            new Date(e.createdAt).toISOString().split('T')[0] === date
          );
          
          return dayEnrollments.reduce((total, enrollment) => {
            const course = instructorCourses.find(c => c.courseId === enrollment.courseId);
            return total + (course?.isPaid ? course.price : 0);
          }, 0);
        });

        setChartData({
          enrollments: enrollmentsByDay,
          revenue: revenueByDay
        });

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chart:", error);
      }
    };

    fetchData();
  }, [courses, user]);

  const lineChartData = {
    labels: [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('vi-VN', { weekday: 'short', month: 'numeric', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Học viên đăng ký mới",
        data: chartData.enrollments,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toLocaleDateString('vi-VN', { weekday: 'short', month: 'numeric', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: chartData.revenue,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Thống kê học viên (7 ngày qua)</h3>
        <Line data={lineChartData} options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: { stepSize: 1 }
            }
          }
        }} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Doanh thu theo ngày (7 ngày qua)</h3>
        <Bar data={barChartData} options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: value => `${value.toLocaleString()}đ`
              }
            }
          }
        }} />
      </div>
    </div>
  );
}

