import { Plus } from "lucide-react"

const InstructorHeader = ({ onAddClick }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">Quản lý giảng viên</h1>
      <button
        onClick={onAddClick}
        className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
      >
        <Plus className="w-5 h-5 mr-2" />
        Thêm giảng viên
      </button>
    </div>
  )
}

export default InstructorHeader

