import React, { useState, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa';
import useRegister from "../hooks/useRegister.js";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { handleRegister, loading, error }= useRegister();
  
  useEffect(() => {
    isRegistered == true ? setOpenDialog(true) : setOpenDialog(false); // Chỉ mở dialog khi `isRegistered` thay đổi
  }, [isRegistered]); // Chỉ chạy khi `isRegistered` thay đổi

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-accent1 p-4">
      <div className="bg-white rounded-2xl shadow-2xl transition-all duration-300 hover:shadow-3xl w-full max-w-md">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-primary">Đăng ký</h2>
          {error && <p className="text-accent3 text-center mb-4">{error}</p>}
          <form onSubmit={(e) => { 
                e.preventDefault(); 
                  handleRegister(name, email, password, confirmPassword, setIsRegistered);
              }}
            className="space-y-4">
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Nhập họ và tên"
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu"
                className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-3 right-3 text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-full font-bold transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              { loading ? "Đang đăng ký" : "Đăng ký" }
            </button>
          </form>

          <p className="text-center mt-6">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-secondary font-bold hover:underline"
            >
              Đăng nhập
            </button>
          </p>

          <div className="mt-8 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">Hoặc</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            className="w-full mt-6 bg-white text-gray-700 py-3 rounded-full font-bold border border-gray-300 flex items-center justify-center transition duration-300 hover:bg-gray-50 hover:shadow-md"
            onClick={() => window.location.href = 'http://localhost:7025/api/auth/google-login'}
          >
            <FaGoogle className="mr-2 text-red-500" />
            Đăng ký bằng Google
          </button>
        </div>
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" alt="Success" className="w-20 h-20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Đăng ký thành công!</h3>
            <p className="mb-6">Chúc mừng bạn đã tạo tài khoản thành công. Bây giờ bạn có thể đăng nhập.</p>
            <div className="flex justify-between gap-4 mt-4">
              {/* Nút Thoát */}
              <button
                onClick={() => {
                  setIsRegistered(false); //  Reset trạng thái đăng ký
                  setOpenDialog(false); //  Đóng dialog
                }}
                className="w-1/2 bg-gray-300 text-gray-700 py-3 rounded-full font-bold transition duration-300 hover:bg-gray-400"
              >
                Thoát
              </button>

              {/* Nút Đi tới Đăng nhập */}
              <button
                onClick={() => {
                  setIsRegistered(false); // Reset trạng thái đăng ký
                  setOpenDialog(false);
                  navigate("/login");
                }}
                className="w-1/2 bg-primary text-white py-3 rounded-full font-bold transition duration-300 hover:bg-opacity-90"
              >
                Đi tới Đăng nhập
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}