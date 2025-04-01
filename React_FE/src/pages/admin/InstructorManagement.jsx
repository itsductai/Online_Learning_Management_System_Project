import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/admin/Sidebar"
import InstructorHeader from "../../components/admin/instructor/InstructorHeader"
import InstructorFilter from "../../components/admin/instructor/InstructorFilter"
import InstructorList from "../../components/admin/instructor/InstructorList"
import AddInstructorModal from "../../components/admin/instructor/AddInstructorModal"
import EditInstructorModal from "../../components/admin/instructor/EditInstructorModal"
import DisableConfirmModal from "../../components/admin/shared/DeleteConfirmModal"
import useInstructors from "../../hooks/useInstructors"
import useCourses from "../../hooks/useCourses"
import { createInstructorAPI, updateInstructorAPI, disableInstructorAPI } from "../../services/instructorAPI"
import { toast } from "react-hot-toast"

export default function InstructorManagement() {
  const navigate = useNavigate()
  const { instructors, loading, error, mutate } = useInstructors()
  const { courses } = useCourses()

  // State for UI controls
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterLetter, setFilterLetter] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDisableOpen, setIsDisableOpen] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Form data for adding/editing instructors
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "123",
    bio: "",
    specialization: "",
    avatarUrl: "",
  })

  // Thêm state để quản lý modal xác nhận
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [instructorToToggle, setInstructorToToggle] = useState(null);

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "123",
      bio: "",
      specialization: "",
      avatarUrl: "",
    })
  }

  // Handle adding a new instructor
  const handleAddInstructor = async (instructorData) => {
    try {
      // Đảm bảo có password
      const dataToSend = {
        ...instructorData,
        password: instructorData.password || "123",
      }

      // Gọi API tạo giảng viên
      await createInstructorAPI(dataToSend)

      alert("Thêm giảng viên thành công.")

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
      // Chỉ gửi các trường cần thiết cho API cập nhật
      const dataToUpdate = {
        name: instructorData.name,
        avatarUrl: instructorData.avatarUrl || "",
        specialization: instructorData.specialization || "",
        bio: instructorData.bio || "",
      }

      console.log("selectedInstructor.userId: ", selectedInstructor.userId, dataToUpdate)
      await updateInstructorAPI(selectedInstructor.userId, dataToUpdate)

      alert("Cập nhật giảng viên thành công.")

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

  // Xử lý mở modal xác nhận
  const handleToggleStatusClick = (instructor) => {
    setInstructorToToggle(instructor)
    setIsConfirmModalOpen(true)
  }

  // Xử lý khi xác nhận thay đổi trạng thái
  const handleConfirmToggleStatus = async () => {
    try {
      await disableInstructorAPI(instructorToToggle.userId)
      
      toast.success(
        `${instructorToToggle.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'} giảng viên ${instructorToToggle.name} thành công`
      )
      
      // Đóng modal
      setIsConfirmModalOpen(false)
      setInstructorToToggle(null)
      
      // Tải lại trang thay vì sử dụng mutate
      window.location.reload()
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái giảng viên:", error)
      toast.error(
        `Không thể ${instructorToToggle.isActive ? 'vô hiệu hóa' : 'kích hoạt'} giảng viên. Vui lòng thử lại sau.`
      )
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
      password: "123", // Mặc định
      bio: instructor.bio || "",
      specialization: instructor.specialization || "",
      avatarUrl: instructor.avatarUrl || "",
    })
    setIsEditOpen(true)
  }

  // Open disable modal
  const openDisableModal = (instructor) => {
    setSelectedInstructor(instructor)
    setIsDisableOpen(true)
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
            onToggleStatus={handleToggleStatusClick}
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

      {/* Disable Confirmation Modal */}
      {isDisableOpen && selectedInstructor && (
        <DisableConfirmModal
          title="Xác nhận vô hiệu hóa"
          message={`Bạn có chắc chắn muốn vô hiệu hóa giảng viên "${selectedInstructor.name}"? Hành động này không thể hoàn tác.`}
          onClose={() => setIsDisableOpen(false)}
          onConfirm={handleToggleStatusClick}
          confirmText="Vô hiệu hóa giảng viên"
        />
      )}

      {/* Modal xác nhận thay đổi trạng thái */}
      {isConfirmModalOpen && instructorToToggle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {instructorToToggle.isActive ? 'Xác nhận vô hiệu hóa' : 'Xác nhận kích hoạt'}
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn {instructorToToggle.isActive ? 'vô hiệu hóa' : 'kích hoạt'} giảng viên 
              "{instructorToToggle.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false)
                  setInstructorToToggle(null)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmToggleStatus}
                className={`px-4 py-2 rounded-lg text-white ${
                  instructorToToggle.isActive
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {instructorToToggle.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


