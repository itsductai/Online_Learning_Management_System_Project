"use client"

import { useState, useEffect } from "react"
import { sendMessageToAI, getChatHistory } from "../services/chatAI"

const useAI = (courseId, lessonId) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Lấy lịch sử chat khi component mount hoặc khi courseId/lessonId thay đổi
  useEffect(() => {
    if (courseId && lessonId) {
      fetchChatHistory()
    }
  }, [courseId, lessonId])

  // Hàm lấy lịch sử chat
  const fetchChatHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const history = await getChatHistory(courseId, lessonId)
      setMessages(history)
    } catch (err) {
      setError("Không thể tải lịch sử chat. Vui lòng thử lại sau.")
      console.error("Lỗi khi lấy lịch sử chat:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Hàm gửi tin nhắn đến AI
  const sendMessage = async (content) => {
    if (!content.trim()) return

    try {
      // Thêm tin nhắn của người dùng vào state
      const userMessage = {
        id: Date.now(),
        sender: "user",
        content,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      // Gọi API để lấy phản hồi từ AI
      const aiResponse = await sendMessageToAI(content, courseId, lessonId)

      // Thêm phản hồi của AI vào state
      const aiMessage = {
        id: aiResponse.id,
        sender: "ai",
        content: aiResponse.content,
        timestamp: aiResponse.timestamp,
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setError("Không thể gửi tin nhắn. Vui lòng thử lại sau.")
      console.error("Lỗi khi gửi tin nhắn:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Hàm xóa lịch sử chat
  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: "ai",
        content: "Xin chào! Tôi là trợ lý AI. Tôi có thể giúp gì cho bạn về bài học này?",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  }
}

export default useAI

