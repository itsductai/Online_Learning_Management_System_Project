import React, { useState, useEffect } from 'react';
import { FaTimes, FaImage, FaPlus, FaTrash } from 'react-icons/fa';

const AddLessonModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null,
  courseId 
}) => {
  const [formData, setFormData] = useState({
    courseId: {courseId},
    title: '',
    lessonType: 'video',
    duration: '',
    youtubeUrl: '',
    content: '',
  });

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    imageUrl: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.lessonType === 'quiz' && initialData.questions) {
        setQuizQuestions(initialData.questions);
      }
    }
  }, [initialData]);

  useEffect(() => {
    // Load câu hỏi đã save từ localStorage khi mở modalmodal
    if (formData.lessonType === 'quiz') {
      const savedQuestions = localStorage.getItem(`quiz_${courseId}`);
      if (savedQuestions) {
        setQuizQuestions(JSON.parse(savedQuestions));
      }
    }
  }, [courseId, formData.lessonType]);

  const validateQuizQuestion = () => {
    const errors = {};
    if (!currentQuestion.question.trim()) {
      errors.question = 'Vui lòng nhập câu hỏi';
    }
    currentQuestion.options.forEach((option, index) => {
      if (!option.trim()) {
        errors[`option${index}`] = `Vui lòng nhập đáp án ${String.fromCharCode(65 + index)}`;
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddQuestion = () => {
    if (!validateQuizQuestion()) return;

    const newQuestions = [...quizQuestions, currentQuestion];
    setQuizQuestions(newQuestions);
    localStorage.setItem(`quiz_${courseId}`, JSON.stringify(newQuestions));
    
    // Reset current question form
    setCurrentQuestion({
      question: '',
      imageUrl: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    setFormErrors({}); 
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = quizQuestions.filter((_, i) => i !== index);
    setQuizQuestions(newQuestions);
    localStorage.setItem(`quiz_${courseId}`, JSON.stringify(newQuestions));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Vui lòng nhập tên bài học';
    }
    if (formData.lessonType === 'video' && !formData.youtubeUrl) {
      errors.youtubeUrl = 'Vui lòng nhập URL video';
    }
    if (formData.lessonType === 'text' && !formData.content) {
      errors.content = 'Vui lòng nhập nội dung bài học';
    }
    if (formData.lessonType === 'quiz' && quizQuestions.length === 0) {
      errors.quiz = 'Vui lòng thêm ít nhất một câu hỏi';
    }
    if (!formData.duration) {
      errors.duration = 'Vui lòng nhập thời lượng bài học';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

  // Xử lý giá trị NULL thành chuỗi rỗng ""
  const addData = {
    title: formData.title ?? '',
    youtubeUrl: formData.youtubeUrl ?? '',
    content: formData.content ?? '',
    duration: formData.duration ?? '',
    lessonType: formData.lessonType ?? 'video', // Mặc định video nếu không có
    questions: formData.lessonType === 'quiz' ? quizQuestions : []
  };

  const updateData = {
        title: formData.title ?? '',
        lessonType: formData.lessonType,
        youtubeUrl: formData.youtubeUrl ?? '',
        content: formData.content ?? '',
        duration: formData.duration,
        questions: formData.lessonType === 'quiz' ? quizQuestions : []
  }

  const submitData = initialData ? updateData : addData;

    onSubmit(submitData);
    
    // XóaXóa localStorage sau khi submit thành công 
    if (formData.lessonType === 'quiz') {
      localStorage.removeItem(`quiz_${courseId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {initialData ? 'Chỉnh sửa bài học' : 'Thêm bài học mới'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Tên bài học */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên bài học
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            {/* Loại bài học */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại bài học
              </label>
              <select
                value={formData.lessonType}
                onChange={(e) => setFormData({ ...formData, lessonType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="video">Video</option>
                <option value="text">Bài đọc</option>
                <option value="quiz">Trắc nghiệm</option>
              </select>
            </div>

            {/* Video URL */}
            {formData.lessonType === 'video' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Video
                </label>
                <input
                  type="url"
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập URL video YouTube"
                />
                {formErrors.youtubeUrl && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.youtubeUrl}</p>
                )}
              </div>
            )}

            {/* Nội dung bài đọc */}
            {formData.lessonType === 'text' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung bài học
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                ></textarea>
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                )}
              </div>
            )}

            {/* Quiz Questions */}
            {formData.lessonType === 'quiz' && (
              <div className="space-y-6">
                {/* Danh sách câu hỏi đã thêm */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Danh sách câu hỏi</h3>
                    <span className="text-sm text-gray-500">
                      {quizQuestions.length} câu hỏi
                    </span>
                  </div>

                  <div className="space-y-4">
                    {quizQuestions.map((question, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium">Câu {idx + 1}</h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-900 mb-2">{question.question}</p>
                        {question.imageUrl && (
                          <img
                            src={question.imageUrl}
                            alt="Question"
                            className="mb-2 rounded-lg max-w-xs"
                          />
                        )}
                        <div className="grid grid-cols-2 gap-2">
                          {question.options.map((opt, optIdx) => (
                            <div
                              key={optIdx}
                              className={`p-2 rounded ${
                                optIdx === question.correctAnswer
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form thêm câu hỏi mới */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-4">Thêm câu hỏi mới</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Câu hỏi
                      </label>
                      <input
                        type="text"
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion,
                          question: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {formErrors.question && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.question}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hình ảnh (nếu có)
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="url"
                          value={currentQuestion.imageUrl}
                          onChange={(e) => setCurrentQuestion({
                            ...currentQuestion,
                            imageUrl: e.target.value
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Nhập URL hình ảnh"
                        />
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-primary"
                        >
                          <FaImage className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {currentQuestion.options.map((option, idx) => (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Đáp án {String.fromCharCode(65 + idx)}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[idx] = e.target.value;
                            setCurrentQuestion({
                              ...currentQuestion,
                              options: newOptions
                            });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        {formErrors[`option${idx}`] && (
                          <p className="mt-1 text-sm text-red-600">{formErrors[`option${idx}`]}</p>
                        )}
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đáp án đúng
                      </label>
                      <select
                        value={currentQuestion.correctAnswer}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {currentQuestion.options.map((_, idx) => (
                          <option key={idx} value={idx}>
                            {String.fromCharCode(65 + idx)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
                    >
                      <FaPlus className="inline-block mr-2" />
                      Thêm câu hỏi này
                    </button>
                  </div>
                </div>

                {formErrors.quiz && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.quiz}</p>
                )}
              </div>
            )}

            {/* Thời lượng */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="VD: 10 hoặc 120"
              />
              {formErrors.duration && (
                <p className="mt-1 text-sm text-red-600">{formErrors.duration}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90"
            >
              {initialData ? 'Lưu thay đổi' : 'Thêm bài học'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLessonModal;