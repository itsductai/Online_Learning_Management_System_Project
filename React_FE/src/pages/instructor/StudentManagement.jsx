import { useState } from "react"
import { useNavigate } from "react-router-dom"
import InstructorSidebar from "../../components/instructor/Sidebar"
import StudentHeader from "../../components/admin/student/StudentHeader"
import StudentFilter from "../../components/admin/student/StudentFilter"
import StudentTabs from "../../components/admin/student/StudentTabs"
import ProgressTable from "../../components/admin/student/ProgressTable"
import DeleteConfirmModal from "../../components/admin/shared/DeleteConfirmModal"
import useStudents from "../../hooks/useStudents"
import { disableUser } from "../../services/userAPI"
import { motion, AnimatePresence } from "framer-motion"

export default function InstructorStudentManagement() {
  const navigate = useNavigate()
  const { students, loading, error } = useStudents()

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [activeFilter, setActiveFilter] = useState("all") // all, active, inactive
  const [activeTab, setActiveTab] = useState("progress") // progress, quiz
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Handle toggling student status
  const handleToggleStatus = async () => {
    try {
      await disableUser(selectedStudent.userId)
      alert(selectedStudent.isActive ? "Đã vô hiệu hóa học viên" : "Đã kích hoạt học viên")
      setIsDeleteOpen(false)
      window.location.reload()
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái học viên:", error)
      alert("Không thể thay đổi trạng thái học viên. Vui lòng thử lại sau.")
    }
  }

  // Open toggle status modal
  const openToggleModal = (student) => {
    setSelectedStudent(student)
    setIsDeleteOpen(true)
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
      <InstructorSidebar />

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
            {activeTab === "progress" && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressTable
                  students={students}
                  loading={loading}
                  error={error}
                  searchTerm={searchTerm}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  activeFilter={activeFilter}
                  onToggleStatus={openToggleModal}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle Status Confirmation Modal */}
      {isDeleteOpen && selectedStudent && (
        <DeleteConfirmModal
          title="Xác nhận thay đổi trạng thái"
          message={`Bạn có chắc chắn muốn ${selectedStudent.isActive ? "vô hiệu hóa" : "kích hoạt"} học viên "${selectedStudent.userName}"?`}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleToggleStatus}
          confirmText={selectedStudent.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
        />
      )}
    </div>
  )
}
