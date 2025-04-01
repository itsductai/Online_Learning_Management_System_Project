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

// Lấy danh sách ghi danh của học viên
export const getEnrollments = async () => {
  try {
    const res = await api.get('/progress/admin/enrollments');
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách ghi danh:", error);
    return [];
  }
};

// Lấy thống kê tổng quan
export const getStatistics = async () => {
  try {
    const res = await api.get('/progress/admin/statistics');
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    return null;
  }
};

// Lấy thông tin tiến độ học tập của học viên
export const getStudentProgressDetails = async () => {
  try {
    const res = await api.get('/progress/student-enrollments');
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin tiến độ học viên:", error);
    return [];
  }
};

// Vô hiệu hóa/Kích hoạt học viên
export const toggleStudentStatus = async (userId) => {
  try {
    const res = await api.put(`/instructor/disable/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thay đổi trạng thái học viên:", error);
    throw error;
  }
};

