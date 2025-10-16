// Hàm tính level từ stats
export const calculateLevel = (stats) => {
  if (!stats) return 1

  const {
    totalEnrolledCourses = 0,
    completedCourses = 0,
    totalLessonsCompleted = 0,
    totalQuizzesPassed = 0,
    totalStudyTimeMinutes = 0,
  } = stats

  // Công thức tính level dựa trên các hoạt động học tập
  let points = 0

  // Điểm từ khóa học hoàn thành (trọng số cao nhất)
  points += completedCourses * 100

  // Điểm từ khóa học đăng ký
  points += totalEnrolledCourses * 20

  // Điểm từ bài học hoàn thành
  points += totalLessonsCompleted * 10

  // Điểm từ quiz đã pass
  points += totalQuizzesPassed * 15

  // Điểm từ thời gian học (mỗi giờ = 5 điểm)
  points += Math.floor(totalStudyTimeMinutes / 60) * 5

  // Tính level (mỗi level cần 200 điểm, tối thiểu level 1)
  const level = Math.max(1, Math.floor(points / 200) + 1)

  return level
}

// Hàm tính phần trăm progress đến level tiếp theo
export const calculateLevelProgress = (stats) => {
  if (!stats) return 0

  const currentLevel = calculateLevel(stats)
  const pointsForCurrentLevel = (currentLevel - 1) * 200
  const pointsForNextLevel = currentLevel * 200

  // Tính lại total points
  const {
    totalEnrolledCourses = 0,
    completedCourses = 0,
    totalLessonsCompleted = 0,
    totalQuizzesPassed = 0,
    totalStudyTimeMinutes = 0,
  } = stats

  let totalPoints = 0
  totalPoints += completedCourses * 100
  totalPoints += totalEnrolledCourses * 20
  totalPoints += totalLessonsCompleted * 10
  totalPoints += totalQuizzesPassed * 15
  totalPoints += Math.floor(totalStudyTimeMinutes / 60) * 5

  const progressPoints = totalPoints - pointsForCurrentLevel
  const neededPoints = pointsForNextLevel - pointsForCurrentLevel

  return Math.min(100, Math.max(0, (progressPoints / neededPoints) * 100))
}

// Hàm convert response từ progress API thành format cho profile
export const convertProgressToProfileStats = (progressData) => {
  if (!progressData) return null

  return {
    totalEnrolledCourses: progressData.enrolledCoursesCount || 0,
    completedCourses: progressData.completedCoursesCount || 0,
    totalLessonsCompleted: progressData.completedLessonsCount || 0,
    totalQuizzesPassed: progressData.passedQuizzesCount || 0,
    totalStudyTimeMinutes: progressData.totalStudyTimeMinutes || 0,
    averageScore: progressData.averageQuizScore || 0,
    currentStreak: progressData.currentLearningStreak || 0,
    longestStreak: progressData.longestLearningStreak || 0,
  }
}

// Hàm format thời gian học
export const formatStudyTime = (minutes) => {
  if (minutes < 60) return `${minutes} phút`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  if (remainingMinutes === 0) return `${hours} giờ`
  return `${hours}g ${remainingMinutes}p`
}

// Hàm lấy title level
export const getLevelTitle = (level) => {
  if (level >= 50) return "Chuyên gia"
  if (level >= 30) return "Thành thạo"
  if (level >= 20) return "Nâng cao"
  if (level >= 10) return "Trung cấp"
  if (level >= 5) return "Cơ bản"
  return "Mới bắt đầu"
}

// Hàm lấy màu level
export const getLevelColor = (level) => {
  if (level >= 50) return "from-purple-500 to-pink-500"
  if (level >= 30) return "from-blue-500 to-purple-500"
  if (level >= 20) return "from-green-500 to-blue-500"
  if (level >= 10) return "from-yellow-500 to-green-500"
  if (level >= 5) return "from-orange-500 to-yellow-500"
  return "from-gray-400 to-gray-500"
}
