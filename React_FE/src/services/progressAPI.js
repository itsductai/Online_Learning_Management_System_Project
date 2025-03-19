import api from "./api"

// Lấy tiến độ học tập theo khóa học và người dùng
export const getProgressByCourseId = async (courseId) => {
  try {
    console.log("Lay tien do hoc tap: ", courseId);
    const res = await api.get(`/progress/user/${courseId}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy tiến độ học tập:", error)
    return null
  }
}

  // Cập nhật tiến độ học tập
  export const updateProgress = async (progressData) => {
    try {
      console.log("Goi API update tien trinh: ", progressData);
      const res = await api.put(`/progress/update`, progressData)
      return res.data
    } catch (error) {
      console.error("Lỗi khi cập nhật tiến độ học tập:", error)
      throw error
    }
  }

export const createProgress = async (courseID) => {
  try {
    console.log("Gọi API enroll khóa học với courseId:", courseID);
    const res = await api.post(`/progress/enroll`, { courseId: courseID }); //  Đúng định dạng JSON
    return res.data;
  } catch (error) {
    console.error("Lỗi khi tham gia khóa học!", error);
    throw error;
  }
};


// Lấy thống kê tiến độ học tập của người dùng
export const getUserProgressStats = async () => {
  try {
    console.log("Lay thong ke tien do")
    const res = await api.get(`/progress/getProcess`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy thống kê tiến độ học tập:", error)
    return null
  }
}

