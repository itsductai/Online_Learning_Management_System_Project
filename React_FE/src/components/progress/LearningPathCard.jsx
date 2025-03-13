import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"

const LearningPathCard = ({ path, isSelected, onSelect }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-md p-6 cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary" : "hover:shadow-lg"
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(path.id)}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">{path.icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{path.name}</h3>
          <p className="text-gray-500 text-sm">{path.description}</p>
        </div>
      </div>

      {isSelected && (
        <motion.div
          className="mt-4 border-t pt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <h4 className="font-medium text-gray-700 mb-2">Các khóa học trong lộ trình:</h4>
          <ol className="list-decimal pl-5 space-y-1">
            {path.courses.map((course, index) => (
              <li key={index} className="text-gray-600">
                {course}
              </li>
            ))}
          </ol>
          <button
            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition"
            onClick={(e) => {
              e.stopPropagation()
              navigate("/courses")
            }}
          >
            Xem khóa học
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default LearningPathCard

