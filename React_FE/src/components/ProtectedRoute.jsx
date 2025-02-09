import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ context

  // Nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Nếu route yêu cầu một vai trò cụ thể nhưng người dùng không có quyền, chuyển hướng về trang chủ
  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  // Nếu người dùng có quyền hợp lệ, hiển thị nội dung của route
  return children;
};

export default ProtectedRoute;
