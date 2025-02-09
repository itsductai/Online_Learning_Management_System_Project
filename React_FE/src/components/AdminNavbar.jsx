import React from "react";
import { FaSignOutAlt, FaBars } from 'react-icons/fa';

export default function AdminNavbar({ user, toggleSidebar, logout }) {
  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={toggleSidebar} className="text-gray-500 md:hidden">
          <FaBars />
        </button>
        <div className="flex items-center">
          <span className="text-gray-700 text-sm mr-4">Xin chào, {user?.name}</span>
          <button onClick={logout} className="bg-accent3 text-white px-4 py-2 rounded-md text-sm flex items-center transition hover:bg-opacity-90">
            <FaSignOutAlt className="mr-2" /> Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
