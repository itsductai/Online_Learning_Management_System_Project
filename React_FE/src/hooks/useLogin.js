import React, { useState } from 'react';
import { loginAPI } from "../services/api";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (email,password) => {
        setLoading(true);
        setError("");
        try {
          const res = await loginAPI(email, password);
          login(res.data);
          console.log("User Data:", res.data);
          if (res.data.role === "Admin") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        } catch (error) {
          setError("Sai email hoặc mật khẩu!");
        }
      };

  return {handleLogin,loading,error};
}

export default useLogin