"use client"
import { motion } from "framer-motion"
import { FaBullhorn, FaCalendarAlt, FaUsers, FaAward } from "react-icons/fa"

const Announcements = () => {
  // Dữ liệu mẫu cho thông báo
  const announcements = [
    {
      id: 1,
      title: "Khóa học mới: ReactJS Advanced",
      description: "Khóa học ReactJS nâng cao đã được ra mắt. Đăng ký ngay hôm nay để nhận ưu đãi 20%.",
      date: "15/03/2025",
      icon: <FaBullhorn className="text-blue-500" />,
      color: "blue",
    },
    {
      id: 2,
      title: "Sự kiện: Workshop JavaScript",
      description: "Tham gia workshop JavaScript miễn phí vào ngày 20/03/2025 với các chuyên gia hàng đầu.",
      date: "20/03/2025",
      icon: <FaCalendarAlt className="text-green-500" />,
      color: "green",
    },
    {
      id: 3,
      title: "Cộng đồng: Thảo luận Python",
      description: "Tham gia buổi thảo luận về Python và chia sẻ kinh nghiệm với cộng đồng.",
      date: "25/03/2025",
      icon: <FaUsers className="text-purple-500" />,
      color: "purple",
    },
    {
      id: 4,
      title: "Chứng chỉ: Web Development",
      description: "Chứng chỉ Web Development đã được cập nhật với nội dung mới nhất về công nghệ web.",
      date: "01/04/2025",
      icon: <FaAward className="text-orange-500" />,
      color: "orange",
    },
  ]

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thông báo & Sự kiện</h2>
          <p className="text-gray-600">Cập nhật những thông tin mới nhất từ nền tảng học tập của chúng tôi</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {announcements.map((announcement) => (
            <motion.div
              key={announcement.id}
              className={`bg-${announcement.color}-50 border border-${announcement.color}-100 rounded-xl p-6 hover:shadow-md transition`}
              variants={itemVariants}
            >
              <div className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full bg-${announcement.color}-100 flex items-center justify-center mr-4 flex-shrink-0`}
                >
                  {announcement.icon}
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-800">{announcement.title}</h3>
                    <span className="text-sm text-gray-500">{announcement.date}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{announcement.description}</p>
                  <button className={`mt-3 text-${announcement.color}-600 font-medium text-sm hover:underline`}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Announcements

