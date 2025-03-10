import api from "./api";

//  Lấy danh sách bài học theo khóa học
export const getLessonsByCourseId = async (courseId) => {
  try {
    const res = await api.get(`/Lesson/courses/${courseId}/lessons`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài học:", error);
    return [];
  }
};

//  Thêm bài học mới
export const addLessonAPI = async (courseId, lessonData) => {
  try {
    const res = await api.post(`/Lesson/courses/${courseId}/lessons`, lessonData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm bài học:", error);
    throw error;
  }
};

//  Cập nhật bài học
export const updateLessonAPI = async (lessonId, lessonData) => {
  try {
    const res = await api.put(`/Lesson/lessons/${lessonId}`, lessonData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật bài học:", error);
    console.log(lessonId, lessonData);
    throw error;
  }
};

// Xóa bài học
export const deleteLessonAPI = async (lessonId) => {
  try {
    const res = await api.delete(`/Lesson/lessons/${lessonId}`, lessonId);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa bài học:", error);
    throw error;
  }
};
