import React from "react";
import logo from "../logo/radient_font_v1.png"; // Import ảnh

export default function Footer() {
  return (
    <footer className="bg-gradient-to-t from-primary to-accent1 p-4 text-center text-white mt-10 ">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-14 w-auto" />
        <p>© 2025 Hệ thống quản lý khóa học | Được phát triển bởi CRAFT ZONE</p>
      </div>
      
    </footer>
  );
}
