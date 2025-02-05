import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log("User Role:", user.role);
    } else {
      console.log("User chưa đăng nhập.");
    }
    setTimeout(() => setLoading(false), 100); // Giả lập load dữ liệu
  }, [user]);

  // Nếu chưa đăng nhập, chuyển hướng về login
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {loading ? <p>Đang tải...</p> : <p>Chào mừng {user?.name} đến trang quản trị!</p>}
    </div>
  );
};

export default Dashboard;
