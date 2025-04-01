import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { getAllUsers } from "../../services/userAPI";
import { coursesAPI } from "../../services/courseAPI";
import { getAllPayments } from "../../services/paymentAPI";
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
  const [chartData, setChartData] = useState({
    students: [],
    revenue: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, payments] = await Promise.all([
          getAllUsers(),
          getAllPayments()
        ]);

        // Lọc ra học viên
        const students = users.filter(user => user.role === "Student");

        // Lấy ngày đầu tuần
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Lấy ngày Chủ nhật
        firstDayOfWeek.setHours(0, 0, 0, 0);

        // Tạo mảng 7 ngày trong tuần
        const weekDays = [...Array(7)].map((_, i) => {
          const day = new Date(firstDayOfWeek);
          day.setDate(firstDayOfWeek.getDate() + i);
          return day.toISOString().split('T')[0];
        });

        // Thống kê số học viên đăng ký mới theo ngày
        const studentsByDay = weekDays.map(date => {
          return students.filter(student => 
            new Date(student.createdAt).toISOString().split('T')[0] === date
          ).length;
        });

        // Thống kê doanh thu theo ngày (chỉ tính giao dịch thành công)
        const revenueByDay = weekDays.map(date => {
          const successPayments = payments.filter(payment => 
            new Date(payment.createdAt).toISOString().split('T')[0] === date &&
            payment.status === "success"
          );
          
          return successPayments.reduce((total, payment) => total + payment.amount, 0);
        });

        setChartData({
          students: studentsByDay,
          revenue: revenueByDay
        });

      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu chart:", error);
      }
    };

    fetchData();
  }, []);

  const lineChartData = {
    labels: [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + i); // Bắt đầu từ Chủ nhật
      return d.toLocaleDateString('vi-VN', { weekday: 'short', month: 'numeric', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Học viên đăng ký mới",
        data: chartData.students,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - d.getDay() + i); // Bắt đầu từ Chủ nhật
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
        <h3 className="text-lg font-semibold mb-4">Thống kê học viên đăng ký mới (7 ngày qua)</h3>
        <Line 
          data={lineChartData} 
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 }
              }
            }
          }}
        />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Doanh thu theo ngày (7 ngày qua)</h3>
        <Bar 
          data={barChartData} 
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: value => `${value.toLocaleString()}đ`
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
}

