import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/admin/Sidebar"
import StudentHeader from "../../components/admin/student/StudentHeader"
import StudentFilter from "../../components/admin/student/StudentFilter"
import StudentTabs from "../../components/admin/student/StudentTabs"
import ProgressTable from "../../components/admin/student/ProgressTable"
import QuizResultsTable from "../../components/admin/student/QuizResultsTable"
import DeleteConfirmModal from "../../components/admin/shared/DeleteConfirmModal"
import StudentDetailModal from "../../components/admin/student/StudentDetailModal"
import useStudents from "../../hooks/useStudents"
import { deleteStudentAPI } from "../../services/studentAPI"
import { motion, AnimatePresence } from "framer-motion"

export default function StudentManagement() {
  const navigate = useNavigate()
  const { students, quizResults, progressStats, loading, error } = useStudents()

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [activeFilter, setActiveFilter] = useState("all") // all, active, inactive
  const [activeTab, setActiveTab] = useState("progress") // progress, quiz
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Handle deleting a student
  const handleDeleteStudent = async () => {
    try {
      await deleteStudentAPI(selectedStudent.userId)

      // Close modal
      setIsDeleteOpen(false)

      // Reload page to refresh student list
      window.location.reload()
    } catch (error) {
      console.error("Lỗi khi xóa học viên:", error)
      alert("Không thể xóa học viên. Vui lòng thử lại sau.")
    }
  }

  // Open delete modal
  const openDeleteModal = (student) => {
    setSelectedStudent(student)
    setIsDeleteOpen(true)
  }

  // View student details
  const openStudentDetail = (student) => {
    setSelectedStudent(student)
    setIsDetailOpen(true)
  }

  // Toggle sort direction
  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          {/* Header */}
          <StudentHeader />

          {/* Search and Filter */}
          <StudentFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />

          {/* Tabs */}
          <StudentTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === "progress" ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressTable
                  students={students}
                  progressStats={progressStats}
                  loading={loading}
                  error={error}
                  searchTerm={searchTerm}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  activeFilter={activeFilter}
                  onViewClick={openStudentDetail}
                  onDeleteClick={openDeleteModal}
                />
              </motion.div>
            ) : (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuizResultsTable
                  students={students}
                  quizResults={quizResults}
                  loading={loading}
                  error={error}
                  searchTerm={searchTerm}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  activeFilter={activeFilter}
                  onViewClick={openStudentDetail}
                  onDeleteClick={openDeleteModal}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedStudent && (
        <DeleteConfirmModal
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa học viên "${selectedStudent.name}"? Hành động này không thể hoàn tác.`}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteStudent}
          confirmText="Xóa học viên"
        />
      )}

      {/* Student Detail Modal */}
      {isDetailOpen && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          progressStats={ selectedStudent.userId}
          quizResults={selectedStudent.userId}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </div>
  )
}

