import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context để quản lý trạng thái đăng nhập
export const AuthContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export function AuthProvider({ children }) {
  // Khởi tạo state `user`
  const [user, setUser] = useState(() => {
    // Lấy user từ localStorage (nếu tồn tại)
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Lắng nghe sự thay đổi của localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    };

    // Đăng ký event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Hàm đăng nhập - Lưu user vào state và localStorage
  const login = (userData) => {
    setUser(userData);
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
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tùy chỉnh giúp dễ dàng truy cập AuthContext từ bất kỳ component nào
export function useAuth() {  
  return useContext(AuthContext);
}
