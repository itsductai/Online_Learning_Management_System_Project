import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import {
  FaBook,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaUsers,
  FaComments,
  FaEnvelope,
  FaBookmark,
} from "react-icons/fa"
import logo from "../logo/logo_white_v2.png" // Import ảnh
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Trang chủ" },
    { path: "/courses", icon: <FaBook />, label: "Khóa học" },
    { path: "/progress", icon: <FaChalkboardTeacher />, label: "Tiến độ" },
    { path: "/community", icon: <FaUsers />, label: "Cộng đồng" },
    { path: "/chat", icon: <FaComments />, label: "Chat" },
    { path: "/contact", icon: <FaEnvelope />, label: "Liên hệ" },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Thêm logic để thay đổi theme của toàn bộ ứng dụng ở đây
  }

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-sm"
            : "bg-gradient-to-r from-primary to-secondary"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.img
                src={logo}
                alt="Logo"
                className="h-16 w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {menuItems.map((item) => (
                <motion.div key={item.path} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    to={item.path}
                    className={`text-white flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path ? "bg-white/20" : "hover:bg-white/10"
                    } text-base`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-6">
              {/* Saved Courses */}
              <motion.button whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="p-2 rounded-full hover:bg-white/10">
                <FaBookmark className="text-xl text-white" />
              </motion.button>

              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-white/10"
              >
                {isDarkMode ? <FaSun className="text-xl text-white" /> : <FaMoon className="text-xl text-white" />}
              </motion.button>

              {/* User Profile */}
              <div className="relative">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <img
                    src={user?.avatar || "https://via.placeholder.com/40"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                  <span className="hidden md:block text-white text-base">{user?.name}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >
                        <FaUserCircle className="inline-block mr-2" />
                        Hồ sơ
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      >
                        <FaSignOutAlt className="inline-block mr-2" />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden text-white p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white dark:bg-gray-800"
            >
              <div className="px-4 py-3 space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="flex items-center space-x-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      {/* Spacer để tránh content bị che bởi fixed navbar */}
      <div className="h-20" />
    </>
  )
}
