import api from "./api";

// Lấy danh sách khóa học
export const coursesAPI = async () => {
  try {
    const res = await api.get(`/courses`);
    console.log("Du lieu course tra ve: ", res);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    return [];  // Trả về mảng rỗng nếu thất bại
  }
};
// API thêm khóa học mới
export const addCourseAPI = async (courseData) => {
  try {
    const res = await api.post('/courses', courseData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi thêm khóa học:", error);
    throw error; // Ném lỗi để component xử lý
  }
};

// API cập nhật khóa học
export const updateCourseAPI = async (courseId, courseData) => {
  try {
    const res = await api.put(`/courses/${courseId}`, courseData);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật khóa học:", error);
    throw error;
  }
};

// API xóa khóa học
export const deleteCourseAPI = async (courseId) => {
  try {
    const res = await api.delete(`/courses/${courseId}`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi xóa khóa học:", error);
    throw error;
  }
};
