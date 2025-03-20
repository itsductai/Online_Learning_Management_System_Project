import { Line, Bar } from "react-chartjs-2"
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
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Charts() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const lineChartData = {
    labels: months,
    datasets: [
      {
        label: "Học viên đăng ký mới",
        data: [65, 59, 80, 81, 56, 55, 40, 45, 57, 59, 62, 70],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const barChartData = {
    labels: months,
    datasets: [
      {
        label: "Doanh thu (triệu VNĐ)",
        data: [120, 190, 300, 250, 280, 320, 350, 290, 310, 340, 380, 400],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Thống kê học viên</h3>
        <Line data={lineChartData} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h3>
        <Bar data={barChartData} />
      </div>
    </div>
  )
}

