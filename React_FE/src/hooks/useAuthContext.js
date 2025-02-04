import React, { createContext, useContext, useState } from "react";

// Tạo Context để quản lý đăng nhập
export const AuthContext = createContext();

// Hook tùy chỉnh để sử dụng AuthContext
export default function useAuthContext() {
  return useContext(AuthContext);
}

// Provider bọc toàn bộ ứng dụng
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    user: null, // Không dùng localStorage
  });

  const login = (userData) => setAuth({ user: userData });
  const logout = () => setAuth({ user: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
