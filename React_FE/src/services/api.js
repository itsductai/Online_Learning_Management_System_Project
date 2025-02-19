import axios from "axios";

const API_URL = "http://localhost:7025/api"; // Đường dẫn gốc tới API backend

// Tạo một instance axios với baseURL cố định
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ Quan trọng: Bật gửi cookie với request
});

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
