// src/services/chatAPI.js
import api from "./api";

/** Lấy danh sách cuộc trò chuyện của tôi */
export function getMyConversations() {
  // baseURL trong api.js = http://localhost:7025/api
  // => endpoint đầy đủ: http://localhost:7025/api/chat/conversations
  return api.get("/chat/conversations");
}

/** Tạo hoặc lấy direct conversation giữa tôi và người khác */
export function createDirect(otherUserId) {
  // Backend nhận [FromBody] int → gửi JSON number là OK
  return api.post("/chat/conversations/direct", otherUserId, {
    headers: { "Content-Type": "application/json" },
  });
}

/** Phân trang tin nhắn (load cũ hơn với before) */
export function getMessages(conversationId, before, pageSize = 30) {
  const params = { pageSize };
  if (before) params.before = before; // ISO string
  return api.get(`/chat/messages/${conversationId}`, { params });
}

/** Gửi tin nhắn qua REST (nếu cần) */
export function postMessage(conversationId, content, attachments = []) {
  return api.post(`/chat/messages/${conversationId}`, { content, attachments });
}

// Tìm người để bắt chuyện
export function searchPeople(q, take = 10) {
  return api.get("/chat/people/search", { params: { q, take } });
}

// Gửi tin trực tiếp (auto-create conversation nếu chưa có)
export function sendDirect(targetUserId, content, attachments = []) {
  return api.post("/chat/messages/direct", { targetUserId, content, attachments });
}

// Rời hội thoại
export function leaveConversation(conversationId) {
  return api.delete(`/chat/conversations/${conversationId}`);
}