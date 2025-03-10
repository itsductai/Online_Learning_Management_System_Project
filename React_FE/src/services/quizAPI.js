import api from "./api";

// Thêm bài kiểm tra (Quiz)
export const addQuizAPI = async (courseId, quizData) => {
  try {
    const res = await api.post(`/courses/${courseId}/quiz`, quizData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm bài kiểm tra:", error);
    throw error;
  }
};

// Cập nhật bài kiểm tra
export const updateQuizAPI = async (courseId, quizId, quizData) => {
  try {
    const res = await api.put(`/courses/${courseId}/quiz/${quizId}`, quizData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bài kiểm tra:", error);
    throw error;
  }
};

// Xóa bài kiểm tra
export const deleteQuizAPI = async (courseId, quizId) => {
  try {
    const res = await api.delete(`/courses/${courseId}/quiz/${quizId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa bài kiểm tra:", error);
    throw error;
  }
};

// // Mock API functions for quiz
// export const addQuizAPI = async (courseId, quizData) => {
//   console.log(`Adding quiz to course ID: ${courseId}`, quizData)
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return { ...quizData, id: Math.floor(Math.random() * 1000) + 100 }
// }

// export const updateQuizAPI = async (courseId, quizId, quizData) => {
//   console.log(`Updating quiz ID: ${quizId} in course ID: ${courseId}`, quizData)
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return { ...quizData, id: quizId }
// }

// export const deleteQuizAPI = async (courseId, quizId) => {
//   console.log(`Deleting quiz ID: ${quizId} from course ID: ${courseId}`)
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 500))
//   return { success: true }
// }

