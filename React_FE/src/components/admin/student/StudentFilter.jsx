"use client"

import { Search, User, BookOpen, BarChart2, ChevronUp, ChevronDown, CheckCircle, XCircle } from "lucide-react"

const StudentFilter = ({
  searchTerm,
  setSearchTerm,
  sortField,
  sortDirection,
  toggleSort,
  activeFilter,
  setActiveFilter,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm học viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => toggleSort("name")}
            className={`flex items-center px-3 py-2 border rounded-lg ${
              sortField === "name" ? "border-primary text-primary" : "border-gray-300 text-gray-600"
            }`}
          >
            <User className="w-4 h-4 mr-1" />
            Tên
            {sortField === "name" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              ))}
          </button>
          <button
            onClick={() => toggleSort("courses")}
            className={`flex items-center px-3 py-2 border rounded-lg ${
              sortField === "courses" ? "border-primary text-primary" : "border-gray-300 text-gray-600"
            }`}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Khóa học
            {sortField === "courses" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              ))}
          </button>
          <button
            onClick={() => toggleSort("progress")}
            className={`flex items-center px-3 py-2 border rounded-lg ${
              sortField === "progress" ? "border-primary text-primary" : "border-gray-300 text-gray-600"
            }`}
          >
            <BarChart2 className="w-4 h-4 mr-1" />
            Tiến độ
            {sortField === "progress" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              ))}
          </button>
        </div>
      </div>

      {/* Active/Inactive Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-lg ${
            activeFilter === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tất cả học viên
        </button>
        <button
          onClick={() => setActiveFilter("active")}
          className={`flex items-center px-3 py-1.5 rounded-lg ${
            activeFilter === "active" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          Đang hoạt động
        </button>
        <button
          onClick={() => setActiveFilter("inactive")}
          className={`flex items-center px-3 py-1.5 rounded-lg ${
            activeFilter === "inactive" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <XCircle className="w-4 h-4 mr-1" />
          Không hoạt động
        </button>
      </div>
    </div>
  )
}

export default StudentFilter

