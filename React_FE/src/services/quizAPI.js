import api from "./api";

// 🛠 Thêm bài kiểm tra (Quiz)
export const addQuizAPI = async (courseId, quizData) => {
  try {
    const res = await api.post(`/quiz?courseId=${courseId}`, quizData);
    return res.data;
  } catch (error) {
    console.error(" Lỗi khi thêm bài kiểm tra:", error);
    throw error;
  }
};

// 🛠 Cập nhật bài kiểm tra (Quiz)
export const updateQuizAPI = async (lessonId, quizData) => {
  try {
    const res = await api.put(`/quiz/${lessonId}`, quizData);
    return res.data;
  } catch (error) {
    console.error(" Lỗi khi cập nhật bài kiểm tra:", error);
    throw error;
  }
};
