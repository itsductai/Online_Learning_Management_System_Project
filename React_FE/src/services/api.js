import axios from "axios";

const API_URL = "http://localhost:7025/api";


export const loginAPI = (email, password) => {
  return axios.post(`${API_URL}/auth/login`, { email, password });
};

export const registerAPI = (name, email, password) => {
  return axios.post(`${API_URL}/auth/register`, {name, email, password });
};

export const coursesAPI = async () => {
  try {
    const res = await axios.get(`${API_URL}/courses`)
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    return []; // Trả về mảng rỗng nếu lỗi
  }
};