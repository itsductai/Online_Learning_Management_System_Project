import React, { useState } from 'react';
import { FaUserCircle, FaBan, FaCheck } from 'react-icons/fa';

export default function StudentManagement() {
  const [students] = useState([
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@example.com',
      enrolledCourses: 3,
      progress: 75,
      status: 'active',
      joinDate: '2024-01-15',
    },
    // Add more students...
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md mb-8">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Quản lý học viên</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Học viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khóa học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiến độ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tham gia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <FaUserCircle className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{student.enrolledCourses}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${student.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{student.progress}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {student.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(student.joinDate).toLocaleDateString('vi-VN')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    className={`${
                      student.status === 'active'
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'
                    }`}
                  >
                    {student.status === 'active' ? <FaBan /> : <FaCheck />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}