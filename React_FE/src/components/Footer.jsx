import React from "react";
import logo from "../logo/logo_whitecircle_v2.png"; // Import ảnh
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    { icon: <FaFacebookF />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaYoutube />, href: "#", label: "YouTube" }
  ];

  return (
    <footer className="bg-gradient-to-t from-primary to-accent1 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Logo and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="mb-6 md:mb-0">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="h-14 w-auto" />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Head Office Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Trụ sở chính</h3>
            <div className="flex items-start space-x-2">
              <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
              <p className="text-sm text-white/80">
                Tòa nhà CraftZone, Số 123 Đường ABC,
                <br />
                Quận XYZ, TP. Hồ Chí Minh
                <br />
                Việt Nam
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/60 mb-4 md:mb-0">
              © 2025 Hệ thống quản lý khóa học | Được phát triển bởi CraftZone
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Điều khoản sử dụng", "Chính sách bảo mật", "Cookie", "Không bán thông tin cá nhân"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}