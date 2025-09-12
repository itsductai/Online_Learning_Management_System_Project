// src/services/chatHub.js
import * as signalR from "@microsoft/signalr";

// Origin của API (không có /api). Đặt trong .env: VITE_API_ORIGIN=http://localhost:7025
const HUB_BASE =
  import.meta.env.VITE_API_ORIGIN?.replace(/\/+$/, "") || "http://localhost:7025";

// Lấy access token giống api.js đang dùng
const getAccessToken = () => localStorage.getItem("token");

let connection = null;

export function getChatConnection() {
  if (connection) return connection;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_BASE}/hubs/chat`, {
      accessTokenFactory: () => getAccessToken(),
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  // optional logs
  connection.onclose((err) => console.log("SignalR closed", err));
  connection.onreconnected((id) => console.log("SignalR reconnected", id));
  connection.onreconnecting((err) => console.log("SignalR reconnecting", err));

  return connection;
}

export async function startChat() {
  const conn = getChatConnection();
  if (conn.state === signalR.HubConnectionState.Disconnected) {
    await conn.start();
  }
  return conn;
}

export async function joinConversation(conversationId) {
  const conn = await startChat();
  await conn.invoke("JoinConversation", conversationId);
}

export async function sendMessage(conversationId, content, attachments = []) {
  const conn = await startChat();
  await conn.invoke("SendMessage", conversationId, content, attachments);
}

//  Thêm export này để phát sự kiện đang gõ
export async function sendTyping(conversationId) {
  const conn = await startChat();
  await conn.invoke("Typing", conversationId);
}

export function onMessage(handler) {
  const conn = getChatConnection();
  conn.on("MessageCreated", handler);
  return () => conn.off("MessageCreated", handler);
}

//  Lắng đúng tên sự kiện server phát: "UserTyping"
export function onTyping(handler) {
  const conn = getChatConnection();
  conn.on("UserTyping", handler);
  return () => conn.off("UserTyping", handler);
}
