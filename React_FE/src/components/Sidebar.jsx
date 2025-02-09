import React from "react";
import { FaHome, FaUsers, FaBook, FaMoneyBill, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-gradient-to-b from-primary to-secondary text-white flex flex-col shadow-lg">
      <div className="p-6 text-2xl font-bold text-center">Admin Dashboard</div>
      <nav className="flex-grow">
        <ul className="space-y-4 p-4">
          <li>
            <Link to="/" className="flex items-center space-x-3 p-3 hover:bg-opacity-80 transition-all">
              <FaHome /> <span>Trang chủ</span>
            </Link>
          </li>
          <li>
            <Link to="/users" className="flex items-center space-x-3 p-3 hover:bg-opacity-80 transition-all">
              <FaUsers /> <span>Quản lý người dùng</span>
            </Link>
          </li>
          <li>
            <Link to="/courses" className="flex items-center space-x-3 p-3 hover:bg-opacity-80 transition-all">
              <FaBook /> <span>Quản lý khóa học</span>
            </Link>
          </li>
          <li>
            <Link to="/payments" className="flex items-center space-x-3 p-3 hover:bg-opacity-80 transition-all">
              <FaMoneyBill /> <span>Quản lý thanh toán</span>
            </Link>
          </li>
          <li>
            <Link to="/settings" className="flex items-center space-x-3 p-3 hover:bg-opacity-80 transition-all">
              <FaCog /> <span>Cài đặt</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
