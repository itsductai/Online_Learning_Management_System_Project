import axios from "axios";

const API_URL = "http://localhost:7025/api"; // Đường dẫn gốc tới API backend

// Tạo một instance axios với baseURL cố định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//Tóm tắt hoạt động của api.js
// Khi gọi API: Tự động gắn JWT Token vào header.
// Khi gặp lỗi 401 Unauthorized: Tự động refresh token.
// Nếu refresh token thất bại: Đăng xuất người dùng.

// Thêm: interceptor để thêm token vào header của tất cả request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



// 🛠 Interceptor response: Xử lý lỗi 401 Unauthorized
api.interceptors.response.use(
  (response) => response, // Nếu response thành công, trả về bình thường
  async (error) => {
    const originalRequest = error.config; // Giữ lại request ban đầu

    console.log(" Phát hiện lỗi từ response");
    console.log(" originalRequest trước khi xử lý:", originalRequest);
    if (!error.response) {
      console.error(" Không có response từ server (Có thể do lỗi CORS hoặc Server không phản hồi)");
      return Promise.reject(error);
    }


    // Nếu _retry chưa tồn tại, gán giá trị mặc định là false
    if (!originalRequest.hasOwnProperty("_retry")) {
      originalRequest._retry = false;
    }

    console.log(" originalRequest._retry sau khi gán:", originalRequest._retry);
    console.log(" error:", error);
    console.log(" error.response.status:", error.response?.status);

    // Kiểm tra nếu là lỗi 401 và chưa thử refresh token
    if ((error.response?.status === 401 ) && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu đã thử refresh token 1 lần
      console.log(" Token hết hạn, đang lấy Refresh Token mới...");
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          console.error(" Không tìm thấy Refresh Token!");
          throw new Error("Không tìm thấy Refresh Token!");
        }
        console.error("RefreshToken hiện tại: " ,refreshToken);

        // Gửi request lấy Access Token mới
        const res = await api.post(`/auth/refresh-token`, {refreshToken});

        if (res.status === 200) {
          const newAccessToken = res.data.token; // Lấy Access Token mới
          const newrefreshToken = res.data.refreshToken;
          localStorage.setItem("token", newAccessToken); // Cập nhật vào localStorage
          localStorage.setItem("refreshToken", newrefreshToken);

          // Cập nhật header Authorization & gửi lại request cũ
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          console.log(" Refresh Token thành công, gửi lại request cũ.");
          
          return api(originalRequest); // Gửi lại request cũ với token mới
        }
      } catch (refreshError) {
        console.error(" Refresh Token thất bại:", refreshError);

        // Xóa token & redirect đến trang đăng nhập
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    //  originalRequest._retry = false;
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

export default api;