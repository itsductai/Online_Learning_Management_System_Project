import { useMemo } from "react"
import { Eye, Trash2 } from "lucide-react"

const ProgressTable = ({
  students,
  progressStats,
  loading,
  error,
  searchTerm,
  sortField,
  sortDirection,
  activeFilter,
  onViewClick,
  onDeleteClick,
}) => {
  // Get student progress data
  const getStudentProgress = (studentId) => {
    return (
    //   progressStats?.find((stat) => stat.userId === studentId) ||
       {
        totalCourses: 0,
        completedCourses: 0,
        averageProgress: 0,
        totalHoursLearned: 0,
      }
    )
  }

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    if (!students) return []

    return students
      .filter((student) => {
        // Search filter
        const matchesSearch =
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())

        // Active/Inactive filter
        const matchesActive =
          activeFilter === "all" ? true : activeFilter === "active" ? student.isActive : !student.isActive

        return matchesSearch && matchesActive
      })
      .sort((a, b) => {
        let comparison = 0

        if (sortField === "name") {
          comparison = a.name.localeCompare(b.name)
        } else if (sortField === "courses") {
          const progressA = getStudentProgress(a.userId)
          const progressB = getStudentProgress(b.userId)
          comparison = (progressA.totalCourses || 0) - (progressB.totalCourses || 0)
        } else if (sortField === "progress") {
          const progressA = getStudentProgress(a.userId)
          const progressB = getStudentProgress(b.userId)
          comparison = (progressA.averageProgress || 0) - (progressB.averageProgress || 0)
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [students, searchTerm, activeFilter, sortField, sortDirection, progressStats])

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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian học
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const progress = getStudentProgress(student.userId)
                return (
                  <tr key={student.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={student.imageUrl || "/placeholder.svg?height=40&width=40"}
                            alt={student.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{progress.totalCourses || 0}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {progress.completedCourses || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2 max-w-[100px]">
                          <div
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${progress.averageProgress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{Math.round(progress.averageProgress || 0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {progress.totalHoursLearned ? `${progress.totalHoursLearned.toFixed(1)} giờ` : "0 giờ"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => onViewClick(student)} className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button onClick={() => onDeleteClick(student)} className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-5 h-5" />
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

