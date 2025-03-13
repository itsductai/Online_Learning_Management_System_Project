import { useState } from "react"
import { motion } from "framer-motion"
import { FaCode, FaServer, FaDesktop, FaMobileAlt, FaDatabase, FaRobot } from "react-icons/fa"
import LearningPathCard from "./LearningPathCard"

const LearningPaths = () => {
  const [selectedPath, setSelectedPath] = useState(null)

  // Các lộ trình học tập
  const learningPaths = [
    {
      id: "frontend",
      name: "Frontend Developer",
      icon: <FaDesktop className="text-blue-500" />,
      description: "Lộ trình học để trở thành Frontend Developer chuyên nghiệp",
      courses: ["HTML & CSS Cơ bản", "JavaScript Nâng cao", "ReactJS", "Redux", "TypeScript"],
    },
    {
      id: "backend",
      name: "Backend Developer",
      icon: <FaServer className="text-green-500" />,
      description: "Lộ trình học để trở thành Backend Developer chuyên nghiệp",
      courses: ["Node.js Cơ bản", "Express.js", "MongoDB", "RESTful API", "GraphQL"],
    },
    {
      id: "fullstack",
      name: "Fullstack Developer",
      icon: <FaCode className="text-purple-500" />,
      description: "Lộ trình học để trở thành Fullstack Developer toàn diện",
      courses: ["HTML & CSS Cơ bản", "JavaScript Nâng cao", "ReactJS", "Node.js & Express", "MongoDB"],
    },
    {
      id: "mobile",
      name: "Mobile Developer",
      icon: <FaMobileAlt className="text-orange-500" />,
      description: "Lộ trình học để trở thành Mobile Developer chuyên nghiệp",
      courses: ["React Native Cơ bản", "State Management", "Native Modules", "App Performance", "App Deployment"],
    },
    {
      id: "data",
      name: "Data Engineer",
      icon: <FaDatabase className="text-red-500" />,
      description: "Lộ trình học để trở thành Data Engineer chuyên nghiệp",
      courses: ["SQL Cơ bản", "Python cho Data", "ETL Processes", "Data Warehousing", "Big Data Technologies"],
    },
    {
      id: "ai",
      name: "AI Engineer",
      icon: <FaRobot className="text-indigo-500" />,
      description: "Lộ trình học để trở thành AI Engineer chuyên nghiệp",
      courses: ["Python Cơ bản", "Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision"],
    },
  ]

  const handleSelectPath = (pathId) => {
    setSelectedPath(pathId === selectedPath ? null : pathId)
  }

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lộ trình học tập</h2>
        <p className="text-gray-600">Chọn lộ trình phù hợp với mục tiêu của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <LearningPathCard
            key={path.id}
            path={path}
            isSelected={selectedPath === path.id}
            onSelect={handleSelectPath}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default LearningPaths

