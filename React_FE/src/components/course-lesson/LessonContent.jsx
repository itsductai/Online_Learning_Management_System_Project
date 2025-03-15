// Hiển thị nội dung bài học dựa trên loại bài học (video, text, quiz)

import VideoLesson from "./VideoLesson"
import TextLesson from "./TextLesson"
import QuizLesson from "./QuizLesson"


const LessonContent = ({ lesson, watchTime, onWatchTimeUpdate, onLessonComplete }) => {
  //  Kiểm tra xem bài học có tồn tại không
  if (!lesson) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">Chọn một bài học để bắt đầu</div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Kiểm tra loại bài học và render component tương ứng */}
      <h2 className="text-xl font-semibold mb-4">{lesson.title}</h2>
      {/* Video Lesson */}
      {lesson.lessonType === "video" && (
        <VideoLesson
          lesson={lesson}
          watchTime={watchTime}
          onWatchTimeUpdate={onWatchTimeUpdate}
          onComplete={onLessonComplete}
        />
      )}

      {/* Text Lesson */}
      {lesson.lessonType === "text" && (
        <TextLesson
          lesson={lesson}
          watchTime={watchTime}
          onWatchTimeUpdate={onWatchTimeUpdate}
          onComplete={onLessonComplete}
        />
      )}

      {/* Quiz Lesson */}
      {lesson.lessonType === "quiz" && <QuizLesson lesson={lesson} onComplete={onLessonComplete} />}
    </div>
  )
}

export default LessonContent

