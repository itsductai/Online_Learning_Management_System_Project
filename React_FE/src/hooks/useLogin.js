import React, { useState } from 'react';
import { loginAPI } from "../services/api";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

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
          } else {
            navigate("/");
          }
        } catch (error) {
          setError("Sai email hoặc mật khẩu!");
          setLoading(false);
        }
      };

  return {handleLogin,loading,error};
}

export default useLogin;
