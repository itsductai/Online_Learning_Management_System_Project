import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import useCourses from "../hooks/useCourses"
import { Edit, MapPin, Mail, Phone, Calendar, Camera, X, Lock } from "lucide-react"
import Navbar from "../components/Navbar"

export default function ProfilePage() {
    const { user } = useAuth() // Lấy thông tin user từ AuthContext từ localstorage
    const { courses } = useCourses() // Lấy thông tin course (trước mắt là các course chưa phân loại)
    const [isEditOpen, setIsEditOpen] = useState(false) // Quản lý trạng thái của menu editedit
    const [isPasswordOpen, setIsPasswordOpen] = useState(false) // QUản lý trạng thái của menu thay đổi mật khẩu 
    const [formData, setFormData] = useState({ // Set trạng thái cho form dữ liệu 
      Name: user?.name,
      email: user?.email,
      phone: user?.phone || "012345678",
      location: user?.location || "Việt Nam",
    })
    const [passwordData, setPasswordData] = useState({ // Set trạng thái cho form password
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  
    const handleUpdateProfile = (e) => {
      e.preventDefault()
      // Xử lý cập nhật profile
      setIsEditOpen(false)
    }
  
    const handleUpdatePassword = (e) => {
      e.preventDefault()
      // Xử lý đổi mật khẩu
      setIsPasswordOpen(false)
    }
  
    const handleAvatarChange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        // Xử lý upload avatar (cần xử lý thêm vị trí lưu trong api backend, hiện tại chỉ lưu link)
        console.log("Upload file:", file)
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
                      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
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
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{user?.phone || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{user?.createdAt || "Chưa cập nhật"}</span>
                  </div>
                </div>
              </div>
  
              {/* Stats Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:bg-white transition-colors duration-300">
                  <div className="text-secondary text-sm font-medium">Khóa học</div>
                  <div className="text-2xl font-bold mt-2">12</div>
                  <div className="text-gray-500 text-sm mt-1">Đang học</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:bg-white transition-colors duration-300">
                  <div className="text-tertiary text-sm font-medium">Chứng chỉ</div>
                  <div className="text-2xl font-bold mt-2">5</div>
                  <div className="text-gray-500 text-sm mt-1">Đã đạt được</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:bg-white transition-colors duration-300">
                  <div className="text-accent3 text-sm font-medium">Điểm số</div>
                  <div className="text-2xl font-bold mt-2">856</div>
                  <div className="text-gray-500 text-sm mt-1">Tổng điểm</div>
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
                        src={user?.avatarUrl || "/placeholder.svg"}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                        <Camera className="w-4 h-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                      </label>
                    </div>
                  </div>
  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                      <input
                        type="text"
                        value={formData.Name}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    />
                  </div>
  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
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
        </div>
      </div>
    )
  }