import { useMemo } from "react"
import { Edit, Trash2 } from "lucide-react"

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
  onDeleteClick,
}) => {
  // Calculate course count for each instructor
  const getInstructorCourseCount = (instructorId) => {
    return courses.filter((course) => course.instructorId === instructorId).length
  }

  // Calculate student count for each instructor
  const getInstructorStudentCount = (instructorId) => {
    const instructorCourses = courses.filter((course) => course.instructorId === instructorId)
    return instructorCourses.reduce((total, course) => total + (course.studentCount || 0), 0)
  }

  // Filter and sort instructors
  const filteredInstructors = useMemo(() => {
    if (!instructors) return []

    return instructors
      .filter((instructor) => {
        // Search filter
        const matchesSearch =
          instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          instructor.email.toLowerCase().includes(searchTerm.toLowerCase())

        // Alphabet filter
        const matchesLetter = filterLetter ? instructor.name.charAt(0).toUpperCase() === filterLetter : true

        return matchesSearch && matchesLetter
      })
      .sort((a, b) => {
        let comparison = 0

        if (sortField === "name") {
          comparison = a.name.localeCompare(b.name)
        } else if (sortField === "courses") {
          comparison = getInstructorCourseCount(a.userId) - getInstructorCourseCount(b.userId)
        } else if (sortField === "students") {
          comparison = getInstructorStudentCount(a.userId) - getInstructorStudentCount(b.userId)
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [instructors, searchTerm, filterLetter, sortField, sortDirection, courses])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách giảng viên...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <p>Đã xảy ra lỗi khi tải danh sách giảng viên. Vui lòng thử lại sau.</p>
        </div>
      ) : filteredInstructors.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>Không tìm thấy giảng viên nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.map((instructor) => (
                <tr key={instructor.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={instructor.imageUrl || "/placeholder.svg?height=40&width=40"}
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
                    <div className="text-sm text-gray-900">{getInstructorStudentCount(instructor.userId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onEditClick(instructor)} className="text-blue-600 hover:text-blue-900 mr-3">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDeleteClick(instructor)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
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

