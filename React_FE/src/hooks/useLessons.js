import { useState, useEffect } from "react";
import {
  getLessonsByCourseId,
  addLessonAPI,
  updateLessonAPI,
  deleteLessonAPI,
} from "../services/lessonAPI";

import {
  addQuizAPI,
  updateQuizAPI,
  deleteQuizAPI
} from "../services/quizAPI";

function useLessons(courseId) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchLessons();
    }
  }, [courseId]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const data = await getLessonsByCourseId(courseId);
      if (Array.isArray(data)) {
        setLessons(data);
      } else {
        console.error("API trả về dữ liệu không hợp lệ:", data);
        setLessons([]);
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách bài học");
    } finally {
      setLoading(false);
    }
  };

  const addLesson = async (lessonData) => {
    try {
      setLoading(true);
      if (lessonData.type === 'quiz') {
        await addQuizAPI(courseId, lessonData);
      } else {
        await addLessonAPI(courseId, lessonData);
      }
      await fetchLessons();
    } catch (err) {
      setError("Lỗi khi thêm bài học");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (lessonId, lessonData) => {
    try {
      setLoading(true);
      if (lessonData.type === 'quiz') {
        await updateQuizAPI(courseId, lessonId, lessonData);
      } else {
        await updateLessonAPI(lessonId, lessonData);
      }
      await fetchLessons();
    } catch (err) {
      setError("Lỗi khi cập nhật bài học");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (lessonId, type) => {
    try {
      setLoading(true);
      if (type === 'quiz') {
        await deleteQuizAPI(courseId, lessonId);
      } else {
        await deleteLessonAPI(lessonId);
      }
      await fetchLessons();
      setSelectedLesson(null);
    } catch (err) {
      setError("Lỗi khi xóa bài học");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lessons,
    loading,
    error,
    selectedLesson,
    setSelectedLesson,
    addLesson,
    updateLesson,
    deleteLesson,
    fetchLessons
  };
}

export default useLessons;