import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBook, FaUsers, FaCog } from 'react-icons/fa';

export default function AdminSidebar({ isSidebarOpen }) {
  return (
    <div className={`bg-gradient-to-b from-primary to-secondary text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
      <h2 className="text-2xl font-semibold text-center mb-5">Admin Dashboard</h2>
      <nav>
        <Link to="/admin" className="block py-2.5 px-4 rounded transition hover:bg-white hover:text-primary">
          <FaHome className="inline-block mr-2" /> Dashboard
        </Link>
        <Link to="/admin/courses" className="block py-2.5 px-4 rounded transition hover:bg-white hover:text-primary">
          <FaBook className="inline-block mr-2" /> Khóa học
        </Link>
        <Link to="/admin/students" className="block py-2.5 px-4 rounded transition hover:bg-white hover:text-primary">
          <FaUsers className="inline-block mr-2" /> Học viên
        </Link>
        <Link to="/admin/settings" className="block py-2.5 px-4 rounded transition hover:bg-white hover:text-primary">
          <FaCog className="inline-block mr-2" /> Cài đặt
        </Link>
      </nav>
    </div>
  );
}
