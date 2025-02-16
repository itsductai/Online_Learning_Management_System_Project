import axios from "axios";

const API_URL = "http://localhost:7025/api";

const api = axios.create({
  baseURL: API_URL,
});

// Thêm: interceptor để thêm token vào header của tất cả request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginAPI = (email, password) => {
  return api.post(`/auth/login`, { email, password });
};

export const registerAPI = (name, email, password) => {
  return api.post(`/auth/register`, {name, email, password });
};

export const coursesAPI = async () => {
  try {
    const res = await api.get(`/courses`); // Sửa: Dùng api thay cho axios để tự thêm token
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    return [];
  }
};