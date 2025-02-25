import axios from "axios";

const API_URL = "http://localhost:7025/api"; // Đường dẫn gốc tới API backend

// Tạo một instance axios với baseURL cố định
const api = axios.create({
  baseURL: API_URL,
});

//Tóm tắt hoạt động của api.js
// Khi gọi API: Tự động gắn JWT Token vào header.
// Khi gặp lỗi 401 Unauthorized: Tự động refresh token.
// Nếu refresh token thất bại: Đăng xuất người dùng.

// Thêm: interceptor để thêm token vào header của tất cả request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Lấy token từ localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header Authorization
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Xử lý lỗi nếu request có vấn đề
});

// 🛠 Interceptor response: Xử lý lỗi 401 Unauthorized (Token hết hạn)
api.interceptors.response.use(
  (response) => response, // Nếu response thành công, trả về bình thường
  async (error) => {
    const originalRequest = error.config; // Giữ lại request ban đầu

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu request này đã retry 1 lần

      try {
        // Gửi request lấy Access Token mới
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });

        if (res.status === 200) {
          const newAccessToken = res.data.token; // Lấy Access Token mới
          localStorage.setItem("token", newAccessToken); // Cập nhật vào localStorage

          // Cập nhật header Authorization & gửi lại request cũ
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Lỗi khi refresh token:", refreshError);
        localStorage.removeItem("token"); // Xóa token nếu refresh thất bại
        localStorage.removeItem("refreshToken"); // Xóa refresh token
        window.location.href = "/login"; // Chuyển hướng đến trang đăng nhập
      }
    }

    return Promise.reject(error); // Trả lỗi về nếu không thể xử lý
  }
);

// API đăng nhập
export const loginAPI = (email, password) => {
  return api.post(`/auth/login`, { email, password });
};

// API đăng ký
export const registerAPI = (name, email, password) => {
  return api.post(`/auth/register`, { name, email, password });
};

// API lấy danh sách khóa học
export const coursesAPI = async () => {
  try {
    const res = await api.get(`/courses`);
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