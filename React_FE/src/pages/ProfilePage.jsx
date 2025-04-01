import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import useCourses from "../hooks/useCourses"
import { Edit, MapPin, Mail, Phone, Calendar, Camera, X, Lock } from "lucide-react"
import Navbar from "../components/Navbar"
import { updateProfile, changePassword } from "../services/userAPI"

export default function ProfilePage() {
    const { user, setUser } = useAuth() // Lấy thông tin user từ AuthContext từ localstorage
    const { courses } = useCourses() // Lấy thông tin course (trước mắt là các course chưa phân loại)
    const [isEditOpen, setIsEditOpen] = useState(false) // Quản lý trạng thái của menu editedit
    const [isPasswordOpen, setIsPasswordOpen] = useState(false) // QUản lý trạng thái của menu thay đổi mật khẩu 
    const [showPasswordSuccess, setShowPasswordSuccess] = useState(false)
    const [formData, setFormData] = useState({ // Set trạng thái cho form dữ liệu 
      name: user?.name,
      email: user?.email,
      avatarUrl: user?.avatarUrl || ""
    })
    const [passwordData, setPasswordData] = useState({ // Set trạng thái cho form password
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  
    const handleUpdateProfile = async (e) => {
      e.preventDefault()
      try {
        const response = await updateProfile({
          name: formData.name,
          email: formData.email,
          avatarUrl: formData.avatarUrl
        })
        
        // Cập nhật thông tin user trong context và localStorage với dữ liệu từ response
        const updatedUser = {
          ...user,
          name: response.name,
          email: response.email,
          avatarUrl: response.avatarUrl
        }
        
        // Cập nhật vào localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser))
        
        // Cập nhật vào context
        setUser(updatedUser)
        
        alert("Cập nhật thông tin thành công!")
        setIsEditOpen(false)
      } catch (error) {
        alert(error.response?.data?.message || "Lỗi khi cập nhật thông tin")
      }
    }
  
    const handleUpdatePassword = async (e) => {
      e.preventDefault()
      
      // Kiểm tra các trường bắt buộc
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        alert("Vui lòng điền đầy đủ thông tin!")
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Mật khẩu mới không khớp!")
        return
      }

      if (passwordData.newPassword.length < 6) {
        alert("Mật khẩu mới phải có ít nhất 6 ký tự!")
        return
      }

      try {
        console.log("Gửi request đổi mật khẩu:", passwordData) // Thêm log để debug
        const response = await changePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
        
        console.log("Response từ API:", response) // Thêm log để debug
        
        setIsPasswordOpen(false)
        setShowPasswordSuccess(true)
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error)
        alert(error.response?.data?.message || "Lỗi khi đổi mật khẩu. Vui lòng kiểm tra lại mật khẩu hiện tại.")
      }
    }
  
    const handleAvatarChange = async (e) => {
      const file = e.target.files?.[0]
      if (file) {
        try {
          // Tạo FormData để upload file
          const formData = new FormData()
          formData.append("file", file)
          
          // Cập nhật avatarUrl trong form
          setFormData(prev => ({
            ...prev,
            avatarUrl: URL.createObjectURL(file) // Tạm thời hiển thị ảnh local
          }))
          
          alert("Tải ảnh lên thành công!")
          window.location.reload() // Reload trang sau khi upload ảnh thành công
        } catch (error) {
          alert("Lỗi khi tải ảnh lên")
        }
      }
    }
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-tertiary to-accent2">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Card */}
              {/* Background */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:bg-white transition-colors duration-300">
                {/* Content bên trong  */}
                <div className="flex items-start justify-between">
                  {/* Avatar và username  */}
                  <div className="flex items-center space-x-6">
                    <div className="relative group">
                      <img
                        src={user?.avatarUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10"
                      />
                      <div 
                        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                        onClick={() => setIsEditOpen(true)}
                      >
                        <Edit className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {user?.name}
                      </h1>
                      <p className="text-primary mt-1">Premium Member</p>
                    </div>
                  </div>
                  {/* Nút bật Edit Profile  */}
                  <button
                    className="bg-gradient-to-r from-primary to-tertiary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    onClick={() => setIsEditOpen(true)}
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Các thông tin cơ bản   */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{user?.createdAt || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Khóa học của tôi */}
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:bg-white transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Khóa học của tôi</h2>
                  <a href="#" className="text-primary hover:underline text-sm">
                    Xem tất cả
                  </a>
                </div>

                {/* Layout khóa học của tôi ở trang này */}
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div
                      key={course.courseId}
                      className="group p-4 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={course.imageUrl || "/placeholder.svg"}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <div className="mt-2 flex items-center space-x-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary via-tertiary to-accent2 transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-500">{course.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Các thành tích đạt được (dữ liệu tĩnh) */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:bg-white transition-colors duration-300">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Thành tích gần đây</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent1 to-accent2 flex items-center justify-center text-white">
                      🏆
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Hoàn thành khóa học</p>
                      <p className="text-sm text-gray-500">JavaScript Nâng cao</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white">
                      ⭐
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Đạt chứng chỉ</p>
                      <p className="text-sm text-gray-500">React Developer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Phần menu edit khi bật lên  */}
          {isEditOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
  
                <h2 className="text-xl font-bold mb-6">Chỉnh sửa thông tin</h2>
  
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <img
                        src={formData.avatarUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10"
                      />
                      <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link ảnh đại diện</label>
                    <input
                      type="text"
                      value={formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                      placeholder="Nhập URL ảnh đại diện"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPasswordOpen(true)}
                      className="flex items-center text-primary hover:text-primary/80"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </button>
                    <div className="space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-primary to-tertiary text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
  
          {/* Menu thay đổi password  */}
          {isPasswordOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
                <button
                  onClick={() => setIsPasswordOpen(false)}
                  className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
  
                <h2 className="text-xl font-bold mb-6">Đổi mật khẩu</h2>
  
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsPasswordOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-primary to-tertiary text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
  
          {/* Popup thông báo đổi mật khẩu thành công */}
          {showPasswordSuccess && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
                <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" className="w-20 h-20 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">Đổi mật khẩu thành công!</h3>
                <p className="mb-6">Mật khẩu của bạn đã được cập nhật thành công.</p>
                <button
                  onClick={() => setShowPasswordSuccess(false)}
                  className="w-full bg-primary text-white py-3 rounded-full font-bold transition duration-300 hover:bg-opacity-90"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }