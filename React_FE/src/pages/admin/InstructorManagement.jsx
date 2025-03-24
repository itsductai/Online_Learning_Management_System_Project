import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/admin/Sidebar"
import InstructorHeader from "../../components/admin/instructor/InstructorHeader"
import InstructorFilter from "../../components/admin/instructor/InstructorFilter"
import InstructorList from "../../components/admin/instructor/InstructorList"
import AddInstructorModal from "../../components/admin/instructor/AddInstructorModal"
import EditInstructorModal from "../../components/admin/instructor/EditInstructorModal"
import DeleteConfirmModal from "../../components/admin/shared/DeleteConfirmModal"
import useInstructors from "../../hooks/useInstructors"
import useCourses from "../../hooks/useCourses"
// import { registerUserAPI } from "../../services/authAPI"

// import { updateInstructorAPI, deleteInstructorAPI } from "../../services/instructorAPI"

export default function InstructorManagement() {
  const navigate = useNavigate()
  const { instructors, loading, error } = useInstructors()
  const { courses } = useCourses()

  // Thêm hàm mock để thay thế registerUserAPI
  const registerUserAPI = async (userData) => {
    console.log("Đăng ký người dùng mới:", userData);
    // Giả lập thành công
    return { success: true, user: userData };
  };

  // Thêm hàm mock để thay thế registerUserAPI
  const  updateInstructorAPI = async (userData) => {
    console.log("Cập nhật người dùng mới:", userData);
    // Giả lập thành công
    return { success: true, user: userData };
  };

  // Thêm hàm mock để thay thế registerUserAPI
  const deleteInstructorAPI = async (userData) => {
    console.log("Xóa người dùng mới:", userData);
    // Giả lập thành công
    return { success: true, user: userData };
  };


  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterLetter, setFilterLetter] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Form data for adding/editing instructors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    specialization: "",
    imageUrl: "",
  })

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      bio: "",
      specialization: "",
      imageUrl: "",
    })
  }

  // Handle adding a new instructor
  const handleAddInstructor = async (instructorData) => {
    try {
      // Call register API with instructor role
      await registerUserAPI({
        ...instructorData,
        password: "123", // Default password
        role: "Instructor",
      })

      // Close modal and reset form
      setIsAddOpen(false)
      resetForm()

      // Reload page to refresh instructor list
      window.location.reload()
    } catch (error) {
      console.error("Lỗi khi thêm giảng viên:", error)
      alert("Không thể thêm giảng viên. Vui lòng thử lại sau.")
    }
  }

  // Handle editing an instructor
  const handleEditInstructor = async (instructorData) => {
    try {
      await updateInstructorAPI(selectedInstructor.userId, instructorData)

      // Close modal and reset form
      setIsEditOpen(false)
      resetForm()

      // Reload page to refresh instructor list
      window.location.reload()
    } catch (error) {
      console.error("Lỗi khi cập nhật giảng viên:", error)
      alert("Không thể cập nhật giảng viên. Vui lòng thử lại sau.")
    }
  }

  // Handle deleting an instructor
  const handleDeleteInstructor = async () => {
    try {
      await deleteInstructorAPI(selectedInstructor.userId)

      // Close modal
      setIsDeleteOpen(false)

      // Reload page to refresh instructor list
      window.location.reload()
    } catch (error) {
      console.error("Lỗi khi xóa giảng viên:", error)
      alert("Không thể xóa giảng viên. Vui lòng thử lại sau.")
    }
  }

  // Open add modal
  const openAddModal = () => {
    resetForm()
    setIsAddOpen(true)
  }

  // Open edit modal
  const openEditModal = (instructor) => {
    setSelectedInstructor(instructor)
    setFormData({
      name: instructor.name,
      email: instructor.email,
      bio: instructor.bio || "",
      specialization: instructor.specialization || "",
      imageUrl: instructor.imageUrl || "",
    })
    setIsEditOpen(true)
  }

  // Open delete modal
  const openDeleteModal = (instructor) => {
    setSelectedInstructor(instructor)
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
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          {/* Header */}
          <InstructorHeader onAddClick={openAddModal} />

          {/* Search and Filter */}
          <InstructorFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            toggleSort={toggleSort}
            filterLetter={filterLetter}
            setFilterLetter={setFilterLetter}
          />

          {/* Instructors List */}
          <InstructorList
            instructors={instructors}
            courses={courses}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            sortField={sortField}
            sortDirection={sortDirection}
            filterLetter={filterLetter}
            onEditClick={openEditModal}
            onDeleteClick={openDeleteModal}
          />
        </div>
      </div>

      {/* Add Instructor Modal */}
      {isAddOpen && (
        <AddInstructorModal
          onClose={() => setIsAddOpen(false)}
          onSubmit={handleAddInstructor}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Edit Instructor Modal */}
      {isEditOpen && selectedInstructor && (
        <EditInstructorModal
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleEditInstructor}
          formData={formData}
          setFormData={setFormData}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && selectedInstructor && (
        <DeleteConfirmModal
          title="Xác nhận xóa"
          message={`Bạn có chắc chắn muốn xóa giảng viên "${selectedInstructor.name}"? Hành động này không thể hoàn tác.`}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDeleteInstructor}
          confirmText="Xóa giảng viên"
        />
      )}
    </div>
  )
}

