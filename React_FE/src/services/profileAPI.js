import api from "./api"

// Tạo notification system đơn giản thay thế toast
const showNotification = (message, type = "info") => {
  // Tạo element notification
  const notification = document.createElement("div")
  notification.className = `fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform translate-x-full`

  // Styling theo type
  switch (type) {
    case "success":
      notification.className += " bg-green-500"
      break
    case "error":
      notification.className += " bg-red-500"
      break
    case "warning":
      notification.className += " bg-yellow-500"
      break
    default:
      notification.className += " bg-blue-500"
  }

  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full")
  }, 100)

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.add("translate-x-full")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 3000)
}

// 1. API lấy vai trò của chính mình trong group
export const getMyGroupRole = async (conversationId) => {
  try {
    const response = await api.get(`/chat/conversations/${conversationId}/my-role`)
    return response.data.role // "Admin" hoặc "Member"
  } catch (error) {
    if (error?.response?.status === 403) {
      showNotification("Bạn không thuộc nhóm này.", "error")
    } else if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy nhóm.", "error")
    } else {
      showNotification("Không thể xác định quyền của bạn.", "error")
    }
    throw error
  }
}

// 2. API lấy danh sách thành viên mini (có myRole và memberRole)
export const getGroupMembersMini = async (conversationId) => {
  try {
    const response = await api.get(`/chat/conversations/${conversationId}/members/mini`)
    return response.data // { conversationId, count, myRole, items: [{ userId, name, avatarUrl, memberRole }] }
  } catch (error) {
    if (error?.response?.status === 403) {
      showNotification("Bạn không có quyền xem danh sách thành viên.", "error")
    } else if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy nhóm.", "error")
    } else {
      showNotification("Không thể tải danh sách thành viên.", "error")
    }
    throw error
  }
}

// 3. API thêm thành viên vào group (với proper error handling)
export const addGroupMembers = async (conversationId, memberIds) => {
  try {
    await api.post(`/chat/conversations/${conversationId}/members`, { memberIds })
    showNotification("Đã thêm thành viên", "success")
    return true
  } catch (error) {
    if (error?.response?.status === 403) {
      showNotification("Chỉ trưởng nhóm mới có quyền thêm thành viên", "error")
    } else if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy nhóm.", "error")
    } else if (error?.response?.status >= 500) {
      showNotification("Lỗi hệ thống. Vui lòng thử lại sau", "error")
    } else {
      showNotification("Không thể thêm thành viên", "error")
    }
    throw error
  }
}

// 4. API kick thành viên khỏi group (với proper error handling)
export const kickGroupMember = async (conversationId, userId) => {
  try {
    await api.delete(`/chat/conversations/${conversationId}/members/${userId}`)
    showNotification("Đã xóa thành viên khỏi nhóm", "success")
    return true
  } catch (error) {
    if (error?.response?.status === 403) {
      showNotification("Chỉ trưởng nhóm mới có quyền xóa thành viên", "error")
    } else if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy tài nguyên", "error")
    } else if (error?.response?.status >= 500) {
      showNotification("Lỗi hệ thống. Vui lòng thử lại sau", "error")
    } else {
      showNotification("Không thể xóa thành viên", "error")
    }
    throw error
  }
}

// 5. API lấy full profile cho trang profile
export const getFullProfile = async (userId) => {
  try {
    return await api.get(`/chat/profiles/${userId}/full`)
  } catch (error) {
    if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy người dùng.", "error")
    } else {
      showNotification("Không thể tải thông tin người dùng.", "error")
    }
    throw error
  }
}

// 6. API lấy mini profile cho popup
export const getMiniProfile = async (userId) => {
  try {
    return await api.get(`/chat/profiles/${userId}/mini`)
  } catch (error) {
    if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy người dùng.", "error")
    } else {
      showNotification("Không thể tải thông tin người dùng.", "error")
    }
    throw error
  }
}

// 7. API lấy danh sách thành viên full cho trang group
export const getGroupMembersFull = async (conversationId) => {
  try {
    return await api.get(`/chat/conversations/${conversationId}/members/full`)
  } catch (error) {
    if (error?.response?.status === 403) {
      showNotification("Bạn không có quyền xem danh sách thành viên.", "error")
    } else if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else if (error?.response?.status === 404) {
      showNotification("Không tìm thấy nhóm.", "error")
    } else {
      showNotification("Không thể tải danh sách thành viên.", "error")
    }
    throw error
  }
}

// 8. API tìm kiếm người để thêm vào group
export const searchPeopleForGroup = async (query, take = 10) => {
  try {
    return await api.get(`/chat/people/search`, { params: { q: query, take } })
  } catch (error) {
    if (error?.response?.status === 401) {
      showNotification("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.", "error")
    } else {
      showNotification("Không thể tìm kiếm người dùng.", "error")
    }
    throw error
  }
}

// 9. Future API stubs - tạm thời mock data
export const getFriendshipStatus = async (userId) => {
  // Mock data cho friendship status
  return Promise.resolve({
    data: { areFriends: false, since: null },
  })
}

export const getLearningStreak = async (userId, weeks = 53) => {
  // Mock data cho learning streak - tạo dữ liệu giả deterministic theo userId
  const days = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - weeks * 7)

  for (let i = 0; i < weeks * 7; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)

    // Tạo dữ liệu giả dựa trên userId và ngày để có tính deterministic
    const seed = userId * 1000 + i
    const value = Math.floor((Math.sin(seed) + 1) * 1.5) // 0, 1, hoặc 2

    days.push({
      date: date.toISOString().split("T")[0],
      value: Math.min(2, Math.max(0, value)),
    })
  }

  return Promise.resolve({ data: { days } })
}
