import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

const TextLesson = ({ lesson, watchTime, onWatchTimeUpdate, onComplete }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Theo dõi thời gian đọc
  useEffect(() => {
    if (!lesson) return

    const timer = setInterval(() => {
      if (onWatchTimeUpdate) {
        const newTime = onWatchTimeUpdate()
        const requiredTime = lesson.duration * 30 // 50% thời gian tính bằng giây
        
        console.log("Cac gia tri theo doi thoi gian ",requiredTime, newTime, onComplete);
        // Nếu đã đọc đủ 50% thời gian, đánh dấu hoàn thành
        
        if (newTime >= requiredTime && onComplete) {
          console.log("Da du 50% thoi gian: ", lesson.lessonId)
          onComplete(lesson.lessonId)
          clearInterval(timer)
        }
      }
      console.log("Dang theo doi thoi gian hoc")
    }, 1000)

    return () => clearInterval(timer)
  }, [lesson, onWatchTimeUpdate, onComplete])

  if (!lesson) return null

  return (
    <div className="space-y-4">
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {lesson.content || "Không có nội dung"}
        </ReactMarkdown>
      </div>

      {/* Read time indicator */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Thời gian đọc</span>
          <span className="text-sm font-medium text-gray-700">
            {formatTime(watchTime)} / {lesson.duration} phút
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${Math.min((watchTime / (lesson.duration * 60)) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default TextLesson

