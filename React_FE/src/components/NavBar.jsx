import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBook, FaChalkboardTeacher, FaUserGraduate, FaBell, FaSignOutAlt, FaHome } from 'react-icons/fa';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-primary to-secondary p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">📚 EduOnline</Link>

        {/* Menu điều hướng */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white flex items-center space-x-2 hover:underline">
            <FaHome /> <span>Trang chủ</span>
          </Link>
          <Link to="/courses" className="text-white flex items-center space-x-2 hover:underline">
            <FaBook /> <span>Khóa học</span>
          </Link>
          <Link to="/progress" className="text-white flex items-center space-x-2 hover:underline">
            <FaChalkboardTeacher /> <span>Tiến độ</span>
          </Link>
          <Link to="/notifications" className="text-white flex items-center space-x-2 hover:underline">
            <FaBell /> <span>Thông báo</span>
          </Link>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          <span className="text-white">👋 Xin chào, {user?.name}</span>
          <button onClick={logout} className="bg-accent3 text-white px-4 py-2 rounded-md text-sm flex items-center transition hover:bg-opacity-90">
            <FaSignOutAlt className="mr-2" /> Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
}
