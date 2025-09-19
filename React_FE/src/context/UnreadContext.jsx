// src/context/UnreadContext.jsx
import { createContext, useContext, useEffect, useMemo, useReducer } from "react"
import { getMyConversations } from "../services/chatAPI"
import {
  startChat,
  onUnreadChanged,
  onConversationUpserted,
  onConversationRemoved,
} from "../services/chatHub"

/** ===== State shape =====
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
    case "SET_FROM_CONV": {
      const list = Array.isArray(action.payload) ? action.payload : []
      const nextById = {}
      for (const c of list) nextById[c.id] = c.unreadCount || 0
      if (shallowEqualUnread(state.byId, nextById)) return state
      return { byId: nextById, total: totalOf(nextById) }
    }
    case "SET_ONE": {
      const { id, count } = action
      if (state.byId[id] === count) return state
      const byId = { ...state.byId, [id]: count }
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

  // Boot 1 lần: seed unread + kết nối SignalR + subscribe các sự kiện
  useEffect(() => {
    let offUnread, offUpsert, offRemove

    ;(async () => {
      try {
        // seed từ server
        const res = await getMyConversations()
        dispatch({ type: "SET_FROM_CONV", payload: res?.data || [] })
      } catch (e) {
        console.error("[Unread] seed error", e)
      }

      try {
        await startChat()
      } catch (e) {
        console.error("[Unread] startChat error", e)
      }

      // Khi unread của 1 hội thoại thay đổi (server phát)
      offUnread = onUnreadChanged((data) => {
        const convId = data.conversationId || data.convId
        const count =
          typeof data.unreadForConversation === "number"
            ? data.unreadForConversation
            : data.unreadCount
        if (convId && typeof count === "number") {
          dispatch({ type: "SET_ONE", id: convId, count })
        }
      })

      // Khi có hội thoại mới hoặc cập nhật
      offUpsert = onConversationUpserted((conv) => {
        dispatch({ type: "SET_ONE", id: conv.id, count: conv.unreadCount || 0 })
      })

      // Khi hội thoại bị gỡ
      offRemove = onConversationRemoved((convId) => {
        dispatch({ type: "REMOVE", id: convId })
      })
    })()

    return () => {
      offUnread && offUnread()
      offUpsert && offUpsert()
      offRemove && offRemove()
    }
  }, [])

  const api = useMemo(
    () => ({
      /** đọc */
      totalUnread: state.total,
      getUnreadFor: (id) => state.byId[id] || 0,

      /** ghi – dùng từ ChatPage khi bạn tải danh sách mới hoặc đánh dấu đã đọc */
      setFromConversations: (list) =>
        dispatch({ type: "SET_FROM_CONV", payload: list || [] }),

      setConversationUnread: (id, count) =>
        dispatch({ type: "SET_ONE", id, count }),

      removeConversation: (id) => dispatch({ type: "REMOVE", id }),
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
