import api from "./api";

// Lấy danh sách tất cả giảng viên
export const getAllInstructorsAPI = async () => {
  try {
    const res = await api.get(`/instructors`);
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách giảng viên:", error);
    throw error;
  }
};

// Lấy thông tin chi tiết giảng viên theo ID
export const getInstructorByIdAPI = async (instructorId) => {
  try {
    const res = await api.get(`/instructors/${instructorId}`);
    return res.data;
  } catch (error) {
    console.error(`Lỗi khi lấy giảng viên ID ${instructorId}:`, error);
    throw error;
  }
};

// Gán giảng viên vào khóa học
export const assignInstructorToCourseAPI = async (courseId, instructorId) => {
  try {
    const res = await api.post(`/instructors/assign`, { courseId, instructorId });
    return res.data;
  } catch (error) {
    console.error("Lỗi khi gán giảng viên vào khóa học:", error);
    throw error;
  }
};
