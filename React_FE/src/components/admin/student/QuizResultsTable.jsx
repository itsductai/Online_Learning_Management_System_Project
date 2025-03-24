import { useMemo } from "react"
import { Eye, Trash2 } from "lucide-react"

const QuizResultsTable = ({
  students,
  quizResults,
  loading,
  error,
  searchTerm,
  sortField,
  sortDirection,
  activeFilter,
  onViewClick,
  onDeleteClick,
}) => {
  // Get student quiz results
  const getStudentQuizResults = (studentId) => {
    return quizResults?.filter((result) => result.userId === studentId) || []
  }

  // Calculate average quiz score
  const getAverageQuizScore = (studentId) => {
    const results = getStudentQuizResults(studentId)
    if (results.length === 0) return 0

    const sum = results.reduce((total, result) => total + result.score, 0)
    return (sum / results.length).toFixed(1)
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
          const quizResultsA = getStudentQuizResults(a.userId)
          const quizResultsB = getStudentQuizResults(b.userId)
          comparison = quizResultsA.length - quizResultsB.length
        } else if (sortField === "progress") {
          const scoreA = Number.parseFloat(getAverageQuizScore(a.userId))
          const scoreB = Number.parseFloat(getAverageQuizScore(b.userId))
          comparison = scoreA - scoreB
        }

        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [students, searchTerm, activeFilter, sortField, sortDirection, quizResults])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu kiểm tra...</p>
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
                  Số bài kiểm tra đã làm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm trung bình
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bài kiểm tra gần nhất
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const studentQuizResults = getStudentQuizResults(student.userId)
                const averageScore = getAverageQuizScore(student.userId)
                const latestQuiz =
                  studentQuizResults.length > 0
                    ? studentQuizResults.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0]
                    : null

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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{studentQuizResults.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`text-sm font-medium ${
                            averageScore >= 8
                              ? "text-green-600"
                              : averageScore >= 5
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {averageScore}/10
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {latestQuiz ? (
                        <div>
                          <div className="font-medium">{latestQuiz.quizTitle}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(latestQuiz.submittedAt).toLocaleDateString("vi-VN")}
                          </div>
                          <div
                            className={`text-xs ${
                              latestQuiz.score >= 8
                                ? "text-green-600"
                                : latestQuiz.score >= 5
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            Điểm: {latestQuiz.score}/10
                          </div>
                        </div>
                      ) : (
                        "Chưa có bài kiểm tra"
                      )}
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

export default QuizResultsTable

