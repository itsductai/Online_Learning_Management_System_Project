// Hiển thị bài kiểm tra và xử lý logic chấm điểm
import { getQuizResultAPI } from "../../services/quizAPI";
import { useState, useEffect } from "react"
import { FaClock, FaCheck } from "react-icons/fa"
import QuizQuestion from "./QuizQuestion"
import QuizResult from "./QuizResult"
import { submitQuizAPI } from "../../services/quizAPI";

const QuizLesson = ({ lesson, onComplete, completedLessons }) => {
  // useState quản lý trạng thái của bài quiz
  const [quizStarted, setQuizStarted] = useState(false) // Quản lý trạng thái bắt đầu quiz
  const [quizCompleted, setQuizCompleted] = useState(false) // Quản lý trạng tháu hoàn thành quiz
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0) // Quản lý vị trí quiz hiện tại
  const [selectedAnswers, setSelectedAnswers] = useState({}) // Quản lý trạng thái chọn đáp án, câu trả lời của người dùng
  const [timeLeft, setTimeLeft] = useState(0) // Quản lý thời gian còn lại
  const [quizScore, setQuizScore] = useState(0) // QUản lý điểm
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false) //Quản lý popup hoàn thành bài quiz
  const [quizResult, setQuizResult] = useState(null);
  // Thêm state để lưu chi tiết kết quả bài kiểm tra
  const [answerResults, setAnswerResults] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(0) // Quản lý số câu đúng

  // Thiết lập thời gian cho quiz khi bắt đầu
  // Khi bắt đầu quiz, đếm ngược thời gian và tự động nộp bài khi hết giờ
  useEffect(() => {
    if (quizStarted && lesson?.lessonType === "quiz" && !quizCompleted) {
      //Thời gian tổng dựa vài thời gian lesson.duration x 60(s)
      const totalTime = lesson.duration * 60 
      setTimeLeft(totalTime)
      // Cứ mỗi giây, setInterval giảm timeLeft đi 1
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { // Nếu thời gian còn lại dưới 1 thì hàm handleQuizComplete() được gọi để nộp bài tự động
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

  // Lấy dữ liệu của bài học dạng quiz nếu bài đã hoàn thành
  useEffect(() => {
    if (lesson?.lessonType === "quiz" && completedLessons.includes(lesson.lessonId)) {
      getQuizResultAPI(lesson.lessonId).then((result) => {
        if (result) {
          setQuizScore(result.score);
          setCorrectAnswer(result.correctAnswers);
          setQuizCompleted(true);
          setShowSubmitConfirm(false);
          setQuizResult(result);
        }
      });
    }
  }, [lesson, completedLessons]);

  // Hiển thị thời gian dưới dạng phút:giây
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
    setAnswerResults([]); // Reset kết quả khi bắt đầu lại bài quiz
  }
  // Ghi nhận câu trả lời với mỗi câu hỏi vd: {0:1 , 1:3, ...}
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers, // Các câu trả lời trước đó
      [questionIndex]: answerIndex, // Câu trả lời mới 
      
    })
    console.log("Ghi nhan: ",selectedAnswers);
  }
  // Chuyển sang câu hỏi tiếp theo
  const goToNextQuestion = () => {
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1) 
    } else {
      setShowSubmitConfirm(true)
    }
  }
  // Trở về câu hỏi trước đó
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Hoàn thành bài quiz
  const handleQuizComplete = async () => {
  try {
    const quizSubmitData = {
      lessonId: lesson.lessonId,
      answers: selectedAnswers // { quizId: selectedAnswer }
    };
    const result = await submitQuizAPI(quizSubmitData);
    console.log(" Bài kiểm tra đã được chấm điểm:", result);
    setQuizScore(result.score);
    setCorrectAnswer(result.correctAnswers);
    setQuizCompleted(true);
    setShowSubmitConfirm(false);
    // Lưu kết quả chi tiết từ API vào state
      setAnswerResults(result.answerResults);

    // Đánh dấu hoàn thành bài học
    if (onComplete) {
      onComplete(lesson.lessonId)
    }
  } catch (error) {
    console.error(" Lỗi khi nộp bài kiểm tra!", error);
  }
};

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
    return <QuizResult lesson={lesson} answerResults={answerResults} quizScore={quizScore} correctAnswer={correctAnswer} onRetry={startQuiz} />
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

