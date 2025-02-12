import React, { useState } from "react";
import { registerAPI } from "../services/api.js";

function useRegister() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (name, email, password, confirmPassword, onSuccess) => {
      setLoading(true);
      setError("");

      if (password !== confirmPassword) {
        setError("Mật khẩu xác nhận không khớp!");
        return;
      }
  
      try {
        const res = await registerAPI(name, email, password);
        console.log("Đăng ký thành công:", res.data);
        onSuccess();
      } catch (error) {
        setError("Đăng ký thất bại, vui lòng thử lại.");
      }
      setLoading(false);
    };
    

  return {handleRegister, loading, error}
}

export default useRegister