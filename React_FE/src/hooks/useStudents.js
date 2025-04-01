import { useState, useEffect } from "react"
import { getAllStudentsAPI } from "../services/studentAPI"
import { getStudentProgressDetails } from "../services/progressAPI"

// Hook quản lý dữ liệu học viên
function useStudents() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const progressData = await getStudentProgressDetails()
        setStudents(progressData)
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
    loading,
    error,
  }
}

export default useStudents

