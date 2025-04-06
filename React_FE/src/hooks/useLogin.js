import React, { useState } from 'react';
import { loginAPI } from "../services/api"; // Import API cho login từ api.js
import { useAuth } from '../context/AuthContext';  // Import AuthContext để cập nhật trạng thái đăng nhập
import { useNavigate } from 'react-router-dom'; // Import router để chuyển trang

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth(); // Lấy hàm login từ context, nhằm xử lý lấy dữ liệu user lưu vào localstorage dùng cho toàn hệ thống
    const navigate = useNavigate(); // Lấy hàm navigate đeeer chuyển trang 

    const validateEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    };

    const handleLogin = async (email,password) => {
        setLoading(true);
        setError("");

        if (!validateEmail(email)) {
          setError("Email không hợp lệ!");
          setLoading(false);
          return;
        }

        try {
          const res = await loginAPI(email, password);
          console.log("Login response:", res.data); // In response để kiểm tra
          localStorage.setItem('token', res.data.token); // Thêm: Lưu JWT token vào localStorage
          localStorage.setItem('refreshToken', res.data.refreshToken); // Lưu Refresh Token
          login(res.data); 
          if (res.data.role === "Admin") {
            navigate("/dashboard");
          } 
          if (res.data.role === "Instructor") {
            navigate("/instructor/dashboard");
          } 
          if ((res.data.role === "Student")) {
            navigate("/");
          }
        } catch (error) {
            if (error.response) {
              const status = error.response.status;

              if (status === 403) {
                setError(error.response.data.message || "Tài khoản bị vô hiệu hóa.");
              } else {
                setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
              }
            } else {
              setError("Không thể kết nối tới server.");
            }

            setLoading(false);
          }
        };

  return {handleLogin,loading,error}; // Trả về login và các trạng thái cần thiết 
}

export default useLogin;
