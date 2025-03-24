import api from "./api"

// Lấy danh sách tất cả học viên
export const getAllStudentsAPI = async () => {
  try {
    // const res = await api.get(`/students`)

    // // Nếu API chưa hoạt động, trả về dữ liệu giả
    // if (!res.data || res.data.length === 0) {
    //   return mockStudents
    // }
    return mockStudents
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy danh sách học viên:", error)
    // Trả về dữ liệu giả nếu API lỗi
    return mockStudents
  }
}

// Lấy thông tin chi tiết học viên theo ID
export const getStudentByIdAPI = async (studentId) => {
  try {
    const res = await api.get(`/students/${studentId}`)
    return res.data
  } catch (error) {
    console.error(`Lỗi khi lấy học viên ID ${studentId}:`, error)
    // Trả về dữ liệu giả nếu API lỗi
    return mockStudents.find((s) => s.userId === studentId) || null
  }
}

// Cập nhật trạng thái hoạt động của học viên
export const updateStudentStatusAPI = async (studentId, isActive) => {
  try {
    const res = await api.put(`/students/${studentId}/status`, { isActive })
    return res.data
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái học viên:", error)
    throw error
  }
}

// Xóa học viên
export const deleteStudentAPI = async (studentId) => {
  try {
    const res = await api.delete(`/students/${studentId}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi xóa học viên:", error)
    throw error
  }
}

// Dữ liệu giả cho học viên
const mockStudents = [
  {
    userId: 101,
    name: "Nguyễn Văn Học",
    email: "nguyenvanhoc@example.com",
    isActive: true,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-01-10T08:00:00Z",
    lastLogin: "2023-06-15T14:30:00Z",
  },
  {
    userId: 102,
    name: "Trần Thị Sinh",
    email: "tranthisinh@example.com",
    isActive: true,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-02-15T10:30:00Z",
    lastLogin: "2023-06-14T09:45:00Z",
  },
  {
    userId: 103,
    name: "Lê Văn Viên",
    email: "levanvien@example.com",
    isActive: false,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-03-20T09:15:00Z",
    lastLogin: "2023-05-10T16:20:00Z",
  },
  {
    userId: 104,
    name: "Phạm Thị Học",
    email: "phamthihoc@example.com",
    isActive: true,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-04-05T11:45:00Z",
    lastLogin: "2023-06-16T10:10:00Z",
  },
  {
    userId: 105,
    name: "Hoàng Văn Sinh",
    email: "hoangvansinh@example.com",
    isActive: true,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-05-12T14:20:00Z",
    lastLogin: "2023-06-15T17:30:00Z",
  },
  {
    userId: 106,
    name: "Đỗ Thị Viên",
    email: "dothivien@example.com",
    isActive: false,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-01-25T08:30:00Z",
    lastLogin: "2023-04-20T11:15:00Z",
  },
  {
    userId: 107,
    name: "Vũ Văn Học",
    email: "vuvanhoc@example.com",
    isActive: true,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-02-28T13:10:00Z",
    lastLogin: "2023-06-14T15:45:00Z",
  },
  {
    userId: 108,
    name: "Ngô Thị Sinh",
    email: "ngothisinh@example.com",
    isActive: true,
    imageUrl: "/placeholder.svg?height=200&width=200",
    createdAt: "2023-03-15T09:40:00Z",
    lastLogin: "2023-06-16T08:30:00Z",
  },
]

