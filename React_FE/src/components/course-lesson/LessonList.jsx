import { FaLock, FaPlay, FaCheck, FaClock } from "react-icons/fa"

const LessonList = ({ lessons, selectedLesson, lessonUnlocked, onSelectLesson }) => {
  const handleLessonSelect = (lesson) => {
    if (onSelectLesson) {
      onSelectLesson(lesson)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Danh sách bài học</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {lessons.map((lesson, index) => (
          <div
            key={lesson.lessonId}
            className={`group p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedLesson?.lessonId === lesson.lessonId ? "bg-gray-50" : ""
            } ${!lessonUnlocked[lesson.lessonId] ? "opacity-60" : ""}`}
            onClick={() => handleLessonSelect(lesson)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span
                  className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full ${
                    lessonUnlocked[lesson.lessonId] ? "bg-primary text-white" : "bg-gray-200"
                  }`}
                >
                  {lessonUnlocked[lesson.lessonId] ? index + 1 : <FaLock className="w-3 h-3" />}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{lesson.title}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      {lesson.lessonType === "video" && <FaPlay className="text-blue-500 mr-2" />}
                      {lesson.lessonType === "text" && <FaCheck className="text-green-500 mr-2" />}
                      {lesson.lessonType === "quiz" && <FaClock className="text-purple-500 mr-2" />}
                      <span className="ml-2">
                        {lesson.lessonType === "video"
                          ? "Video"
                          : lesson.lessonType === "text"
                            ? "Bài đọc"
                            : "Trắc nghiệm"}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">{lesson.duration} phút</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LessonList

