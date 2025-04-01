import { useMemo } from "react"
import { Edit, Power } from "lucide-react"
import { disableInstructorAPI } from "../../../services/instructorAPI"

const InstructorList = ({
  instructors,
  courses,
  loading,
  error,
  searchTerm,
  sortField,
  sortDirection,
  filterLetter,
  onEditClick,
  onToggleStatus,
}) => {
  // Tính số khóa học của mỗi giảng viên
  const getInstructorCourseCount = (instructorId) => {
    return courses.filter((course) => course.instructorId === instructorId).length
  }

  // Lọc và sắp xếp danh sách giảng viên
  const filteredInstructors = useMemo(() => {
    if (!instructors) return []

    return instructors
      .filter((instructor) => {
        // Lọc theo từ khóa tìm kiếm
        const matchesSearch =
          instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.email.toLowerCase().includes(searchTerm.toLowerCase())

        // Lọc theo chữ cái đầu
        const matchesLetter = filterLetter ? instructor.name.charAt(0).toUpperCase() === filterLetter : true

        return matchesSearch && matchesLetter
      })
      .sort((a, b) => {
        let comparison = 0

        // Sắp xếp theo trường được chọn
        switch (sortField) {
          case "name":
            comparison = a.name.localeCompare(b.name)
            break
          case "courses":
            comparison = getInstructorCourseCount(a.userId) - getInstructorCourseCount(b.userId)
            break
          case "students":
            comparison = a.totalStudents - b.totalStudents // Sử dụng trực tiếp totalStudents
            break
          default:
            comparison = 0
        }

        // Đảo ngược thứ tự nếu sắp xếp giảm dần
        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [instructors, searchTerm, filterLetter, sortField, sortDirection, courses])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading ? (
        // Hiển thị trạng thái đang tải
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách giảng viên...</p>
        </div>
      ) : error ? (
        // Hiển thị thông báo lỗi
        <div className="p-8 text-center text-red-500">
          <p>Đã xảy ra lỗi khi tải danh sách giảng viên. Vui lòng thử lại sau.</p>
        </div>
      ) : filteredInstructors.length === 0 ? (
        // Hiển thị khi không có kết quả
        <div className="p-8 text-center text-gray-500">
          <p>Không tìm thấy giảng viên nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        // Hiển thị bảng danh sách giảng viên
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giảng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyên môn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.map((instructor) => (
                <tr 
                  key={instructor.userId} 
                  className={`hover:bg-gray-50 ${!instructor.isActive ? 'opacity-60' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={instructor.avatarUrl || "/placeholder.svg?height=40&width=40"}
                          alt={instructor.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{instructor.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{instructor.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{instructor.specialization || "Chưa cập nhật"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getInstructorCourseCount(instructor.userId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.totalStudents}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${instructor.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {instructor.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => onEditClick(instructor)} 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => onToggleStatus(instructor)}
                      className={`${
                        instructor.isActive 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      } transition-colors duration-200`}
                      title={instructor.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    >
                      <Power className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default InstructorList