import { useState, useEffect } from "react"
import { FaClock, FaCheck } from "react-icons/fa"
import QuizQuestion from "./QuizQuestion"
import QuizResult from "./QuizResult"

const QuizLesson = ({ lesson, onComplete }) => {
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)

  // Thiết lập thời gian cho quiz khi bắt đầu
  useEffect(() => {
    if (quizStarted && lesson?.lessonType === "quiz" && !quizCompleted) {
      // Giả sử mỗi câu hỏi có 1 phút
      const totalTime = lesson.questions?.length * 60 || 600
      setTimeLeft(totalTime)

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizStarted, lesson, quizCompleted])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setQuizCompleted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex,
    })
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowSubmitConfirm(true)
    }
  }

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuizComplete = () => {
    // Tính điểm
    let score = 0
    lesson.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++
      }
    })

    setQuizScore(score)
    setQuizCompleted(true)

    // Đánh dấu hoàn thành bài học
    if (onComplete) {
      onComplete(lesson.lessonId)
    }
  }

  if (!lesson) return null

  // Hiển thị màn hình bắt đầu quiz
  if (!quizStarted && !quizCompleted) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
          <h3 className="text-xl font-semibold mb-4">Bài kiểm tra: {lesson.title}</h3>
          <div className="space-y-4 text-left mb-6">
            <div className="flex items-center">
              <FaClock className="text-gray-500 mr-2" />
              <span>Thời gian: {lesson.duration} phút</span>
            </div>
            <div className="flex items-center">
              <FaCheck className="text-gray-500 mr-2" />
              <span>Số câu hỏi: {lesson.questions?.length || 0}</span>
            </div>
          </div>
          <button
            onClick={startQuiz}
            className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition w-full"
          >
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    )
  }

  // Hiển thị kết quả quiz
  if (quizCompleted) {
    return <QuizResult lesson={lesson} quizScore={quizScore} selectedAnswers={selectedAnswers} onRetry={startQuiz} />
  }

  // Hiển thị câu hỏi quiz
  return (
    <QuizQuestion
      lesson={lesson}
      currentQuestionIndex={currentQuestionIndex}
      selectedAnswers={selectedAnswers}
      timeLeft={timeLeft}
      showSubmitConfirm={showSubmitConfirm}
      formatTime={formatTime}
      onAnswerSelect={handleAnswerSelect}
      onNextQuestion={goToNextQuestion}
      onPrevQuestion={goToPrevQuestion}
      onSubmitConfirm={() => setShowSubmitConfirm(true)}
      onCancelSubmit={() => setShowSubmitConfirm(false)}
      onSubmitQuiz={handleQuizComplete}
    />
  )
}

export default QuizLesson

