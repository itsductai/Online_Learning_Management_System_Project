import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaUsers, FaComments, FaChartLine, FaCog, FaSignOutAlt, FaBars, FaCreditCard, FaTag, FaRobot } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import logo from "../../logo/logo_white_v2.png";

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { path: "/dashboard", icon: <FaHome size={20} />, label: "Tổng quan" },
    { path: "/admin/courses", icon: <FaBook size={20} />, label: "Quản lý khóa học" },
    { path: "/admin/instructors", icon: <FaUsers size={20} />, label: "Quản lý giảng viên" },
    { path: "/admin/students", icon: <FaUsers size={20} />, label: "Quản lý học viên" },
    { path: "/admin/payments", icon: <FaCreditCard size={20} />, label: "Quản lý thanh toán" }, // Thêm mục quản lý thanh toán
    { path: "/admin/coupons", icon: <FaTag size={20} />, label: "Quản lý mã giảm giá" }, // Thêm mục quản lý mã giảm giá
    { path: "/admin/community", icon: <FaComments size={20} />, label: "Chat cộng đồng" },
    { path: "/admin/analytics", icon: <FaChartLine size={20} />, label: "Thống kê" },
    { path: "/admin/settings", icon: <FaCog size={20} />, label: "Cài đặt" },

    { path: "/admin/ai-manager", icon: <FaRobot size={20} />, label: "AI Text-to-SQL" },

  ];

  return (
    <div className={`fixed bg-gradient-to-b from-primary to-secondary h-full min-h-screen transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-16 md:w-64"}`} >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-20 px-4 border-b border-white/10">
          {isSidebarOpen && <img src={logo || "/placeholder.svg"} alt="Logo" className="w-32" />}
          <button onClick={toggleSidebar} className="text-white lg:hidden">
            <FaBars size={24} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path ? "bg-white/20 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              {item.icon}
              <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden md:block"}`}>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-white/10">
          <button onClick={logout} className="flex items-center p-3 w-full text-left text-red-600 hover:bg-white/10 hover:text-red-500 rounded-lg transition-colors">
            <FaSignOutAlt size={20} />
            <span className={`ml-3 ${isSidebarOpen ? "block" : "hidden md:block"}`}>Đăng xuất</span>
          </button>
        </div>
      </div>
    </div>
  );
}