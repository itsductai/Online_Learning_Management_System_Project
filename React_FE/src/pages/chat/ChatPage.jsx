"use client"

import { useEffect, useRef, useState } from "react"
import {
  getMyConversations,
  getMessages,
  searchPeople,
  createDirect,
  leaveConversation,
  createGroup,
  markConversationRead,
} from "../../services/chatAPI"
import {
  joinConversation,
  sendMessage,
  onMessage,
  onTyping,
  sendTyping,
  onConversationUpserted,
  onConversationRemoved,
  onMessageRead,
} from "../../services/chatHub"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../../components/NavBar"
import Footer from "../../components/Footer"
import { Search, Plus, Send, Users, MessageCircle, Phone, Video, UserPlus, LogOut, X, Clock } from "lucide-react"
import { useUnread } from "../../context/UnreadContext"
import UserProfilePopup from "../../components/chat/UserProfilePopup"
import GroupMembersPopup from "../../components/chat/GroupMembersPopup"

export default function ChatPage() {
  // Lấy thông tin user hiện tại từ context xác thực
  const { user } = useAuth()
  const myId = user?.userId

  // State chính quản lý dữ liệu chat
  const [cons, setCons] = useState([]) // Danh sách cuộc trò chuyện với thông tin unreadCount
  const [active, setActive] = useState(null) // Cuộc trò chuyện đang được chọn
  const [msgs, setMsgs] = useState([]) // Danh sách tin nhắn của cuộc trò chuyện hiện tại
  const [text, setText] = useState("") // Nội dung tin nhắn đang soạn
  const { setFromConversations, setConversationUnread, getUnreadFor } = useUnread()

  // State cho tính năng tìm kiếm người dùng để chat trực tiếp
  const [query, setQuery] = useState("") // Từ khóa tìm kiếm
  const [results, setResults] = useState([]) // Kết quả tìm kiếm

  // State quản lý typing indicator (hiển thị ai đang gõ)
  const [typingUsers, setTypingUsers] = useState([]) // Danh sách người đang gõ
  const typingTimersRef = useRef({}) // Ref lưu trữ timer để clear typing status

  // Chức năng mới: State quản lý read receipts (ai đã đọc tin nhắn)
  const [readReceipts, setReadReceipts] = useState({}) // {messageId: [{userId, name, readAt}]}

  // State cho tính năng phân trang tin nhắn (load tin nhắn cũ hơn)
  const [hasMore, setHasMore] = useState(true) // Còn tin nhắn cũ hơn để load không
  const scrollRef = useRef(null) // Ref cho container scroll tin nhắn
  const topSentinelRef = useRef(null) // Ref cho element trigger load more

  // Refs để unsubscribe các event listener của SignalR Hub
  const unsubMessageRef = useRef(null)
  const unsubTypingRef = useRef(null)
  const unsubUpsertRef = useRef(null)
  const unsubRemoveRef = useRef(null)
  const unsubReadRef = useRef(null) // Chức năng mới: Unsubscribe MessageRead event

  // State cho modal tạo nhóm
  const [showCreate, setShowCreate] = useState(false)
  const [groupTitle, setGroupTitle] = useState("")
  const [memberQuery, setMemberQuery] = useState("")
  const [memberResult, setMemberResult] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  // Chức năng mới: State cho profile popups
  const [showUserProfile, setShowUserProfile] = useState(null)
  const [showGroupMembers, setShowGroupMembers] = useState(null)

  // Chức năng mới: Hàm format thời gian relative cho preview tin nhắn
  const formatRelativeTime = (dateString) => {
    const now = new Date()
    const messageTime = new Date(dateString)
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ`
    return `${Math.floor(diffInMinutes / 1440)} ngày`
  }

  // Chức năng mới: Hàm cắt nội dung tin nhắn cho preview
  const truncateMessage = (content, maxLength = 40) => {
    if (!content) return ""
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content
  }

  // Hàm tìm kiếm người dùng để chat trực tiếp
  const doSearch = async (q) => {
    setQuery(q)
    // Chỉ tìm kiếm khi có ít nhất 2 ký tự
    if (q.trim().length < 2) return setResults([])

    try {
      const res = await searchPeople(q.trim())
      setResults(res.data || [])
    } catch (error) {
      console.error("Lỗi khi tìm kiếm người dùng:", error)
      setResults([])
    }
  }

  // Hàm bắt đầu chat trực tiếp với một người
  const startChatWith = async (person) => {
    try {
      const res = await createDirect(person.userId)
      const conv = res.data

      // Thêm cuộc trò chuyện mới vào danh sách nếu chưa có (optimistic update)
      setCons((prev) => (prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]))
      setActive(conv) // Chọn cuộc trò chuyện vừa tạo

      // Reset form tìm kiếm
      setQuery("")
      setResults([])
    } catch (error) {
      console.error("Lỗi khi tạo cuộc trò chuyện trực tiếp:", error)
    }
  }

  // Chức năng mới: Hàm xử lý khi click vào header để mở popup
  const handleHeaderClick = () => {
    if (!active) return

    if (active.type === "Direct" && active.otherUser) {
      setShowUserProfile(active.otherUser.userId)
    } else if (active.type === "Group") {
      setShowGroupMembers(active.id)
    }
  }

  // Chức năng mới: Hàm xử lý khi click vào tên người gửi tin nhắn
  const handleSenderClick = (senderId) => {
    if (senderId !== myId) {
      setShowUserProfile(senderId)
    }
  }

  // Chức năng mới: Hàm xử lý khi bắt đầu chat từ profile popup
  const handleStartChatFromProfile = (conversation) => {
    setCons((prev) => (prev.some((c) => c.id === conversation.id) ? prev : [conversation, ...prev]))
    setActive(conversation)
    setShowUserProfile(null)
  }

  // Effect load danh sách cuộc trò chuyện khi component mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        console.log("🔄 Đang tải danh sách cuộc trò chuyện...")
        const res = await getMyConversations()
        const conversations = res.data || []
        console.log("📋 Danh sách cuộc trò chuyện:", conversations)

        // Chức năng mới: Log chi tiết thông tin từng cuộc trò chuyện để debug
        conversations.forEach((conv, index) => {
          console.log(`📝 Cuộc trò chuyện ${index + 1}:`, {
            id: conv.id,
            type: conv.type,
            title: conv.title,
            memberIds: conv.memberIds,
            members: conv.members,
            otherUser: conv.otherUser,
            lastMessage: conv.lastMessage,
            unreadCount: conv.unreadCount,
          })

          if (conv.lastMessage) {
            console.log(`💬 Tin nhắn cuối của cuộc trò chuyện ${conv.id}:`, {
              messageId: conv.lastMessage.id,
              senderId: conv.lastMessage.senderId,
              content: conv.lastMessage.content,
              sender: conv.lastMessage.sender,
              createdAt: conv.lastMessage.createdAt,
            })
          }
        })

        setCons(conversations)
        setFromConversations(conversations) // Đồng bộ với UnreadContext
      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách cuộc trò chuyện:", error)
      }
    }

    loadConversations()
  }, [])

  // Chức năng mới: Effect lắng nghe tất cả sự kiện SignalR Hub
  useEffect(() => {
    if (!user) return

    // Cleanup các listener cũ
    unsubUpsertRef.current && unsubUpsertRef.current()
    unsubRemoveRef.current && unsubRemoveRef.current()
    unsubReadRef.current && unsubReadRef.current()
    unsubMessageRef.current && unsubMessageRef.current()

    console.log("🎧 Đăng ký lắng nghe các sự kiện SignalR...")

    // 1. Lắng nghe sự kiện cập nhật cuộc trò chuyện
    unsubUpsertRef.current = onConversationUpserted((conv) => {
      console.log("🔄 Nhận sự kiện ConversationUpserted:", conv)
      setCons((prev) => {
        const idx = prev.findIndex((x) => x.id === conv.id)
        if (idx === -1) {
          console.log("➕ Thêm cuộc trò chuyện mới vào sidebar")
          return [conv, ...prev]
        } else {
          console.log("🔄 Cập nhật cuộc trò chuyện hiện có")
          const clone = [...prev]
          clone[idx] = conv
          return clone
        }
      })

      // Nếu đang mở cuộc trò chuyện này, cập nhật thông tin header
      setActive((prev) => (prev?.id === conv.id ? conv : prev))
    })

    // 2. Lắng nghe sự kiện xóa cuộc trò chuyện
    unsubRemoveRef.current = onConversationRemoved((conversationId) => {
      console.log("🗑️ Nhận sự kiện ConversationRemoved:", conversationId)
      setCons((prev) => prev.filter((c) => c.id !== conversationId))
      // Nếu đang mở cuộc trò chuyện bị xóa, reset về null
      setActive((prev) => (prev?.id === conversationId ? null : prev))
      setMsgs((prev) => (active?.id === conversationId ? [] : prev))
    })

    // 4. Chức năng mới: Lắng nghe sự kiện đánh dấu đã đọc tin nhắn
    unsubReadRef.current = onMessageRead((data) => {
      console.log("👁️ Nhận sự kiện MessageRead:", data)
      // data = { conversationId, messageId, userId, at }
      if (active?.id === data.conversationId) {
        // Cập nhật read receipts cho tin nhắn
        setReadReceipts((prev) => {
          const messageReceipts = prev[data.messageId] || []
          const existingIdx = messageReceipts.findIndex((r) => r.userId === data.userId)

          let updatedReceipts
          if (existingIdx !== -1) {
            updatedReceipts = [...messageReceipts]
            updatedReceipts[existingIdx] = {
              ...updatedReceipts[existingIdx],
              readAt: data.at,
            }
          } else {
            // Tìm thông tin user từ danh sách members
            const userInfo =
              active.members?.find((m) => m.userId === data.userId) ||
              (active.otherUser?.userId === data.userId ? active.otherUser : null)
            if (userInfo) {
              updatedReceipts = [
                ...messageReceipts,
                {
                  userId: data.userId,
                  name: userInfo.name,
                  avatarUrl: userInfo.avatarUrl,
                  readAt: data.at,
                },
              ]
            } else {
              updatedReceipts = messageReceipts
            }
          }

          return {
            ...prev,
            [data.messageId]: updatedReceipts,
          }
        })
      }
    })

    // 5. Chức năng mới: Lắng nghe tin nhắn mới TOÀN CỤC (không chỉ cuộc trò chuyện đang mở)
    unsubMessageRef.current = onMessage((messageDto) => {
      console.log("💬 Nhận tin nhắn mới:", messageDto)
      console.log("👤 Thông tin người gửi:", messageDto.sender)
      console.log("🆔 ID cuộc trò chuyện:", messageDto.conversationId)
      console.log("🎯 Cuộc trò chuyện đang mở:", active?.id)

      // Nếu tin nhắn thuộc cuộc trò chuyện đang mở
      if (active?.id === messageDto.conversationId) {
        console.log("➕ Thêm tin nhắn vào cuộc trò chuyện đang mở")
        setMsgs((prev) => [...prev, messageDto])
        setTimeout(scrollToBottom, 0)

        // Tự động đánh dấu đã đọc nếu đang focus
        if (document.hasFocus()) {
          setTimeout(() => markAsRead(active.id), 500)
        }
      } else {
        // Chức năng mới: Cập nhật preview và unreadCount cho cuộc trò chuyện khác
        console.log("🔄 Cập nhật preview tin nhắn cho cuộc trò chuyện khác")
        setCons((prev) => {
          const updated = [...prev]
          const idx = updated.findIndex((c) => c.id === messageDto.conversationId)
          if (idx !== -1) {
            console.log(`📝 Cập nhật lastMessage và tăng unreadCount cho cuộc trò chuyện ${messageDto.conversationId}`)
            updated[idx] = {
              ...updated[idx],
              lastMessage: messageDto,
            }

            // Di chuyển cuộc trò chuyện lên đầu danh sách
            const updatedConv = updated.splice(idx, 1)[0]
            updated.unshift(updatedConv)
          }
          return updated
        })
      }
    })

    return () => {
      console.log("🧹 Cleanup các SignalR listeners")
      unsubUpsertRef.current && unsubUpsertRef.current()
      unsubRemoveRef.current && unsubRemoveRef.current()
      unsubReadRef.current && unsubReadRef.current()
      unsubMessageRef.current && unsubMessageRef.current()
    }
  }, [active, user])

  // Hàm scroll xuống cuối danh sách tin nhắn
  const scrollToBottom = () => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }

  // Chức năng mới: Hàm đánh dấu cuộc trò chuyện đã đọc
  const markAsRead = async (conversationId) => {
    try {
      console.log(`👁️ Đánh dấu đã đọc cuộc trò chuyện: ${conversationId}`)
      await markConversationRead(conversationId)
      // Cập nhật local state để UI phản hồi ngay lập tức
      setCons((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)))

      // Cập nhật trong UnreadContext để Navbar phản ứng
      setConversationUnread(active.id, 0)
    } catch (error) {
      console.error("❌ Lỗi khi đánh dấu đã đọc:", error)
    }
  }

  // Effect xử lý khi chọn cuộc trò chuyện khác
  useEffect(() => {
    if (!active) return

    console.log("🎯 Chọn cuộc trò chuyện:", active.id)

    // Join vào room SignalR của cuộc trò chuyện
    joinConversation(active.id)

    // Chức năng mới: Đánh dấu đã đọc ngay khi vào cuộc trò chuyện
    if (active.unreadCount > 0) {
      markAsRead(active.id)
    }

    // Load tin nhắn mới nhất của cuộc trò chuyện
    const loadMessages = async () => {
      try {
        console.log(`📥 Đang tải tin nhắn cho cuộc trò chuyện: ${active.id}`)
        const res = await getMessages(active.id)
        const arr = Array.isArray(res.data) ? [...res.data].reverse() : []
        console.log(`💬 Đã tải ${arr.length} tin nhắn`)

        // Log thông tin tin nhắn để debug
        arr.forEach((msg, index) => {
          console.log(`📝 Tin nhắn ${index + 1}:`, {
            id: msg.id,
            senderId: msg.senderId,
            content: msg.content,
            sender: msg.sender,
            createdAt: msg.createdAt,
          })
        })

        setMsgs(arr)
        setHasMore(arr.length > 0)
        setTimeout(scrollToBottom, 0) // Scroll xuống cuối sau khi render
      } catch (error) {
        console.error("❌ Lỗi khi tải tin nhắn:", error)
        setMsgs([])
      }
    }

    loadMessages()

    // Cleanup các listener cũ cho typing
    const unsubTyping = onTyping((u) => {
      console.log("⌨️ Nhận sự kiện typing:", u)
      // Bỏ qua nếu không có user hoặc là chính mình
      if (!u || !u.userId || u.userId === myId) return

      // Thêm user vào danh sách đang gõ nếu chưa có
      setTypingUsers((prev) => {
        const exists = prev.some((x) => x.userId === u.userId)
        return exists ? prev : [...prev, u]
      })

      // Set timeout để tự động xóa user khỏi danh sách typing sau 2 giây
      if (typingTimersRef.current[u.userId]) {
        clearTimeout(typingTimersRef.current[u.userId])
      }
      typingTimersRef.current[u.userId] = setTimeout(() => {
        setTypingUsers((prev) => prev.filter((x) => x.userId !== u.userId))
        delete typingTimersRef.current[u.userId]
      }, 2000)
    })

    return () => {
      // Cleanup khi đổi cuộc trò chuyện
      unsubTyping && unsubTyping()

      // Clear tất cả timer typing
      Object.values(typingTimersRef.current).forEach(clearTimeout)
      typingTimersRef.current = {}
      setTypingUsers([])
    }
  }, [active, myId])

  // Chức năng mới: Effect để đánh dấu đã đọc khi scroll đến cuối hoặc focus vào tab
  useEffect(() => {
    if (!active || active.unreadCount === 0) return

    const handleFocus = () => {
      if (active.unreadCount > 0) {
        markAsRead(active.id)
      }
    }

    const handleScroll = () => {
      if (!scrollRef.current) return
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10

      if (isAtBottom && active.unreadCount > 0) {
        markAsRead(active.id)
      }
    }

    window.addEventListener("focus", handleFocus)
    scrollRef.current?.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("focus", handleFocus)
      scrollRef.current?.removeEventListener("scroll", handleScroll)
    }
  }, [active])

  // Effect xử lý infinite scroll để load tin nhắn cũ hơn
  useEffect(() => {
    if (!active || !topSentinelRef.current) return

    // Sử dụng Intersection Observer để detect khi scroll đến đầu danh sách
    const io = new IntersectionObserver(
      async (entries) => {
        const topVisible = entries[0].isIntersecting
        if (!topVisible || !hasMore || msgs.length === 0) return

        // Lấy timestamp của tin nhắn đầu tiên để làm điểm mốc
        const before = msgs[0].createdAt
        const prevHeight = scrollRef.current?.scrollHeight || 0

        try {
          const res = await getMessages(active.id, before)
          const older = Array.isArray(res.data) ? [...res.data].reverse() : []

          if (older.length === 0) {
            setHasMore(false) // Không còn tin nhắn cũ hơn
            return
          }

          // Thêm tin nhắn cũ vào đầu danh sách
          setMsgs((prev) => [...older, ...prev])

          // Giữ nguyên vị trí scroll sau khi thêm tin nhắn
          setTimeout(() => {
            if (!scrollRef.current) return
            const newHeight = scrollRef.current.scrollHeight
            scrollRef.current.scrollTop = newHeight - prevHeight
          }, 0)
        } catch (error) {
          console.error("❌ Lỗi khi tải tin nhắn cũ hơn:", error)
        }
      },
      { threshold: 1 },
    )

    io.observe(topSentinelRef.current)
    return () => io.disconnect()
  }, [active, msgs, hasMore])

  // Hàm gửi tin nhắn
  const handleSend = async () => {
    const content = text.trim()
    if (!content || !active) return

    try {
      console.log(`📤 Gửi tin nhắn: "${content}" đến cuộc trò chuyện ${active.id}`)
      await sendMessage(active.id, content, [])
      setText("") // Clear input sau khi gửi
    } catch (error) {
      console.error("❌ Lỗi khi gửi tin nhắn:", error)
    }
  }

  // Hàm xử lý khi thay đổi nội dung input
  const onInputChange = (val) => {
    setText(val)
    // Gửi sự kiện typing nếu đang trong cuộc trò chuyện
    if (active) {
      sendTyping(active.id)
    }
  }

  // Hàm rời khỏi cuộc trò chuyện
  const handleLeave = async () => {
    if (!active) return

    try {
      console.log(`🚪 Rời khỏi cuộc trò chuyện: ${active.id}`)
      await leaveConversation(active.id)
      // Server sẽ gửi sự kiện ConversationRemoved, nhưng cập nhật optimistic
      setCons((prev) => prev.filter((c) => c.id !== active.id))
      setActive(null)
      setMsgs([])
    } catch (error) {
      console.error("❌ Lỗi khi rời cuộc trò chuyện:", error)
    }
  }

  // Hàm render item cuộc trò chuyện trong sidebar
  const renderConversationItem = (c) => {
    const unread = getUnreadFor(c.id)
    const isUnread = unread > 0 // Chức năng mới: Kiểm tra có tin nhắn chưa đọc

    if (c.type === "Direct" && c.otherUser) {
      // Cuộc trò chuyện trực tiếp
      return (
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={c.otherUser.avatarUrl || "/placeholder.svg?height=40&width=40"}
              alt={c.otherUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            {/* Chức năng mới: In đậm tên nếu có tin nhắn chưa đọc */}
            <div className={`truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
              {c.otherUser.name}
            </div>
            {/* Chức năng mới: Hiển thị preview tin nhắn cuối */}
            {c.lastMessage && (
              <div className="text-xs text-gray-500 truncate">
                {truncateMessage(c.lastMessage.content)} • {formatRelativeTime(c.lastMessage.createdAt)}
              </div>
            )}
            {!c.lastMessage && <div className="text-xs text-gray-500">Trò chuyện trực tiếp</div>}
          </div>
          {/* Chức năng mới: Badge hiển thị số tin nhắn chưa đọc */}
          {isUnread && (
            <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
              {unread > 99 ? "99+" : unread}
            </div>
          )}
        </div>
      )
    }

    // Cuộc trò chuyện nhóm
    return (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
          <Users className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          {/* Chức năng mới: In đậm tên nhóm nếu có tin nhắn chưa đọc */}
          <div className={`truncate ${isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>
            {c.title || "Nhóm chat"}
          </div>
          {/* Chức năng mới: Hiển thị preview tin nhắn cuối */}
          {c.lastMessage && (
            <div className="text-xs text-gray-500 truncate">
              {c.lastMessage.sender?.name}: {truncateMessage(c.lastMessage.content)} •{" "}
              {formatRelativeTime(c.lastMessage.createdAt)}
            </div>
          )}
          {!c.lastMessage && <div className="text-xs text-gray-500">{c.memberIds?.length || 0} thành viên</div>}
        </div>
        {/* Chức năng mới: Badge hiển thị số tin nhắn chưa đọc */}
        {isUnread && (
          <div className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
            {unread > 99 ? "99+" : unread}
          </div>
        )}
      </div>
    )
  }

  // Hàm kiểm tra tin nhắn có phải của mình không
  const isMine = (m) => m.senderId === myId

  // Chức năng mới: Hàm render read receipts cho tin nhắn
  const renderReadReceipts = (messageId, messageTime) => {
    const receipts = readReceipts[messageId] || []
    if (receipts.length === 0) return null

    return (
      <div className="flex items-center gap-1 mt-1 justify-end">
        <div className="flex -space-x-1">
          {receipts.slice(0, 3).map((receipt) => (
            <img
              key={receipt.userId}
              src={receipt.avatarUrl || "/placeholder.svg?height=16&width=16"}
              alt={receipt.name}
              className="w-4 h-4 rounded-full border border-white object-cover"
              title={`${receipt.name} đã xem lúc ${new Date(receipt.readAt).toLocaleTimeString()}`}
            />
          ))}
        </div>
        {receipts.length > 3 && <span className="text-xs text-gray-400">+{receipts.length - 3}</span>}
        <Clock className="w-3 h-3 text-gray-400" />
      </div>
    )
  }

  // State và hàm cho modal tạo nhóm
  const doSearchMember = async (q) => {
    setMemberQuery(q)
    if (q.trim().length < 2) return setMemberResult([])

    try {
      const res = await searchPeople(q.trim())
      // Loại bỏ những người đã được chọn
      const chosen = new Set(selectedUsers.map((x) => x.userId))
      setMemberResult((res.data || []).filter((u) => !chosen.has(u.userId)))
    } catch (error) {
      console.error("❌ Lỗi khi tìm kiếm thành viên:", error)
      setMemberResult([])
    }
  }

  // Hàm toggle chọn/bỏ chọn thành viên
  const toggleSelect = (u) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((x) => x.userId === u.userId)
      return exists ? prev.filter((x) => x.userId !== u.userId) : [...prev, u]
    })
  }

  // Hàm reset form tạo nhóm
  const resetCreate = () => {
    setGroupTitle("")
    setMemberQuery("")
    setMemberResult([])
    setSelectedUsers([])
  }

  // Hàm tạo nhóm mới
  const handleCreateGroup = async () => {
    try {
      const title = groupTitle.trim() || "Nhóm mới"
      const memberIds = selectedUsers.map((x) => x.userId)
      console.log(`👥 Tạo nhóm mới: "${title}" với thành viên:`, memberIds)
      const res = await createGroup(title, memberIds)
      const conv = res.data

      // Optimistic update: thêm nhóm vào danh sách và chọn vào
      setCons((prev) => (prev.some((c) => c.id === conv.id) ? prev : [conv, ...prev]))
      setActive(conv)

      setShowCreate(false)
      resetCreate()
    } catch (error) {
      console.error("❌ Lỗi khi tạo nhóm:", error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat cộng đồng</h1>
              <p className="text-gray-600">Kết nối và trò chuyện với cộng đồng học tập</p>
            </div>
            <div className="flex items-center space-x-4">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: "70vh" }}>
          <div className="flex h-full">
            {/* Sidebar - Danh sách cuộc trò chuyện */}
            <aside className="w-80 border-r border-gray-200 bg-gray-50">
              {/* Header sidebar */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-gray-900">Tin nhắn</h3>
                  <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center space-x-2 bg-primary text-white px-3 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-md"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Tạo nhóm</span>
                  </button>
                </div>

                {/* Search direct */}
                <div>
                  <div className="text-sm font-semibold mb-2 text-gray-700">Tìm người để chat</div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      value={query}
                      onChange={(e) => doSearch(e.target.value)}
                      placeholder="Nhập tên hoặc email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Kết quả tìm kiếm */}
                  {results.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-auto bg-white shadow-lg">
                      {results.map((u) => (
                        <div
                          key={u.userId}
                          className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                          onClick={() => startChatWith(u)}
                        >
                          <img
                            src={u.avatarUrl || "/placeholder.svg?height=32&width=32"}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.role || "Học viên"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Danh sách cuộc trò chuyện */}
              <div className="overflow-y-auto h-full">
                {cons.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có cuộc trò chuyện nào</p>
                    <p className="text-sm">Tìm kiếm người dùng để bắt đầu chat</p>
                  </div>
                ) : (
                  <ul className="p-2 space-y-1">
                    {cons.map((c) => (
                      <li
                        key={c.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          active?.id === c.id ? "bg-primary text-white shadow-lg" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setActive(c)}
                      >
                        {renderConversationItem(c)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col bg-white">
              {/* Header cuộc trò chuyện */}
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
                {!active ? (
                  <div className="flex items-center justify-center h-16">
                    <div className="text-center text-gray-500">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium">Chọn cuộc trò chuyện để bắt đầu</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 rounded-lg p-2 -m-2 transition-colors"
                      onClick={handleHeaderClick}
                    >
                      {active.type === "Direct" && active.otherUser ? (
                        <>
                          <img
                            src={active.otherUser.avatarUrl || "/placeholder.svg?height=48&width=48"}
                            alt={active.otherUser.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <div className="font-semibold text-lg text-gray-900">{active.otherUser.name}</div>
                            <div className="text-sm text-gray-500">Đang hoạt động</div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg text-gray-900">{active.title || "Nhóm chat"}</div>
                            <div className="text-sm text-gray-500">{active.memberIds?.length || 0} thành viên</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors">
                        <Video className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleLeave}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Rời</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {/* Sentinel cho infinite scroll */}
                <div ref={topSentinelRef} className="h-1" />

                {active && msgs.length === 0 && (
                  <div className="text-center py-12">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 text-lg">Chưa có tin nhắn nào</p>
                    <p className="text-gray-400">Hãy bắt đầu cuộc trò chuyện!</p>
                  </div>
                )}

                {active &&
                  msgs.map((m, index) => {
                    const isLastMessage = index === msgs.length - 1
                    return (
                      <div key={m.id} className={`flex ${isMine(m) ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] ${isMine(m) ? "order-2" : "order-1"}`}>
                          {/* Avatar và tên người gửi - chỉ hiển thị cho tin nhắn không phải của mình */}
                          {!isMine(m) && (
                            <div className="flex items-center gap-2 mb-1">
                              <img
                                src={m.sender?.avatarUrl || "/placeholder.svg?height=24&width=24"}
                                alt={m.sender?.name || "User"}
                                className="w-6 h-6 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                                onClick={() => handleSenderClick(m.senderId)}
                              />
                              <span
                                className="text-xs font-medium text-gray-600 cursor-pointer hover:text-primary transition-colors"
                                onClick={() => handleSenderClick(m.senderId)}
                              >
                                {m.sender?.name || "Unknown"}
                              </span>
                            </div>
                          )}

                          {/* Bubble tin nhắn */}
                          <div
                            className={`px-4 py-3 rounded-2xl shadow-sm ${
                              isMine(m)
                                ? "bg-primary text-white rounded-br-md"
                                : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                            }`}
                          >
                            <div className="break-words">{m.content}</div>
                            <div className={`text-xs mt-2 ${isMine(m) ? "text-white/80" : "text-gray-500"}`}>
                              {new Date(m.createdAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>

                          {/* Chức năng mới: Hiển thị read receipts cho tin nhắn cuối cùng của mình */}
                          {isMine(m) &&
                            isLastMessage &&
                            active.type === "Group" &&
                            renderReadReceipts(m.id, m.createdAt)}
                        </div>
                      </div>
                    )
                  })}

                {/* Typing indicator */}
                {active && typingUsers.length > 0 && (
                  <div className="flex items-center gap-3 text-sm text-gray-500 animate-pulse">
                    <div className="flex -space-x-2">
                      {typingUsers.slice(0, 3).map((u) => (
                        <img
                          key={u.userId}
                          src={u.avatarUrl || "/placeholder.svg?height=20&width=20"}
                          alt={u.name}
                          className="w-5 h-5 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                    </div>
                    <span className="italic">
                      {typingUsers.length === 1
                        ? `${typingUsers[0].name} đang nhập...`
                        : typingUsers.length === 2
                          ? `${typingUsers[0].name} và ${typingUsers[1].name} đang nhập...`
                          : `${typingUsers[0].name}, ${typingUsers[1].name} và ${typingUsers.length - 2} người khác đang nhập...`}
                    </span>
                  </div>
                )}
              </div>

              {/* Message Composer */}
              {active && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex gap-3 items-end">
                    <div className="flex-1 relative">
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 pr-12"
                        value={text}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        placeholder="Nhập tin nhắn..."
                      />
                    </div>
                    <button
                      className="bg-primary text-white p-3 rounded-2xl hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleSend}
                      disabled={!text.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Modal tạo nhóm */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h4 className="font-semibold text-xl text-gray-900">Tạo nhóm mới</h4>
              <button
                onClick={() => {
                  setShowCreate(false)
                  resetCreate()
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Tên nhóm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên nhóm</label>
                <input
                  value={groupTitle}
                  onChange={(e) => setGroupTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="VD: Nhóm học ReactJS"
                />
              </div>

              {/* Thêm thành viên */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thêm thành viên</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    value={memberQuery}
                    onChange={(e) => doSearchMember(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    placeholder="Tìm theo tên hoặc email..."
                  />
                </div>

                {/* Kết quả tìm kiếm thành viên */}
                {memberResult.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-40 overflow-auto bg-gray-50">
                    {memberResult.map((u) => (
                      <div
                        key={u.userId}
                        className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onClick={() => toggleSelect(u)}
                      >
                        <img
                          src={u.avatarUrl || "/placeholder.svg?height=32&width=32"}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.role || "Học viên"}</div>
                        </div>
                        <UserPlus className="w-4 h-4 text-primary" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Danh sách thành viên đã chọn */}
              {selectedUsers.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Đã chọn ({selectedUsers.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((u) => (
                      <div
                        key={u.userId}
                        className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        <img
                          src={u.avatarUrl || "/placeholder.svg?height=20&width=20"}
                          alt={u.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium">{u.name}</span>
                        <button className="text-primary hover:text-primary/80 ml-1" onClick={() => toggleSelect(u)}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer modal */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => {
                  setShowCreate(false)
                  resetCreate()
                }}
              >
                Hủy
              </button>
              <button
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCreateGroup}
                disabled={selectedUsers.length === 0}
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Popups */}
      {showUserProfile && (
        <UserProfilePopup
          userId={showUserProfile}
          onClose={() => setShowUserProfile(null)}
          onStartChat={handleStartChatFromProfile}
        />
      )}

      {showGroupMembers && (
        <GroupMembersPopup conversationId={showGroupMembers} onClose={() => setShowGroupMembers(null)} />
      )}

      <Footer />
    </div>
  )
}
