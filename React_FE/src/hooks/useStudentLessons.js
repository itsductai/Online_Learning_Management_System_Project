"use client"

import { useState, useEffect } from "react"
import { getLessonsByCourseId } from "../services/lessonAPI"

// Hook này là phiên bản đơn giản hóa của useLessons dành riêng cho học sinh
function useStudentLessons(courseId) {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedLesson, setSelectedLesson] = useState(null)

  useEffect(() => {
    if (courseId) {
      fetchLessons()
    }
  }, [courseId])

  const fetchLessons = async () => {
    try {
      setLoading(true)
      const data = await getLessonsByCourseId(courseId)
      if (Array.isArray(data)) {
        setLessons(data)
        // Nếu có bài học và chưa chọn bài học nào, chọn bài đầu tiên
        if (data.length > 0 && !selectedLesson) {
          setSelectedLesson(data[0])
        }
      } else {
        console.error("API trả về dữ liệu không hợp lệ:", data)
        setLessons([])
      }
    } catch (err) {
      setError("Lỗi khi tải danh sách bài học")
    } finally {
      setLoading(false)
    }
    console.log("🔍 Dữ liệu lessons trong useStudentLessons:", lessons);

  }

  return {
    lessons, // Truyền lesson từ api
    loading,
    error,
    selectedLesson, // Truyền trạng thái chọn 1 lesson
    setSelectedLesson, // Truyền hàm set trạng thái chọn 1 lesson
    fetchLessons,
  }
}

export default useStudentLessons

