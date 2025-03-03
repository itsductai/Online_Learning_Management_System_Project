import api from "./api";

// 📝 Thêm bài kiểm tra (Quiz)
export const addQuizAPI = async (courseId, quizData) => {
  try {
    const res = await api.post(`/courses/${courseId}/quiz`, quizData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm bài kiểm tra:", error);
    throw error;
  }
};

// 📝 Cập nhật bài kiểm tra
export const updateQuizAPI = async (courseId, quizId, quizData) => {
  try {
    const res = await api.put(`/courses/${courseId}/quiz/${quizId}`, quizData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bài kiểm tra:", error);
    throw error;
  }
};

// 🗑 Xóa bài kiểm tra
export const deleteQuizAPI = async (courseId, quizId) => {
  try {
    const res = await api.delete(`/courses/${courseId}/quiz/${quizId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa bài kiểm tra:", error);
    throw error;
  }
};
