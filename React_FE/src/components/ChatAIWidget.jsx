"use client"

import { useState } from "react"
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa"

const ChatAIWidget = ({ courseId, lessonId }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn về bài học này?",
      timestamp: new Date().toISOString(),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSubmitMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Thêm tin nhắn của người dùng
    const userMessage = {
      id: Date.now(),
      sender: "user",
      content: newMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages([...messages, userMessage])
    setNewMessage("")

    // Thêm tin nhắn phản hồi từ AI
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        content:
          "Chức năng trò chuyện với AI đang được phát triển. Vui lòng chờ trong thời gian sắp tới. Cảm ơn bạn đã quan tâm!",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Nút mở widget */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-opacity-90 transition"
          title="Trợ lý AI"
        >
          <FaRobot className="w-5 h-5" />
        </button>
      )}

      {/* Widget chat */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg w-80 md:w-96 overflow-hidden">
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <FaRobot className="mr-2" /> Trợ lý AI
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200 transition">
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col h-96">
            {/* Danh sách tin nhắn */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user" ? "bg-primary text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span
                      className={`text-xs mt-1 block text-right ${
                        message.sender === "user" ? "text-white text-opacity-80" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Form gửi tin nhắn */}
            <div className="border-t border-gray-200 p-3">
              <form onSubmit={handleSubmitMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary text-white p-2 rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatAIWidget

