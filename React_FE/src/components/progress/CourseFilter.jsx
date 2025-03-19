const CourseFilter = ({ filter, setFilter }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-2 w-full md:w-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("inProgress")}
            className={`px-4 py-2 rounded-lg ${
              filter === "inProgress" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Đang học
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg ${
              filter === "completed" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Đã hoàn thành
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseFilter

