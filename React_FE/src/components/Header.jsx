import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-primary to-accent1 p-4 text-white flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Hệ thống Quản lý Khóa học</h1>
      <div className="flex items-center space-x-4">
        <span>Xin chào, {user?.name}!</span>
        <FaUserCircle size={30} />
      </div>
    </div>
  );
}
