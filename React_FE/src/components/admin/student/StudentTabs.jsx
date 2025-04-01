import { BarChart2, ListChecks } from "lucide-react"

const StudentTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex mb-6">
      <button
        onClick={() => setActiveTab("progress")}
        className={`flex items-center px-4 py-2 rounded-t-lg ${
          activeTab === "progress"
            ? "bg-white text-primary border-t border-l border-r border-gray-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <BarChart2 className="w-5 h-5 mr-2" />
        Tiến độ học tập
      </button>
      {/* <button
        onClick={() => setActiveTab("quiz")}
        className={`flex items-center px-4 py-2 rounded-t-lg ${
          activeTab === "quiz"
            ? "bg-white text-primary border-t border-l border-r border-gray-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <ListChecks className="w-5 h-5 mr-2" />
        Kết quả kiểm tra
      </button> */}
    </div>
  )
}

export default StudentTabs

