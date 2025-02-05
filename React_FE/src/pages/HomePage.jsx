import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("User Role:", user.role); // Debug role của user khi vào trang /
    } else {
      console.log("User chưa đăng nhập.");
    }
  }, [user]);

  return (
    <div>
      <h1>Trang Chủ</h1>
      {user && <p>Xin chào, {user.name}! Vai trò của bạn là: {user.role}</p>}
    </div>
  );
};

export default HomePage;
