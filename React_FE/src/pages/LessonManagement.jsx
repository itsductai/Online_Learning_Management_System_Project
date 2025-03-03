import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import Sidebar from '../components/admin/Sidebar';
import LessonList from '../components/LessonList';
import AddLessonModal from '../components/admin/AddLessonModal';
import useLessons from '../hooks/useLessons';
import useCourses from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';

export default function LessonManagement() {
  const { courseId } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { courses } = useCourses();
  const { user } = useAuth();
  // const [currentCourse, setCurrentCourse] = useState(null);
  const currentCourse = courses.find(c => c.courseId === Number(courseId));


  const {
    lessons,
    loading,
    error,
    selectedLesson,
    setSelectedLesson,
    addLesson,
    updateLesson,
    deleteLesson
  } = useLessons(courseId);

  // useEffect(() => {
  //   const course = courses.find(c => c.courseId === courseId);
  //   setCurrentCourse(course);
  // }, [courseId, courses]);

  const handleSubmit = async (data) => {
    try {
      if (selectedLesson) {
        await updateLesson(selectedLesson.id, data);
      } else {
        await addLesson(data);
      }
      setIsModalOpen(false);
      setSelectedLesson(null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          {/* Course Info */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start gap-6">
              <div className="w-48 h-32 rounded-lg overflow-hidden">
                <img
                  src={currentCourse?.imageUrl || "/placeholder.svg"}
                  alt={currentCourse?.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentCourse?.title}
                </h1>
                <p className="text-gray-600 mb-4">{currentCourse?.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {lessons.length} bài học
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    currentCourse?.isPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {currentCourse?.isPaid 
                      ? `${currentCourse.price.toLocaleString()}đ` 
                      : 'Miễn phí'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Lessons List */}
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Danh sách bài học</h2>
                    <button
                      onClick={() => {
                        setSelectedLesson(null);
                        setIsModalOpen(true);
                      }}
                      className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition"
                    >
                      <FaPlus className="mr-2" />
                      Thêm bài học
                    </button>
                  </div>
                </div>

                <LessonList
                  lessons={lessons}
                  onLessonClick={setSelectedLesson}
                  onEditClick={(lesson) => {
                    setSelectedLesson(lesson);
                    setIsModalOpen(true);
                  }}
                  onDeleteClick={deleteLesson}
                  selectedLessonId={selectedLesson?.id}
                  showAdminActions={true}
                />
              </div>
            </div>

            {/* Lesson Detail */}
            <div className="col-span-12 lg:col-span-7">
              {selectedLesson ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">{selectedLesson.title}</h2>
                  
                  {selectedLesson.type === 'video' && (
                    <div className="relative w-full mb-4">
                      <div className="relative overflow-hidden" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src={selectedLesson.videoUrl}
                          className="absolute top-0 left-0 w-full h-full rounded-lg"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  )}

                  {selectedLesson.type === 'text' && (
                    <div className="prose max-w-none">
                      {selectedLesson.content}
                    </div>
                  )}

                  {selectedLesson.type === 'quiz' && (
                    <div className="space-y-4">
                      {selectedLesson.questions?.map((question, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h3 className="font-medium mb-3">
                            Câu {index + 1}: {question.question}
                          </h3>
                          {question.imageUrl && (
                            <img
                              src={question.imageUrl || "/placeholder.svg"}
                              alt="Question"
                              className="mb-3 rounded-lg max-w-sm"
                            />
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            {question.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-2 rounded ${
                                  optIndex === question.correctAnswer
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100'
                                }`}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
                  Chọn một bài học để xem chi tiết
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddLessonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLesson(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedLesson}
        courseId={courseId}
      />
    </div>
  );
}