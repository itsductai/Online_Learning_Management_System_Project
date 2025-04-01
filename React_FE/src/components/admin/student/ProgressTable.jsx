import { useMemo } from "react"
import { Power } from "lucide-react"

const ProgressTable = ({
  students,
  loading,
  error,
  searchTerm,
  sortField,
  sortDirection,
  activeFilter,
  onToggleStatus,
}) => {
  // Filter and sort students
  const filteredStudents = useMemo(() => {
    if (!students || !Array.isArray(students)) return []

    return students
      .filter((student) => {
        // Search filter
        const matchesSearch =
          student.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())

        // Active/Inactive filter
        const matchesActive =
          activeFilter === "all" ? true : activeFilter === "active" ? student.isActive : !student.isActive

        return matchesSearch && matchesActive
      })
      .sort((a, b) => {
        let comparison = 0

        if (sortField === "name") {
          comparison = a.userName.localeCompare(b.userName)
        } else if (sortField === "courses") {
          comparison = (a.enrollments?.length || 0) - (b.enrollments?.length || 0)
        } else if (sortField === "progress") {
          const progressA = a.enrollments?.reduce((acc, curr) => acc + curr.progressPercent, 0) / (a.enrollments?.length || 1)
          const progressB = b.enrollments?.reduce((acc, curr) => acc + curr.progressPercent, 0) / (b.enrollments?.length || 1)
          comparison = progressA - progressB
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [students, searchTerm, activeFilter, sortField, sortDirection])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu học viên...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>Không tìm thấy học viên nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học đã đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học đã hoàn thành
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiến độ trung bình
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const totalCourses = student.enrollments?.length || 0
                const completedCourses = student.enrollments?.filter(e => e.isCompleted).length || 0
                const averageProgress = totalCourses > 0 
                  ? student.enrollments.reduce((acc, curr) => acc + curr.progressPercent, 0) / totalCourses 
                  : 0

                return (
                  <tr key={student.userId} className={`hover:bg-gray-50 ${!student.isActive ? "opacity-50" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.userName}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {student.isActive ? "Đang hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{totalCourses}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {completedCourses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${averageProgress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{Math.round(averageProgress)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onToggleStatus(student)}
                        className={`p-1 rounded-full hover:bg-gray-100 ${
                          student.isActive ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"
                        }`}
                        title={student.isActive ? "Vô hiệu hóa học viên" : "Kích hoạt học viên"}
                      >
                        <Power className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ProgressTable

