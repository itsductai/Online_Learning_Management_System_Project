import React, { createContext, useContext, useState } from "react";

// Tạo Context để quản lý trạng thái đăng nhập
export const AuthContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook để truy cập AuthContext
export function useAuth() {  // Đảm bảo tên hàm export là `useAuth`
  return useContext(AuthContext);
}
