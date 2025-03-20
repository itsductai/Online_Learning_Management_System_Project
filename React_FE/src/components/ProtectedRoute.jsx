import React from "react"; 
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');

  // Nếu chưa đăng nhập hoặc không có token, chuyển về trang đăng nhập
  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  // Nếu route có yêu cầu roles và user không có role phù hợp, điều hướng về trang phù hợp với vai trò
  if (roles && !roles.includes(user.role)) {
    if (user.role === "Admin") return <Navigate to="/dashboard" />;
    if (user.role === "Instructor") return <Navigate to="/instructor/dashboard" />;
    return <Navigate to="/" />; // Mặc định nếu role không phù hợp
  }

  // Nếu có quyền, hiển thị nội dung của route
  return children;
};

export default ProtectedRoute;
