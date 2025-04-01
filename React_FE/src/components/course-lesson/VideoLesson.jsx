import { useEffect, useState } from "react"

const VideoLesson = ({ lesson, watchTime, onWatchTimeUpdate, onComplete }) => {
  const [completed, setCompleted] = useState(false)

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const getEmbedUrl = (url) => {
    if (!url) return ""

    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/,
    )
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : ""
  }

  // Theo dõi thời gian xem video
  useEffect(() => {
    if (!lesson) return

    const timer = setInterval(() => {
      if (onWatchTimeUpdate) {
        const newTime = onWatchTimeUpdate()

        const requiredTime = lesson.duration * 30 // 50% thời gian

        // Nếu đủ điều kiện và chưa gọi complete lần nào
        if (newTime >= requiredTime && !completed) {
          onComplete?.(lesson.lessonId)
          setCompleted(true)
          clearInterval(timer)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lesson, onWatchTimeUpdate, onComplete, completed])

  if (!lesson) return null

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        <div className="relative overflow-hidden" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={getEmbedUrl(lesson.youtubeUrl)}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      {/* Watch time indicator */}
      <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700">Thời gian xem</span>
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

export default VideoLesson

