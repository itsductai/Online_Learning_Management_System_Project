import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context để quản lý trạng thái đăng nhập
export const AuthContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Lấy user từ localStorage nếu có
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));// Lưu vào localStorage
    } else {
      localStorage.removeItem("user");
    }
  }, [user]); // Cập nhật khi user thay đổi

const login = (userData) => {
  setUser(userData); 
};

const logout = () => {
  setUser(null);
  localStorage.removeItem("user"); // Xóa khỏi localStorage khi đăng xuất
};

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để truy cập AuthContext
export function useAuth() {  
  return useContext(AuthContext);
}
