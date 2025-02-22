import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context để quản lý trạng thái đăng nhập
export const AuthContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export function AuthProvider({ children }) {
  // Khởi tạo state `user`
  // Nếu trước đó kh có user trong localStorage thì user sẽ  null hoặ sẽ lấy từ localStorage nếu có tồn tại.
  const [user, setUser] = useState(() => {
    // Lấy user từ localStorage (nếu tồn tại)
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // Nếu có user thì parse từ JSON, nếu không thì null
  });

  // Hàm đăng nhập - Lưu user vào state và localStorage
  const login = (userData) => {
    setUser(userData); // yếu tố làm user thay đổi
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    localStorage.setItem("refreshToken", userData.refreshToken); 
  };

  // Hàm đăng xuất - Xóa user khỏi state và localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  return (
    // Cung cấp giá trị `user`, `login`, `logout` cho toàn bộ ứng dụng
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tùy chỉnh giúp dễ dàng truy cập AuthContext từ bất kỳ component nào
export function useAuth() {  
  return useContext(AuthContext);
}
