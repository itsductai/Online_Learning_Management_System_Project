import { useState, useEffect, useRef } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext" // Import hook useAuth để lấy user từ localstorage
import { useUnread } from "../context/UnreadContext" // Chức năng mới: Import hook useUnread để lấy số tin nhắn chưa đọc
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
import { motion, AnimatePresence } from "framer-motion" // Hiệu ứng động

export default function NavBar() {
  const { user, logout } = useAuth() // Lấy user và lấy hàm logout từ AuthContext
  const navigate = useNavigate()
  const location = useLocation()

  //  State kiểm soát hiệu ứng và giao diện
  const [isScrolled, setIsScrolled] = useState(false); // Kiểm tra user có scroll xuống hay không
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Toggle menu mobile
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Toggle menu profile
  const [isDarkMode, setIsDarkMode] = useState(false); // Toggle dark mode

  // Chức năng mới: State quản lý số tin nhắn chưa đọc
  const { totalUnread } = useUnread();
  const hasNewMessage = totalUnread > 0;
  const unsubUnreadRef = useRef(null) // Ref để cleanup listener
  const unsubMessageRef = useRef(null) // Chức năng mới: Ref để cleanup message listener

  //  Bắt sự kiện cuộn trang để làm mờ Navbar khi scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // // Chức năng mới: Effect khởi tạo kết nối SignalR và lắng nghe tin nhắn chưa đọc
  // useEffect(() => {
  //   if (!user) return

  //   const initChatConnection = async () => {
  //     try {
  //       console.log("🔄 [Navbar] Khởi tạo kết nối SignalR...")
  //       // Khởi tạo kết nối SignalR
  //       await startChat()

  //       // 1. Lắng nghe sự kiện thay đổi tin nhắn chưa đọc
  //       unsubUnreadRef.current = onUnreadChanged((data) => {
  //         console.log("🔔 [Navbar] Nhận sự kiện UnreadChanged:", data)
  //         // data có thể là { conversationId, unreadCount, totalUnread } hoặc { total, items }
  //         if (data.totalUnread !== undefined) {
  //           setTotalUnread(data.totalUnread)
  //         } else if (data.total !== undefined) {
  //           setTotalUnread(data.total)
  //         }
  //       })

  //       // 2. Chức năng mới: Lắng nghe tin nhắn mới để tạo hiệu ứng
  //       unsubMessageRef.current = onMessage((messageDto) => {
  //         console.log("💬 [Navbar] Nhận tin nhắn mới:", messageDto)
          
  //         // Chỉ tạo hiệu ứng nếu tin nhắn không phải của mình
  //         if (messageDto.senderId !== user.userId) {
  //           console.log("✨ [Navbar] Kích hoạt hiệu ứng tin nhắn mới")
  //           setHasNewMessage(true)
  //           setTotalUnread(prev => prev + 1) // Tăng tạm thời, sẽ được đồng bộ bởi UnreadChanged
            
  //           // Tự động tắt hiệu ứng sau 3 giây
  //           setTimeout(() => {
  //             setHasNewMessage(false)
  //           }, 3000)
  //         }
  //       })

  //       console.log("✅ [Navbar] Kết nối SignalR thành công")
  //     } catch (error) {
  //       console.error("❌ [Navbar] Lỗi khi khởi tạo kết nối chat:", error)
  //     }
  //   }

  //   initChatConnection()

  //   // Cleanup khi component unmount hoặc user thay đổi
  //   return () => {
  //     console.log("🧹 [Navbar] Cleanup SignalR listeners")
  //     if (unsubUnreadRef.current) {
  //       unsubUnreadRef.current()
  //       unsubUnreadRef.current = null
  //     }
  //     if (unsubMessageRef.current) {
  //       unsubMessageRef.current()
  //       unsubMessageRef.current = null
  //     }
  //   }
  // }, [user])

  // Danh sách menu điều hướng
  const menuItems = [
    { path: "/", icon: <FaHome />, label: "Trang chủ" },
    { path: "/courses", icon: <FaBook />, label: "Khóa học" },
    { path: "/progress", icon: <FaChalkboardTeacher />, label: "Tiến độ" },
    { path: "/community", icon: <FaUsers />, label: "Cộng đồng" },
    // Chức năng mới: Thêm thông tin badge cho menu Chat
    {
      path: "/chat",
      icon: <FaComments />,
      label: "Chat",
      badge: totalUnread > 0 ? (totalUnread >= 10 ? "9+" : String(totalUnread)) : null, // Chức năng mới: Hiển thị 9+ nếu >= 10
      hasNewMessage, // Chức năng mới: Trạng thái có tin nhắn mới
    },
    { path: "/contact", icon: <FaEnvelope />, label: "Liên hệ" },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    // Thêm logic để thay đổi theme của toàn bộ ứng dụng ở đây
  }

  return (
    <>
      {/* Layout khung Navbar */}
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
                <motion.div key={item.path} whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="relative">
                  <Link
                    to={item.path}
                    className={`text-white flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      location.pathname === item.path ? "bg-white/20" : "hover:bg-white/10"
                    } text-base`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                  {/* Chức năng mới: Badge hiển thị số tin nhắn chưa đọc với hiệu ứng */}
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        // Chức năng mới: Hiệu ứng pulse khi có tin nhắn mới
                        boxShadow: item.hasNewMessage ? "0 0 20px rgba(239, 68, 68, 0.8)" : "none"
                      }}
                      className={`absolute -top-1 -right-1 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium shadow-lg transition-all duration-300 ${
                        item.hasNewMessage 
                          ? "bg-red-500 animate-pulse" 
                          : "bg-red-500"
                      }`}
                      style={{ fontSize: "10px" }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {/* Chức năng mới: Dot indicator khi có tin nhắn mới nhưng chưa có badge */}
                  {!item.badge && item.hasNewMessage && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"
                    />
                  )}
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
                    src={user?.avatarUrl || "/placeholder.svg?height=40&width=40"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                  />
                  <span className="hidden md:block text-white text-base">{user?.name}</span>
                </motion.button>

                {/*  Profile Dropdown */}
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
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FaUserCircle className="inline-block mr-2" />
                        Hồ sơ
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsProfileOpen(false)
                        }}
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
                  <div key={item.path} className="relative">
                    <Link
                      to={item.path}
                      className="block text-gray-800 dark:text-white py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          {item.icon}
                          <span>{item.label}</span>
                        </span>
                        {/* Chức năng mới: Badge cho mobile menu với hiệu ứng */}
                        {item.badge && (
                          <span className={`text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium transition-all duration-300 ${
                            item.hasNewMessage 
                              ? "bg-red-500 animate-pulse shadow-lg" 
                              : "bg-red-500"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {/* Chức năng mới: Dot indicator cho mobile */}
                        {!item.badge && item.hasNewMessage && (
                          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        )}
                      </span>
                    </Link>
                  </div>
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
