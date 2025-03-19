const QuizResult = ({ lesson, answerResults, quizScore, correctAnswer, onRetry }) => {
  if (!lesson || !lesson.questions) return null;

  if (!answerResults || answerResults.length === 0) {
    return (
          <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-2">Kết quả bài kiểm tra</h3>
        <div className="text-5xl font-bold text-primary mb-4">
          {correctAnswer}/{lesson.questions?.length}
        </div>
        <div className="text-lg">Điểm số: {quizScore}/10</div>
      </div>

      <div className="flex justify-center">
        <button onClick={onRetry} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
          Làm lại bài kiểm tra
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-2xl font-bold mb-2">Kết quả bài kiểm tra</h3>
        <div className="text-5xl font-bold text-primary mb-4">
          {correctAnswer}/{lesson.questions?.length}
        </div>
        <div className="text-lg">Điểm số: {quizScore}/10</div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Chi tiết bài làm</h3>

        {lesson.questions.map((question, qIdx) => {
          // Kiểm tra nếu answerResults[qIdx] không tồn tại
          const answerData = answerResults[qIdx] || {};
          console.log("Câu hỏi:", qIdx, "Dữ liệu answerResults:", answerData);

          return (
            <div key={qIdx} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">
                  Câu {qIdx + 1}: {question.question}
                </h4>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    answerData.selectedAnswer === answerData.correctAnswer
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {answerData.selectedAnswer === answerData.correctAnswer ? "Đúng" : "Sai"}
                </span>
              </div>

              {question.imageUrl && (
                <img
                  src={question.imageUrl || "/placeholder.svg"}
                  alt="Question"
                  className="mb-2 rounded-lg max-w-xs h-auto"
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {question.options.map((option, oIdx) => (
                  <div
                    key={oIdx}
                    className={`p-2 rounded ${
                      oIdx === answerData.correctAnswer
                        ? "bg-green-100 text-green-800"
                        : oIdx === answerData.selectedAnswer && oIdx !== answerData.correctAnswer
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100"
                    }`}
                  >
                    <span className="font-medium">{String.fromCharCode(65 + oIdx)}.</span> {option}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button onClick={onRetry} className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90">
          Làm lại bài kiểm tra
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
