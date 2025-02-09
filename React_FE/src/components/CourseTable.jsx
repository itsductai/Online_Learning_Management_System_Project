import React from "react";

export default function CourseTable() {
  return (
    <section className="container mx-auto px-6 py-8">
      <h3 className="text-2xl font-bold text-gray-700 mb-4">Danh sách khóa học</h3>
      <div className="bg-white rounded-lg shadow-md p-6">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-gray-500">Tên khóa học</th>
              <th className="px-6 py-3 text-left text-gray-500">Giảng viên</th>
              <th className="px-6 py-3 text-left text-gray-500">Số học viên</th>
              <th className="px-6 py-3 text-left text-gray-500">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr>
              <td className="px-6 py-4">React Fundamentals</td>
              <td className="px-6 py-4">John Doe</td>
              <td className="px-6 py-4">1,234</td>
              <td className="px-6 py-4 text-green-600">Đang hoạt động</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
