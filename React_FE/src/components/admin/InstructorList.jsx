"use client"
import { Edit, Power } from "lucide-react"

// Giả định component này đã tồn tại, chỉ cập nhật phần liên quan đến nút xóa/vô hiệu hóa
export default function InstructorList({
  instructors,
  courses,
  loading,
  error,
  searchTerm,
  sortField,
  sortDirection,
  filterLetter,
  onEditClick,
  onDisableClick, // Đổi tên từ onDeleteClick thành onDisableClick
}) {
  // Các xử lý lọc, sắp xếp, tìm kiếm...

  return (
    <div className="mt-6 overflow-hidden rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>{/* Các header của bảng */}</tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {/* Mapping qua danh sách giảng viên */}
          {instructors.map((instructor) => (
            <tr key={instructor.id}>
              {/* Các cột dữ liệu */}
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button
                  onClick={() => onEditClick(instructor)}
                  className="mr-2 rounded-full p-2 text-blue-600 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => onDisableClick(instructor)}
                  className="rounded-full p-2 text-red-600 hover:bg-red-100"
                >
                  <Power className="h-4 w-4" />
                  <span className="sr-only">Vô hiệu hóa</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

