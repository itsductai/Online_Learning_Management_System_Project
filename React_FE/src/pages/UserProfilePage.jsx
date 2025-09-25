"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  MessageCircle,
  UserPlus,
  Calendar,
  Award,
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react"
import { getFullProfile, getFriendshipStatus, getLearningStreak } from "../services/profileAPI"
import {
  calculateLevel,
  calculateLevelProgress,
  getLevelTitle,
  getLevelColor,
  formatStudyTime,
} from "../utils/levelCalculator"
import { createDirect } from "../services/chatAPI"
import Navbar from "../components/NavBar"
import Footer from "../components/Footer"

export default function UserProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [friendship, setFriendship] = useState(null)
  const [streak, setStreak] = useState(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load full profile data
        const [profileRes, friendshipRes, streakRes] = await Promise.all([
          getFullProfile(userId),
          getFriendshipStatus(userId),
          getLearningStreak(userId, 53), // Full year for profile page
        ])

        setProfile(profileRes.data)
        setFriendship(friendshipRes.data)
        setStreak(streakRes.data)
      } catch (err) {
        console.error("Lỗi khi tải profile:", err)
        setError("Không thể tải thông tin người dùng")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadProfile()
    }
  }, [userId])

  const handleStartChat = async () => {
    try {
      const res = await createDirect(Number.parseInt(userId))
      navigate("/chat")
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", error)
    }
  }

  const renderHeatmap = () => {
    if (!streak?.days) return null

    const weeks = []
    const days = streak.days

    // Group days into weeks (7 days each)
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    const monthLabels = ["Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12"]

    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động học tập trong năm</h3>
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => {
                  const intensity = day.value
                  let bgColor = "bg-gray-100"
                  let title = `${day.date}: Không có hoạt động`

                  if (intensity === 1) {
                    bgColor = "bg-green-200"
                    title = `${day.date}: Ít hoạt động`
                  } else if (intensity === 2) {
                    bgColor = "bg-green-400"
                    title = `${day.date}: Hoạt động vừa phải`
                  } else if (intensity >= 3) {
                    bgColor = "bg-green-600"
                    title = `${day.date}: Hoạt động nhiều`
                  }

                  return (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm ${bgColor} hover:ring-2 hover:ring-gray-300 cursor-pointer transition-all`}
                      title={title}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {monthLabels.map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <span>Ít</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
            <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
          </div>
          <span>Nhiều</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 shadow-md text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải thông tin</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!profile) return null

  const level = calculateLevel(profile.stats)
  const levelProgress = calculateLevelProgress(profile.stats)
  const levelTitle = getLevelTitle(level)
  const levelColor = getLevelColor(level)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Profile Header */}
        <div className={`bg-gradient-to-r ${levelColor} rounded-lg p-8 text-white shadow-lg mb-8`}>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={profile.avatarUrl || "/placeholder.svg?height=96&width=96"}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-white/90 text-lg mb-2">
                {profile.role === "Student" ? "Học viên" : profile.role === "Instructor" ? "Giảng viên" : "Quản trị"}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <Award className="w-6 h-6" />
                <span className="text-xl font-semibold">
                  Cấp {level} - {levelTitle}
                </span>
              </div>

              {/* Level Progress */}
              <div className="max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Tiến độ level</span>
                  <span>{Math.round(levelProgress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleStartChat}
                className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Nhắn tin
              </button>
              <button className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors font-medium">
                <UserPlus className="w-5 h-5" />
                Kết bạn
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-900 mb-1">{profile.stats?.totalEnrolledCourses || 0}</div>
            <div className="text-blue-600 font-medium">Khóa học đăng ký</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-900 mb-1">{profile.stats?.completedCourses || 0}</div>
            <div className="text-green-600 font-medium">Khóa học hoàn thành</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Clock className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-900 mb-1">
              {formatStudyTime(profile.stats?.totalStudyTimeMinutes || 0)}
            </div>
            <div className="text-purple-600 font-medium">Thời gian học</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-orange-900 mb-1">{profile.stats?.currentStreak || 0}</div>
            <div className="text-orange-600 font-medium">Ngày liên tiếp</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Heatmap */}
            {renderHeatmap()}

            {/* Courses */}
            {profile.courses && profile.courses.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Khóa học ({profile.courses.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.courses.map((course) => (
                    <div
                      key={course.courseId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={course.imageUrl || "/placeholder.svg?height=60&width=60"}
                          alt={course.title}
                          className="w-15 h-15 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{course.title}</h4>
                          <p className="text-sm text-gray-500 mb-2">{course.instructorName}</p>
                          {course.isCompleted ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <Trophy className="w-4 h-4" />
                              <span className="text-sm font-medium">Hoàn thành</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-gray-600">Tiến độ</span>
                                <span className="font-medium">{course.progressPercent}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${course.progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {profile.achievements && profile.achievements.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thành tích</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{achievement.title}</div>
                        <div className="text-sm text-gray-600">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê nhanh</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Điểm trung bình</span>
                  <span className="font-semibold text-gray-900">{profile.stats?.averageScore || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bài học hoàn thành</span>
                  <span className="font-semibold text-gray-900">{profile.stats?.totalLessonsCompleted || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quiz đã làm</span>
                  <span className="font-semibold text-gray-900">{profile.stats?.totalQuizzesPassed || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Chuỗi dài nhất</span>
                  <span className="font-semibold text-gray-900">{profile.stats?.longestStreak || 0} ngày</span>
                </div>
              </div>
            </div>

            {/* Friendship Status */}
            {friendship && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng kết bạn</h3>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  {friendship.areFriends ? (
                    <span className="text-green-600">
                      Bạn bè từ {new Date(friendship.since).toLocaleDateString("vi-VN")}
                    </span>
                  ) : (
                    <span className="text-gray-600">Chưa kết bạn</span>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {profile.recentActivity && profile.recentActivity.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
                <div className="space-y-3">
                  {profile.recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <div>
                        <div className="text-gray-900">{activity.description}</div>
                        <div className="text-gray-500">{new Date(activity.createdAt).toLocaleDateString("vi-VN")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
