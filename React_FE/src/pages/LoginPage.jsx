import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { loginAPI } from "../services/api";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginAPI(email, password);
      login(res.data);
      console.log("User Data:", res.data);
      if (res.data.role === "Admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError("Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent1 p-4">
      <div className="bg-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl w-full max-w-md">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Đăng nhập</h2>
          {error && <p className="text-accent3 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-3 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-full font-bold transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Đăng nhập
            </button>
          </form>

          <p className="text-center mt-6">
            Bạn chưa có tài khoản?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-secondary font-bold hover:underline"
            >
              Đăng ký
            </button>
          </p>

          <div className="mt-8 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">Hoặc</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            className="w-full mt-6 bg-white text-gray-700 py-3 rounded-full font-bold border border-gray-300 flex items-center justify-center transition duration-300 hover:bg-gray-50 hover:shadow-md"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Đăng nhập bằng Google
          </button>
        </div>
      </div>
    </div>
  );
}