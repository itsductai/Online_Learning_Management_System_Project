import React from "react";

export default function ProgressTracking() {
  return (
    <section className="max-w-7xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Tiến độ học tập</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between mb-4">
          <span className="text-lg font-semibold">Khóa học đang học</span>
          <span className="text-sm text-gray-500">2/5 hoàn thành</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-accent2 h-2.5 rounded-full" style={{ width: "40%" }}></div>
        </div>
      </div>
    </section>
  );
}
