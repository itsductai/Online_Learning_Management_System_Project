import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { FaArrowRight } from "react-icons/fa"
import logo from "../../logo/logo_white_v2.png" 

const HeroSection = ({ user }) => {
  const navigate = useNavigate()
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  // Theo dõi vị trí chuột cho hiệu ứng
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  // Hiệu ứng hình học nền
  const shapes = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 60 + 20,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }))

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent1 text-white py-20 md:py-28">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {shapes.map((shape) => (
          <motion.div
            key={shape.id}
            className="absolute rounded-full bg-white opacity-5"
            style={{
              width: shape.size,
              height: shape.size,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
            }}
            animate={{
              rotate: [shape.rotation, shape.rotation + 360],
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
            }}
            transition={{
              duration: shape.duration,
              repeat: Number.POSITIVE_INFINITY,
              delay: shape.delay,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Interactive light effect */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-white opacity-10 blur-[100px] pointer-events-none"
        animate={{
          x: cursorPosition.x - 250,
          y: cursorPosition.y - 250,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
          mass: 0.5,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo and greeting */}
          <motion.div className="mb-8 flex flex-col items-center" variants={itemVariants}>
            <motion.img
              src={logo}
              alt="CraftZone Logo"
              className="h-24 w-auto mb-4"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            />
            <h2 className="text-2xl md:text-3xl font-medium text-white/90">Xin chào, mình là CraftZone</h2>
          </motion.div>

          {/* Welcome message */}
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" variants={itemVariants}>
            Chào mừng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              {user?.name || "bạn"}
            </span>
          </motion.h1>

          {/* Question */}
          <motion.p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl" variants={itemVariants}>
            Hôm nay bạn muốn học gì nào?
          </motion.p>

          {/* Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={() => navigate("/courses")}
              className="bg-white text-primary font-bold text-lg py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="flex items-center">
                Học thôi
                <motion.span
                  animate={isHovering ? { x: [0, 5, 0] } : {}}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    duration: 0.8,
                  }}
                >
                  <FaArrowRight className="ml-2" />
                </motion.span>
              </span>
            </motion.button>
          </motion.div>

          {/* Decorative elements */}
          <motion.div
            className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-16 bg-white/5 backdrop-blur-sm rounded-t-full"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  )
}

export default HeroSection

