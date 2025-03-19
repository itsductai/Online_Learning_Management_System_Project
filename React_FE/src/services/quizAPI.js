import api from "./api";

// Thêm bài kiểm tra (Quiz)
export const addQuizAPI = async (courseId, quizData) => {
  try {
    const res = await api.post(`/quiz?courseId=${courseId}`, quizData);
    return res.data;
  } catch (error) {
    console.error(" Lỗi khi thêm bài kiểm tra:", error);
    throw error;
  }
};

// Cập nhật bài kiểm tra (Quiz)
export const updateQuizAPI = async (lessonId, quizData) => {
  try {
    const res = await api.put(`/quiz/${lessonId}`, quizData);
    return res.data;
  } catch (error) {
    console.error(" Lỗi khi cập nhật bài kiểm tra:", error);
    throw error;
  }
};

// Gửi bài kiểm tra của học viên
export const submitQuizAPI = async (quizSubmitData) => {
  try {
    const res = await api.post(`/quiz/submit`, quizSubmitData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi hoàn thành và chấm điểm bài kiểm tra!", error);
    throw error;
  }
};

// Lấy kết quả bài kiểm tra học viên theo lessonId
export const getQuizResultAPI = async (lessonId) => {
  try {
    const response = await api.get(`/quiz/result/${lessonId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy kết quả bài quiz:", error);
    return null; // Trả về null nếu không tìm thấy
  }
};

// Lấy tất cả kết quả bài kiểm tra của học viên
export const getStudentQuizResultsAPI = async () => {
  try {
    const res = await api.get(`/quiz/results`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy kết quả bài kiểm tra của học viên!", error);
    throw error;
  }
};

// Admin - Lấy danh sách điểm của tất cả học viên
export const getAdminQuizResultsAPI = async () => {
  try {
    const res = await api.get(`/quiz/results/admin`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách điểm của học viên!", error);
    throw error;
  }
};

// Bộ lọc điểm (Tăng dần / Giảm dần)
export const getSortedQuizResultsAPI = async (order) => {
  try {
    const res = await api.get(`/quiz/results/sorted?order=${order}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lọc danh sách điểm!", error);
    throw error;
  }
};