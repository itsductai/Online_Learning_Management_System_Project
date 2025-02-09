import React, { createContext, useContext, useState, useEffect } from "react";

// Tạo Context để quản lý trạng thái đăng nhập
export const AuthContext = createContext();

// Provider để bọc toàn bộ ứng dụng
export function AuthProvider({ children }) {
  // Khởi tạo state `user`
  // Nếu trước đó đã có user trong localStorage, thì user sẽ không phải null mà sẽ lấy từ localStorage.
  // Nếu chưa có dữ liệu trong localStorage, thì user sẽ là null
  const [user, setUser] = useState(() => {
    // Lấy user từ localStorage (nếu tồn tại)
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null; // Nếu có user thì parse từ JSON, nếu không thì null
  });

  // Mỗi khi `user` thay đổi, cập nhật `localStorage`
  useEffect(() => {
    if (user !== null) {
      localStorage.setItem("user", JSON.stringify(user)); // Lưu user vào localStorage
    } else {
      localStorage.removeItem("user"); // Xóa user khỏi localStorage khi đăng xuất
    }
  }, [user]); // Chỉ chạy khi `user` thay đổi

  // Hàm đăng nhập - Lưu user vào state và localStorage
  const login = (userData) => {
    setUser(userData); // yếu tố làm user thay đổi 
  };

  // Hàm đăng xuất - Xóa user khỏi state và localStorage
  const logout = () => {
    setUser(null);
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
