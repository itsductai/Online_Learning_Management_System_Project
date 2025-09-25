"use client"

import { useState, useEffect } from "react"
import { X, MessageCircle, UserPlus, Calendar, Award, BookOpen, Clock, Target, TrendingUp } from "lucide-react"
import { getMiniProfile, getFriendshipStatus, getLearningStreak } from "../../services/profileAPI"
import {
  calculateLevel,
  calculateLevelProgress,
  getLevelTitle,
  getLevelColor,
  formatStudyTime,
} from "../../utils/levelCalculator"
import { createDirect } from "../../services/chatAPI"

const UserProfilePopup = ({ userId, onClose, onStartChat }) => {
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

        // Load profile data
        const [profileRes, friendshipRes, streakRes] = await Promise.all([
          getMiniProfile(userId),
          getFriendshipStatus(userId),
          getLearningStreak(userId, 12), // 12 weeks for popup
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
      const res = await createDirect(userId)
      const conversation = res.data
      onStartChat && onStartChat(conversation)
      onClose()
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", error)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 text-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-red-600">Lỗi</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const level = calculateLevel(profile.stats)
  const levelProgress = calculateLevelProgress(profile.stats)
  const levelTitle = getLevelTitle(level)
  const levelColor = getLevelColor(level)

  // Render mini heatmap
  const renderMiniHeatmap = () => {
    if (!streak?.days) return null

    const weeks = []
    const days = streak.days.slice(-84) // Last 12 weeks

    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    return (
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-700 mb-2">Hoạt động học tập (12 tuần)</div>
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => {
                const intensity = day.value
                let bgColor = "bg-gray-100"
                if (intensity === 1) bgColor = "bg-green-200"
                else if (intensity === 2) bgColor = "bg-green-400"
                else if (intensity >= 3) bgColor = "bg-green-600"

                return (
                  <div
                    key={dayIndex}
                    className={`w-2 h-2 rounded-sm ${bgColor}`}
                    title={`${day.date}: ${intensity} hoạt động`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header với gradient */}
        <div className={`bg-gradient-to-r ${levelColor} p-6 text-white relative`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <img
              src={profile.avatarUrl || "/placeholder.svg?height=64&width=64"}
              alt={profile.name}
              className="w-16 h-16 rounded-full border-4 border-white/20 object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-white/90 text-sm">
                {profile.role === "Student" ? "Học viên" : profile.role === "Instructor" ? "Giảng viên" : "Quản trị"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Cấp {level} - {levelTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Level progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span>Tiến độ level</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-blue-900">{profile.stats?.totalEnrolledCourses || 0}</div>
              <div className="text-xs text-blue-600">Khóa học</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-green-900">{profile.stats?.completedCourses || 0}</div>
              <div className="text-xs text-green-600">Hoàn thành</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-purple-900">
                {formatStudyTime(profile.stats?.totalStudyTimeMinutes || 0)}
              </div>
              <div className="text-xs text-purple-600">Thời gian học</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-1" />
              <div className="text-lg font-bold text-orange-900">{profile.stats?.currentStreak || 0}</div>
              <div className="text-xs text-orange-600">Ngày liên tiếp</div>
            </div>
          </div>

          {/* Top Courses */}
          {profile.topCourses && profile.topCourses.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Khóa học nổi bật</h4>
              <div className="space-y-2">
                {profile.topCourses.slice(0, 3).map((course) => (
                  <div key={course.courseId} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <img
                      src={course.imageUrl || "/placeholder.svg?height=32&width=32"}
                      alt={course.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{course.title}</div>
                      <div className="text-xs text-gray-500">
                        {course.isCompleted ? (
                          <span className="text-green-600 font-medium">✓ Hoàn thành</span>
                        ) : (
                          <span className="text-blue-600">{course.progressPercent}% hoàn thành</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mini Heatmap */}
          {renderMiniHeatmap()}

          {/* Friendship Status */}
          {friendship && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              {friendship.areFriends ? (
                <span>Bạn bè từ {new Date(friendship.since).toLocaleDateString("vi-VN")}</span>
              ) : (
                <span>Chưa kết bạn</span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleStartChat}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            Nhắn tin
          </button>
          <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
            <UserPlus className="w-4 h-4" />
            Kết bạn
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProfilePopup
