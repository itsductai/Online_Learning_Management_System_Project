import { FaArrowLeft, FaArrowRight } from "react-icons/fa"

const QuizQuestion = ({
  lesson,
  currentQuestionIndex,
  selectedAnswers,
  timeLeft,
  showSubmitConfirm,
  formatTime,
  onAnswerSelect,
  onNextQuestion,
  onPrevQuestion,
  onSubmitConfirm,
  onCancelSubmit,
  onSubmitQuiz,
}) => {
  if (!lesson || !lesson.questions) return null

  const currentQuestion = lesson.questions[currentQuestionIndex]

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
        <span className="font-medium">Thời gian còn lại: {formatTime(timeLeft)}</span>
        <span className="font-medium">
          Câu {currentQuestionIndex + 1}/{lesson.questions?.length}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

        {currentQuestion.imageUrl && (
          <img
            src={currentQuestion.imageUrl || "/placeholder.svg"}
            alt="Question"
            className="mb-4 rounded-lg max-w-full h-auto"
          />
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => onAnswerSelect(currentQuestionIndex, idx)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedAnswers[currentQuestionIndex] === idx
                  ? "bg-primary-50 border-primary"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentQuestionIndex === 0
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaArrowLeft className="mr-2" /> Câu trước
        </button>

        <div className="flex space-x-2">
          {lesson.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => onAnswerSelect(idx, selectedAnswers[idx])}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentQuestionIndex === idx
                  ? "bg-primary text-white"
                  : selectedAnswers[idx] !== undefined
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={onNextQuestion}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
        >
          {currentQuestionIndex === lesson.questions.length - 1 ? "Hoàn thành" : "Câu tiếp"}{" "}
          <FaArrowRight className="ml-2" />
        </button>
      </div>

      {/* Confirm Submit Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Xác nhận nộp bài</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn nộp bài kiểm tra? Bạn đã trả lời {Object.keys(selectedAnswers).length}/
              {lesson.questions?.length} câu hỏi.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={onCancelSubmit} className="px-4 py-2 border border-gray-300 rounded-lg">
                Quay lại
              </button>
              <button onClick={onSubmitQuiz} className="px-4 py-2 bg-primary text-white rounded-lg">
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizQuestion

