// src/context/UnreadContext.jsx
import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from "react"
import { getMyConversations } from "../services/chatAPI"
import {
  startChat,
  getChatConnection,         // dùng để gắn onreconnected
  joinConversation,          // join tất cả room của user
  onMessage,                 // tăng unread toàn cục khi có tin mới
  onUnreadChanged,           // nếu backend bắn tổng hợp
  onConversationUpserted,    // thêm/cập nhật hội thoại
  onConversationRemoved,     // gỡ hội thoại
  onMessageRead,             // đồng bộ đã đọc từ nơi khác
} from "../services/chatHub"
import { useAuth } from "./AuthContext.jsx"

/** ===== State =====
 * state.byId: { [conversationId]: number }
 * state.total: number
 */
const initial = { byId: {}, total: 0 }

function totalOf(byId) {
  return Object.values(byId).reduce((s, n) => s + (n || 0), 0)
}
function shallowEqualUnread(a, b) {
  const ak = Object.keys(a), bk = Object.keys(b)
  if (ak.length !== bk.length) return false
  for (const k of ak) if (a[k] !== b[k]) return false
  return true
}
function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      return initial
    case "SET_FROM_CONV": {
      const list = Array.isArray(action.payload) ? action.payload : []
      const byId = {}
      for (const c of list) byId[c.id] = c.unreadCount || 0
      if (shallowEqualUnread(state.byId, byId)) return state
      return { byId, total: totalOf(byId) }
    }
    case "SET_ONE": {
      const { id, count } = action
      if (state.byId[id] === count) return state
      const byId = { ...state.byId, [id]: Math.max(0, Number(count || 0)) }
      return { byId, total: totalOf(byId) }
    }
    case "INCR_ONE": {
      const { id, delta } = action
      const cur = Number(state.byId[id] || 0)
      const byId = { ...state.byId, [id]: Math.max(0, cur + (delta ?? 1)) }
      return { byId, total: totalOf(byId) }
    }
    case "REMOVE": {
      if (!(action.id in state.byId)) return state
      const byId = { ...state.byId }
      delete byId[action.id]
      return { byId, total: totalOf(byId) }
    }
    default:
      return state
  }
}

const UnreadCtx = createContext(null)

export function UnreadProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const { user } = useAuth() || {}

  // Lưu danh sách room đã join để re-join khi reconnect
  const convIdsRef = useRef(new Set())
  const mountedRef = useRef(false)
  const reconnectedHookedRef = useRef(false)

  // Khi logout → reset
  useEffect(() => {
    if (!user) {
      convIdsRef.current = new Set()
      dispatch({ type: "RESET" })
    }
  }, [user])

  // Helper: join tất cả room hiện có
  const joinAllRooms = async () => {
    if (convIdsRef.current.size === 0) return
    try {
      await startChat()
      const ids = Array.from(convIdsRef.current)
      await Promise.all(ids.map((id) => joinConversation(id)))
      // console.log("[Unread] Re-joined rooms:", ids) // optional debug
    } catch (e) {
      console.error("[Unread] joinAllRooms error", e)
    }
  }

  // Chỉ start hub & subscribe khi đã đăng nhập
  useEffect(() => {
    if (!user) return
    mountedRef.current = true

    let offUnread, offUpsert, offRemove, offMsg, offRead

    ;(async () => {
      try {
        // 1) Start hub sớm để đảm bảo các on(...) hoạt động ngay cả khi kết nối tới sau
        await startChat() // auto reconnect đã bật ở chatHub.js
      } catch (e) {
        console.error("[Unread] startChat error", e)
      }

      // 2) Seed danh sách hội thoại + join tất cả room
      try {
        const res = await getMyConversations()
        const list = res?.data || []
        dispatch({ type: "SET_FROM_CONV", payload: list })
        convIdsRef.current = new Set(list.map((c) => c.id))
        await joinAllRooms()
      } catch (e) {
        console.error("[Unread] seed error", e)
      }

      // 3) Đăng ký re-join khi reconnect (đăng ký 1 lần trong vòng đời provider)
      if (!reconnectedHookedRef.current) {
        const conn = getChatConnection()
        conn.onreconnected(async () => {
          if (!mountedRef.current) return
          await joinAllRooms()
        })
        reconnectedHookedRef.current = true
      }

      // 4) Subscribe global events

      // 4.1 Khi server bắn UnreadChanged (nếu có)
      offUnread = onUnreadChanged((data) => {
        if (!mountedRef.current || !data) return

        if (Array.isArray(data.items)) {
          for (const it of data.items) {
            if (it?.conversationId != null && typeof it.unreadCount === "number") {
              dispatch({ type: "SET_ONE", id: it.conversationId, count: it.unreadCount })
            }
          }
          return
        }

        const convId = data.conversationId ?? data.convId
        const count =
          typeof data.unreadForConversation === "number"
            ? data.unreadForConversation
            : data.unreadCount
        if (convId != null && typeof count === "number") {
          dispatch({ type: "SET_ONE", id: convId, count })
        }
      })

      // 4.2 Nghe tin nhắn mới toàn cục → tự tăng unread, kể cả khi không ở ChatPage
      offMsg = onMessage((m) => {
        if (!mountedRef.current || !m) return
        // Bỏ qua tin của chính mình
        if (user?.userId && m.senderId === user.userId) return
        if (!m.conversationId) return
        // Nếu chưa có trong danh sách, thêm vào set để lần rejoin sau không sót
        convIdsRef.current.add(m.conversationId)
        dispatch({ type: "INCR_ONE", id: m.conversationId, delta: 1 })
      })

      // 4.3 Upsert/Remove hội thoại → cập nhật unread + join/loại khỏi set
      offUpsert = onConversationUpserted((conv) => {
        if (!mountedRef.current || !conv) return
        convIdsRef.current.add(conv.id)
        dispatch({ type: "SET_ONE", id: conv.id, count: conv.unreadCount || 0 })
        // join phòng mới để nghe MessageCreated ngay lập tức
        joinConversation(conv.id)
      })
      offRemove = onConversationRemoved((convId) => {
        if (!mountedRef.current) return
        convIdsRef.current.delete(convId)
        dispatch({ type: "REMOVE", id: convId })
      })

      // 4.4 Đồng bộ đã đọc từ nơi khác (chỉ set về 0 nếu là user hiện tại)
      offRead = onMessageRead((data) => {
        if (!mountedRef.current || !data) return
        if (data.userId === user?.userId && data.conversationId) {
          dispatch({ type: "SET_ONE", id: data.conversationId, count: 0 })
        }
      })
    })()

    return () => {
      mountedRef.current = false
      offUnread && offUnread()
      offUpsert && offUpsert()
      offRemove && offRemove()
      offMsg && offMsg()
      offRead && offRead()
      // Không cần off onreconnected; handler đã kiểm tra mountedRef
    }
  }, [user?.userId])

  const api = useMemo(
    () => ({
      totalUnread: state.total,
      getUnreadFor: (id) => state.byId[id] || 0,
      setFromConversations: (list) => {
        dispatch({ type: "SET_FROM_CONV", payload: list || [] })
        // đồng bộ convIdsRef để re-join sau reconnect
        const ids = new Set((list || []).map((c) => c.id))
        convIdsRef.current = ids
      },
      setConversationUnread: (id, count) =>
        dispatch({ type: "SET_ONE", id, count }),
      removeConversation: (id) => {
        convIdsRef.current.delete(id)
        dispatch({ type: "REMOVE", id })
      },
    }),
    [state.total, state.byId]
  )

  return <UnreadCtx.Provider value={api}>{children}</UnreadCtx.Provider>
}

export function useUnread() {
  const ctx = useContext(UnreadCtx)
  if (!ctx) throw new Error("useUnread must be used inside <UnreadProvider>")
  return ctx
}
