import { useState, useEffect } from "react"
import { getAllStudentsAPI } from "../services/studentAPI"
import { getAdminQuizResultsAPI } from "../services/quizAPI"
import { getUserProgressStats } from "../services/progressAPI"

// Hook quản lý dữ liệu học viên
function useStudents() {
  const [students, setStudents] = useState([])
  const [quizResults, setQuizResults] = useState([])
  const [progressStats, setProgressStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch students data
        const studentsData = await getAllStudentsAPI()
        setStudents(studentsData)

        // Fetch quiz results
        const quizData = await getAdminQuizResultsAPI()
        setQuizResults(quizData)

        // Fetch progress stats
        const progressData = await getUserProgressStats()
        setProgressStats(progressData)
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu học viên:", err)
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    students,
    quizResults,
    progressStats,
    loading,
    error,
  }
}

export default useStudents

