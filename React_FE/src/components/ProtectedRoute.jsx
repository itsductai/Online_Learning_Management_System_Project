import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ context
  const token = localStorage.getItem('token'); // Thêm: Kiểm tra token trong localStorage
  
  // Nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!user || !token) { // Kiểm tra cả user và token
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "Admin" ? "/dashboard" : "/"} />;
  }

  // Nếu người dùng có quyền hợp lệ, hiển thị nội dung của route
  return children;
};

export default ProtectedRoute;
