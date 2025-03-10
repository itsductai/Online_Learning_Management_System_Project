import React from 'react';
import { FaPlay, FaFileAlt, FaQuestionCircle, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const LessonList = ({ 
  lessons, 
  onLessonClick, 
  onEditClick, 
  onDeleteClick,
  selectedLessonId,
  showAdminActions = false
}) => {
  const { user } = useAuth();

  const getLessonTypeIcon = (lessonType) => {
    switch (lessonType) {
      case 'video':
        return <FaPlay className="text-blue-500" />;
      case 'text':
        return <FaFileAlt className="text-green-500" />;
      case 'quiz':
        return <FaQuestionCircle className="text-purple-500" />;
      default:
        return null;
    }
  };

  console.log("showAdminActions:", showAdminActions);
console.log("User role:", user?.role);


  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="divide-y divide-gray-200">
        {lessons.map((lesson, index) => (
          <div 
            key={lesson.id}
            className={`group p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedLessonId === lesson.id ? 'bg-gray-50' : ''
            }`}
            onClick={() => onLessonClick(lesson)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {lesson.title}
                  </h3>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-sm text-gray-500">
                      {getLessonTypeIcon(lesson.lessonType)}
                      <span className="ml-2">
                        {lesson.lessonType === 'video' ? 'Video' : 
                         lesson.lessonType === 'text' ? 'Bài đọc' : 
                         'Trắc nghiệm'}
                      </span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {lesson.duration} phút
                    </span>
                  </div>
                </div>
              </div>

              {showAdminActions && user?.role === 'Admin' && (
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Đang chỉnh sửa bài học:", lesson);  // Kiểm tra xem lesson có đầy đủ thông tin không
                      onEditClick(lesson);
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
                        onDeleteClick(lesson.lessonId);
                      }
                    }}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonList;