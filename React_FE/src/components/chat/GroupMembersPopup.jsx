"use client"

import { useState, useEffect } from "react"
import { X, Users, UserPlus, UserMinus, ChevronDown, ChevronRight, Search, Plus, Crown, Shield } from "lucide-react"
import { getGroupMembersMini, addGroupMembers, kickGroupMember, searchPeopleForGroup } from "../../services/profileAPI"
import { useAuth } from "../../context/AuthContext"
import UserProfilePopup from "./UserProfilePopup"

const GroupMembersPopup = ({ conversationId, onClose }) => {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedMembers, setExpandedMembers] = useState(new Set())
  const [myRole, setMyRole] = useState(null) // "Admin" hoặc "Member"
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)

  // Add member modal states
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searching, setSearching] = useState(false)
  const [adding, setAdding] = useState(false)

  // Computed properties
  const isAdmin = myRole === "Admin"
  const canManageMembers = isAdmin

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setLoading(true)
        setError(null)

        // Gọi API mới có myRole và memberRole
        const res = await getGroupMembersMini(conversationId)
        const data = res.data || res // Handle different response structures

        console.log("Group members data:", data)

        setMembers(data.items || [])
        setMyRole(data.myRole || "Member") // Set role từ response

        console.log("My role in group:", data.myRole)
        console.log("Can manage members:", data.myRole === "Admin")
      } catch (err) {
        console.error("Lỗi khi tải danh sách thành viên:", err)
        setError("Có lỗi xảy ra khi tải danh sách thành viên")
      } finally {
        setLoading(false)
      }
    }

    if (conversationId) {
      loadMembers()
    }
  }, [conversationId])

  const toggleMemberExpansion = (userId) => {
    const newExpanded = new Set(expandedMembers)
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId)
    } else {
      newExpanded.add(userId)
    }
    setExpandedMembers(newExpanded)
  }

  const handleKickMember = async (userId, userName) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${userName} khỏi nhóm?`)) {
      return
    }

    try {
      await kickGroupMember(conversationId, userId)
      // Reload danh sách thành viên sau khi kick thành công
      const res = await getGroupMembersMini(conversationId)
      const data = res.data || res
      setMembers(data.items || [])
    } catch (err) {
      console.error("Lỗi khi kick thành viên:", err)
      // Error đã được handle trong profileAPI.js
    }
  }

  const handleSearchUsers = async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      setSearching(true)
      const res = await searchPeopleForGroup(query.trim())
      // Loại bỏ những người đã là thành viên
      const memberIds = new Set(members.map((m) => m.userId))
      const filteredResults = (res.data || []).filter((u) => !memberIds.has(u.userId))
      setSearchResults(filteredResults)
    } catch (err) {
      console.error("Lỗi khi tìm kiếm:", err)
      // Error đã được handle trong profileAPI.js
    } finally {
      setSearching(false)
    }
  }

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u.userId === user.userId)
      return exists ? prev.filter((u) => u.userId !== user.userId) : [...prev, user]
    })
  }

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) return

    try {
      setAdding(true)
      const memberIds = selectedUsers.map((u) => u.userId)
      await addGroupMembers(conversationId, memberIds)

      // Reload danh sách thành viên sau khi thêm thành công
      const res = await getGroupMembersMini(conversationId)
      const data = res.data || res
      setMembers(data.items || [])

      // Reset modal state
      setShowAddModal(false)
      setSearchQuery("")
      setSearchResults([])
      setSelectedUsers([])
    } catch (err) {
      console.error("Lỗi khi thêm thành viên:", err)
      // Error đã được handle trong profileAPI.js
    } finally {
      setAdding(false)
    }
  }

  const renderMemberRole = (memberRole) => {
    if (memberRole === "Admin") {
      return (
        <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
          <Crown className="w-3 h-3" />
          <span>Trưởng nhóm</span>
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
        <Shield className="w-3 h-3" />
        <span>Thành viên</span>
      </div>
    )
  }

  const renderMemberMiniInfo = (member) => {
    const isMe = member.userId === user?.userId
    const level = member.level || 1
    const levelProgress = Math.min(100, level * 10)
    const canKickThisMember = canManageMembers && !isMe && member.memberRole !== "Admin"

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-3">
        {/* Role Badge */}
        <div className="flex justify-center">{renderMemberRole(member.memberRole)}</div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center">
            <div className="text-sm font-bold text-blue-900">{member.stats?.totalEnrolledCourses || 0}</div>
            <div className="text-xs text-blue-600">Đã đăng ký</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-green-900">{member.stats?.completedCourses || 0}</div>
            <div className="text-xs text-green-600">Hoàn thành</div>
          </div>
        </div>

        {/* Level */}
        <div className="bg-white p-2 rounded">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Cấp độ</span>
            <span className="text-sm font-bold text-orange-600">{level}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full"
              style={{ width: `${levelProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Top Courses */}
        {member.topCourses && member.topCourses.length > 0 && (
          <div>
            <div className="text-xs font-medium text-gray-700 mb-2">Khóa học nổi bật</div>
            <div className="space-y-1">
              {member.topCourses.slice(0, 2).map((course) => (
                <div key={course.courseId} className="flex items-center gap-2 text-xs">
                  <img
                    src={course.imageUrl || "/placeholder.svg?height=20&width=20"}
                    alt={course.title}
                    className="w-5 h-5 rounded object-cover"
                  />
                  <span className="flex-1 truncate">{course.title}</span>
                  {course.isCompleted ? (
                    <span className="text-green-600">✓</span>
                  ) : (
                    <span className="text-blue-600">{course.progressPercent}%</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedProfile(member.userId)}
            className="flex-1 text-xs bg-primary text-white py-1 px-2 rounded hover:bg-opacity-90"
          >
            Xem chi tiết
          </button>
          {canKickThisMember && (
            <button
              onClick={() => handleKickMember(member.userId, member.name)}
              className="text-xs bg-red-100 text-red-600 py-1 px-2 rounded hover:bg-red-200"
            >
              Xóa
            </button>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
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

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Thành viên nhóm ({members.length})</h3>
              {myRole && (
                <div className="text-xs text-gray-500">({myRole === "Admin" ? "Trưởng nhóm" : "Thành viên"})</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {canManageMembers && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Thêm thành viên"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Members List */}
          <div className="overflow-y-auto max-h-96 p-4">
            <div className="space-y-2">
              {members.map((member) => {
                const isExpanded = expandedMembers.has(member.userId)
                const isMe = member.userId === user?.userId

                return (
                  <div key={member.userId} className="border border-gray-200 rounded-lg">
                    <div
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50"
                      onClick={() => toggleMemberExpansion(member.userId)}
                    >
                      <img
                        src={member.avatarUrl || "/placeholder.svg?height=40&width=40"}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">
                            {member.name} {isMe && "(Bạn)"}
                          </span>
                          {member.memberRole === "Admin" && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.role === "Student"
                            ? "Học viên"
                            : member.role === "Instructor"
                              ? "Giảng viên"
                              : "Quản trị"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {canManageMembers && !isMe && member.memberRole !== "Admin" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleKickMember(member.userId, member.name)
                            }}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                            title="Xóa thành viên"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        )}
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && renderMemberMiniInfo(member)}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add Members Modal - chỉ hiển thị nếu là Admin */}
      {showAddModal && canManageMembers && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="text-lg font-semibold">Thêm thành viên</h4>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleSearchUsers(e.target.value)
                  }}
                  placeholder="Tìm theo tên hoặc email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Search Results */}
              {searching && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                  {searchResults.map((user) => {
                    const isSelected = selectedUsers.some((u) => u.userId === user.userId)
                    return (
                      <div
                        key={user.userId}
                        className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                          isSelected ? "bg-primary/10" : "hover:bg-gray-50"
                        }`}
                        onClick={() => toggleUserSelection(user)}
                      >
                        <img
                          src={user.avatarUrl || "/placeholder.svg?height=32&width=32"}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.role || "Học viên"}</div>
                        </div>
                        {isSelected ? (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        ) : (
                          <Plus className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Selected Users */}
              {selectedUsers.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Đã chọn ({selectedUsers.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user) => (
                      <div
                        key={user.userId}
                        className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        <img
                          src={user.avatarUrl || "/placeholder.svg?height=20&width=20"}
                          alt={user.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{user.name}</span>
                        <button
                          onClick={() => toggleUserSelection(user)}
                          className="text-primary hover:text-primary/80"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddMembers}
                disabled={selectedUsers.length === 0 || adding}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? "Đang thêm..." : `Thêm (${selectedUsers.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Popup */}
      {selectedProfile && <UserProfilePopup userId={selectedProfile} onClose={() => setSelectedProfile(null)} />}
    </>
  )
}

export default GroupMembersPopup
