import api from "./api"

// Lấy tiến độ học tập theo khóa học và người dùng
export const getProgressByCourseId = async (courseId, userId) => {
  try {
    const res = await api.get(`/progress/${courseId}?userId=${userId}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy tiến độ học tập:", error)
    return null
  }
}

// Cập nhật tiến độ học tập
export const updateProgress = async (progressData) => {
  try {
    const res = await api.post(`/progress/update`, progressData)
    return res.data
  } catch (error) {
    console.error("Lỗi khi cập nhật tiến độ học tập:", error)
    throw error
  }
}

// Đánh dấu bài học đã hoàn thành
export const completeLesson = async (courseId, lessonId) => {
  try {
    const res = await api.post(`/progress/complete-lesson`, {
      courseId,
      lessonId,
    })
    return res.data
  } catch (error) {
    console.error("Lỗi khi đánh dấu bài học đã hoàn thành:", error)
    throw error
  }
}

// Lấy thống kê tiến độ học tập của người dùng
export const getUserProgressStats = async (userId) => {
  try {
    const res = await api.get(`/progress/stats/${userId}`)
    return res.data
  } catch (error) {
    console.error("Lỗi khi lấy thống kê tiến độ học tập:", error)
    return null
  }
}
// Lấy tiến độ theo lộ trình học tập
export const getProgressByPath = async (pathId, userId) => {
  try {
    const res = await api.get(`/progress/path/${pathId}?userId=${userId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy tiến độ theo lộ trình:", error);
    return null;
  }
};

// Lấy đề xuất khóa học tiếp theo dựa trên tiến độ
export const getNextCourseRecommendation = async (userId) => {
  try {
    const res = await api.get(`/progress/recommendation/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy đề xuất khóa học:", error);
    return null;
  }
};

