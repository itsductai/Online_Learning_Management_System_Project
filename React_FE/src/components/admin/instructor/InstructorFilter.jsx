import { useMemo } from "react"
import { Search, User, BookOpen, Users, ChevronUp, ChevronDown } from "lucide-react"

const InstructorFilter = ({
  searchTerm,
  setSearchTerm,
  sortField,
  sortDirection,
  toggleSort,
  filterLetter,
  setFilterLetter,
}) => {
  // Generate alphabet filters
  const alphabet = useMemo(() => {
    return Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm giảng viên..."
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
            onClick={() => toggleSort("students")}
            className={`flex items-center px-3 py-2 border rounded-lg ${
              sortField === "students" ? "border-primary text-primary" : "border-gray-300 text-gray-600"
            }`}
          >
            <Users className="w-4 h-4 mr-1" />
            Học viên
            {sortField === "students" &&
              (sortDirection === "asc" ? (
                <ChevronUp className="w-4 h-4 ml-1" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-1" />
              ))}
          </button>
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setFilterLetter("")}
          className={`px-2 py-1 text-sm rounded-md ${
            filterLetter === "" ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setFilterLetter(letter)}
            className={`px-2 py-1 text-sm rounded-md ${
              filterLetter === letter ? "bg-primary text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
    </div>
  )
}

export default InstructorFilter

