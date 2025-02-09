import React from "react";
import { FaBell } from 'react-icons/fa';

export default function Announcements() {
  const announcements = [1, 2, 3];

  return (
    <section className="max-w-7xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Thông báo mới</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement} className="flex items-start">
              <FaBell className="text-accent3 mt-1 mr-3" />
              <div>
                <h3 className="font-semibold">Tiêu đề thông báo {announcement}</h3>
                <p className="text-sm text-gray-600">Nội dung ngắn...</p>
                <span className="text-xs text-gray-500">2 giờ trước</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
