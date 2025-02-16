import React, { useState } from "react";
import { registerAPI } from "../services/api.js";

function useRegister() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const validateEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(email);
    };

    const handleRegister = async (name, email, password, confirmPassword, setIsRegistered) => {
      setLoading(true);
      setError("");

      if (!validateEmail(email)) {
        setError("Email không hợp lệ!");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        return;
      }
  
      try {
        const res = await registerAPI(name, email, password);
        console.log("Đăng ký thành công:", res.data);
        setIsRegistered(true);
      } catch (error) {
        setError("Đăng ký thất bại, vui lòng thử lại.");
      }
      setLoading(false);
    };
    

  return {handleRegister, loading, error}
}

export default useRegister