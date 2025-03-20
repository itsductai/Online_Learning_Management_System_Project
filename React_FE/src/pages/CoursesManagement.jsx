import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pencil, Trash2, Plus, X, DollarSign } from "lucide-react"
import Sidebar from "../components/admin/Sidebar"
import useCourses from "../hooks/useCourses"
import useInstructors from "../hooks/useInstructors"
import { useAuth } from "../context/AuthContext.jsx"

export default function CoursesManagement() {
  const navigate = useNavigate()
  const { courses, addCourse, updateCourse, deleteCourse, loading, error } = useCourses()
  const { instructors, loading: loadingInstructors } = useInstructors() // Lấy danh sách giáo viên
  const { user } = useAuth() // Lấy thông tin user hiện tại

  // State để kiểm soát modal
  const [isAddOpen, setIsAddOpen] = useState(false) // Hiển thị modal thêm khóa học
  const [isEditOpen, setIsEditOpen] = useState(false) // Hiển thị modal chỉnh sửa khóa học
  const [isDeleteOpen, setIsDeleteOpen] = useState(false) // Hiển thị modal xác nhận xóa
  const [selectedCourse, setSelectedCourse] = useState(null) // Khóa học đang chỉnh sửa/xóa
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // Trạng thái sidebar

  // Bộ lọc các khóa học nếu là Instructor
  const filteredCourses = user.role === "Instructor"
    ? courses.filter(course => course.instructorId === user.userId)
    : courses;

  // Dữ liệu form cho khóa học (dùng cho cả thêm & sửa)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
    isPaid: false,
    price: 0,
    instructorId: user.role === "Instructor" ? user.userId : "", // Nếu là Instructor, auto set ID
    expiryDate: "",
  })

  const resetForm = () => {
    setFormData({
      title: "",
      imageUrl: "",
      description: "",
      isPaid: false,
      price: 0,
      instructorId: user.role === "Instructor" ? user.userId : "", // Reset lại nếu là Instructor
      expiryDate: "",
    })
  }

  // Dùng để bắt event submit xử lý khi nhấn nút thêm khóa học
  const handleAddCourse = async (e) => {
    e.preventDefault()
    await addCourse(formData)
    setIsAddOpen(false)
    resetForm()
  }

  // Dùng để bắt event submit xử lý khi nhấn nút sửa khóa học sau khi đã điền thay đổi trong modal
  const handleEditCourse = async (e) => {
    e.preventDefault()
    await updateCourse(selectedCourse.courseId, formData)
    setIsEditOpen(false)
    resetForm()
  }

  // Bắt sự kiện xử lýlý khi nhấn vào icon xóa khóa học
  const handleDeleteCourse = async () => {
    await deleteCourse(selectedCourse.courseId)
    setIsDeleteOpen(false)
  }

  // Reset form về trạng thái rỗng khi mở modal "Thêm khóa học"
  const openAddModal = () => {
    resetForm()
    setIsAddOpen(true)
  }

  // Khi mở modal "Chỉnh sửa khóa học", form sẽ chứa dữ liệu khóa học được chọn
  const openEditModal = (course, e) => {
    e.stopPropagation() // Ngăn sự kiện click lan tỏa lên card
    setSelectedCourse(course)
    setFormData({
      title: course.title,
      imageUrl: course.imageUrl,
      description: course.description,
      isPaid: course.isPaid,
      price: course.price,
      instructorId: course.instructorId,
      expiryDate: course.expiryDate,
    })
    setIsEditOpen(true)
  }

  // Mở modal xóa khóa học
  const openDeleteModal = (course, e) => {
    e.stopPropagation() // Ngăn sự kiện click lan tỏa lên card
    setSelectedCourse(course)
    setIsDeleteOpen(true)
  }

  // Điều hướng đến trang quản lý bài học
  const navigateToLessons = (courseId) => {
    if (user.role = "Admin") {
        navigate(`/admin/courses/${courseId}/lessons`)
    }
    if (user.role = "Instructor"){
         navigate(`/instructor/courses/${courseId}/lessons`)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className=" text-2xl font-bold text-gray-800 ">Quản lý khóa học</h1>
            <button
              onClick={() => openAddModal()}
              className="flex bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
            >
              <Plus className="w-5 h-5 mr-2" />
              Thêm khóa học
            </button>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Hiển thị thông báo đang tải nếu loading === true */}
            {loading && <p className="text-2xl font-bold text-gray-800">Đang load dữ liệu các khóa học...</p>}
            {filteredCourses.map((course) => (
              <div
                key={course.courseId}
                onClick={() => navigateToLessons(course.courseId)}
                className="bg-white backdrop-blur-sm rounded-xl shadow-md p-4 transition-transform duration-300 hover:transform hover:scale-105 cursor-pointer"
              >
                <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                  <img
                    src={course.imageUrl || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{course.description}</p>

                {/* Instructor name */}
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <span className="font-medium mr-1">Giảng viên:</span>
                  <span>{instructors.find((i) => i.userId === course.instructorId)?.name || "Chưa có"}</span>
                </div>

                {/* Expiry date */}
                {course.expiryDate && (
                  <div className="flex items-center text-sm mb-3">
                    <span className="font-medium mr-1">Hết hạn:</span>
                    <span
                      className={`${
                        new Date(course.expiryDate) - new Date() < 7 * 24 * 60 * 60 * 1000
                          ? "text-red-500 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {new Date(course.expiryDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium">
                    {course.isPaid ? `${course.price.toLocaleString()}đ` : "Miễn phí"}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => openEditModal(course, e)}
                      className="p-2 text-gray-600 hover:text-primary transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => openDeleteModal(course, e)}
                      className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Course Modal */}
          {(isAddOpen || isEditOpen) && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                  onClick={() => (isAddOpen ? setIsAddOpen(false) : setIsEditOpen(false))}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">{isAddOpen ? "Thêm khóa học mới" : "Chỉnh sửa khóa học"}</h2>

                <form onSubmit={isAddOpen ? handleAddCourse : handleEditCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
                    <input
                      type="url"
                      required
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                    />
                  </div>

                  {/* Chọn Instructor (Chỉ hiện nếu là Admin) */}
                  {user.role === "Admin" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
                      <select
                        required
                        value={formData.instructorId}
                        onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                      >
                        <option value="">-- Chọn giảng viên --</option>
                        {loadingInstructors ? (
                          <option>Đang tải...</option>
                        ) : (
                          instructors.map((instructor) => (
                            <option key={instructor.userId} value={instructor.userId}>
                              {instructor.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Giảng viên</label>
                      <input
                        type="text"
                        value={user.name}
                        disabled
                        className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-gray-500"
                      />
                    </div>
                  )}

                  {/* Ngày hết hạn khóa học */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày hết hạn</label>
                    <input
                      type="date"
                      value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split("T")[0] : ""}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPaid}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            isPaid: e.target.checked,
                            price: e.target.checked ? formData.price : 0,
                          })
                        }}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">Khóa học có phí</span>
                    </label>
                    {formData.isPaid && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                        <div className="relative">
                          <input
                            type="number"
                            required
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                          />
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>

                  {isEditOpen && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngày tạo</label>
                      <input
                        type="text"
                        disabled
                        value={new Date(selectedCourse.createdAt).toLocaleDateString("vi-VN")}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => (isAddOpen ? setIsAddOpen(false) : setIsEditOpen(false))}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-primary to-tertiary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {isAddOpen ? "Thêm khóa học" : "Lưu thay đổi"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold mb-4">Xác nhận xóa</h2>
                <p className="text-gray-600 mb-6">
                  Bạn có chắc chắn muốn xóa khóa học "{selectedCourse.title}"? Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsDeleteOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleDeleteCourse}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Xóa khóa học
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

