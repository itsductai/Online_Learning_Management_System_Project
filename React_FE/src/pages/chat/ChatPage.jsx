import React, { useEffect, useRef, useState } from "react";
import {
  getMyConversations, getMessages, searchPeople, createDirect, leaveConversation
} from "../../services/chatAPI";
import { joinConversation, sendMessage, onMessage, onTyping, sendTyping } from "../../services/chatHub";
import { useAuth } from "../../context/AuthContext"; // để lấy current user
export default function ChatPage() {
  const { user } = useAuth(); // user.userId, user.name, ...
  const myId = user?.userId;

  const [cons, setCons] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [typingUser, setTypingUser] = useState(null); // {name, avatarUrl}
  const [hasMore, setHasMore] = useState(true);

  const unsubMessageRef = useRef(null);
  const unsubTypingRef = useRef(null);
  const scrollRef = useRef(null);
  const topSentinelRef = useRef(null);
  const typingTimeoutRef = useRef(null);

    const doSearch = async (q) => {
    setQuery(q);
    if (q.trim().length < 2) { setResults([]); return; }
    const res = await searchPeople(q.trim());
    setResults(res.data || []);
  };

  const startChatWith = async (person) => {
    const res = await createDirect(person.userId);
    const conv = res.data;
    setCons(prev => prev.some(c => c.id === conv.id) ? prev : [conv, ...prev]);
    setActive(conv);
    setQuery(""); setResults([]);
  };
  useEffect(() => {
    getMyConversations().then(res => setCons(res.data || []));
  }, []);
  const scrollToBottom = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  useEffect(() => {
    if (!active) return;

    // join hub group
    joinConversation(active.id);

    // load newest page
    getMessages(active.id).then(res => {
      const arr = Array.isArray(res.data) ? [...res.data].reverse() : [];
      setMsgs(arr);
      setHasMore(arr.length > 0); // giả định có thể còn
      // scroll bottom
      setTimeout(scrollToBottom, 0);
    });

    // message stream
    unsubMessageRef.current && unsubMessageRef.current();
    unsubMessageRef.current = onMessage(dto => {
      if (dto.conversationId === active.id) {
        setMsgs(prev => [...prev, dto]);
        setTimeout(scrollToBottom, 0);
      }
    });

    // typing stream
    unsubTypingRef.current && unsubTypingRef.current();
    unsubTypingRef.current = onTyping(u => {
      // nhận typing của người khác
      setTypingUser({ name: u.name, avatarUrl: u.avatarUrl });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000);
    });

    return () => {
      unsubMessageRef.current && unsubMessageRef.current();
      unsubTypingRef.current && unsubTypingRef.current();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [active]);
  // Observer trên đỉnh khung chat
  useEffect(() => {
    if (!active || !topSentinelRef.current) return;

    const io = new IntersectionObserver(async (entries) => {
      const topVisible = entries[0].isIntersecting;
      if (topVisible && hasMore && msgs.length > 0) {
        const before = msgs[0].createdAt;
        const prevScrollHeight = scrollRef.current?.scrollHeight || 0;

        const res = await getMessages(active.id, before);
        const older = Array.isArray(res.data) ? [...res.data].reverse() : [];
        if (older.length === 0) {
          setHasMore(false);
          return;
        }
        setMsgs(prev => [...older, ...prev]);

        // giữ nguyên vị trí đang xem: set scrollTop theo delta
        setTimeout(() => {
          if (!scrollRef.current) return;
          const newHeight = scrollRef.current.scrollHeight;
          scrollRef.current.scrollTop = newHeight - prevScrollHeight;
        }, 0);
      }
    }, { threshold: 1 });

    io.observe(topSentinelRef.current);
    return () => io.disconnect();
  }, [active, msgs, hasMore]);
  const handleSend = async () => {
    const content = text.trim();
    if (!content || !active) return;
    await sendMessage(active.id, content, []); // gửi qua hub
    setText("");
  };

  const onInputChange = (val) => {
    setText(val);
    if (active) sendTyping(active.id); // debounce ở chatHub
  };

  const handleLeave = async () => {
    if (!active) return;
    await leaveConversation(active.id);
    setCons(prev => prev.filter(c => c.id !== active.id));
    setActive(null);
    setMsgs([]);
  };
  const renderConversationItem = (c) => {
    if (c.type === "Direct" && c.otherUser) {
      return (
        <div className="flex items-center gap-2">
          <img src={c.otherUser.avatarUrl} className="w-7 h-7 rounded-full" />
          <div className="flex-1">
            <div className="font-medium">{c.otherUser.name}</div>
            <div className="text-xs text-gray-500">Direct</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <div className="font-medium">{c.title || "Group"}</div>
        <div className="text-xs text-gray-500">{c.memberIds?.length || 0} thành viên</div>
      </div>
    );
  };

  const isMine = (m) => m.senderId === myId;
  return (
    <div className="flex h-[80vh]">
      {/* Sidebar */}
      <aside className="w-80 border-r p-3 overflow-auto">
        <h3 className="font-bold mb-3">Tin nhắn</h3>

        {/* Search people */}
        <div className="mb-3">
          <div className="text-sm font-semibold mb-1">Tìm người</div>
          <input
            value={query}
            onChange={(e)=>doSearch(e.target.value)}
            placeholder="Nhập tên/email…"
            className="border rounded px-2 py-1 w-full"
          />
          {results.length > 0 && (
            <div className="mt-2 border rounded max-h-56 overflow-auto">
              {results.map(u => (
                <div key={u.userId}
                     className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                     onClick={()=>startChatWith(u)}>
                  <img src={u.avatarUrl} className="w-6 h-6 rounded-full" />
                  <span>{u.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation list */}
        <ul className="space-y-1">
          {cons.map(c => (
            <li key={c.id}
                className={`p-2 rounded cursor-pointer hover:bg-gray-50 ${active?.id===c.id?"bg-gray-100":""}`}
                onClick={() => setActive(c)}>
              {renderConversationItem(c)}
            </li>
          ))}
        </ul>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b px-4 py-3 flex items-center justify-between">
          {!active && <div className="text-sm text-gray-500">Chọn cuộc trò chuyện…</div>}
          {active && (
            <>
              <div className="flex items-center gap-3">
                {active.type === "Direct" && active.otherUser ? (
                  <>
                    <img src={active.otherUser.avatarUrl} className="w-8 h-8 rounded-full" />
                    <div className="font-semibold">{active.otherUser.name}</div>
                  </>
                ) : (
                  <div className="font-semibold">{active.title || "Group chat"}</div>
                )}
              </div>
              <button onClick={handleLeave} className="text-sm text-red-600 hover:underline">Rời hội thoại</button>
            </>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-2">
          <div ref={topSentinelRef} />
          {active && msgs.map(m => (
            <div key={m.id} className={`flex ${isMine(m) ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${isMine(m) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"} px-3 py-2 rounded-lg`}>
                {/* (Tuỳ chọn) hiện tên người gửi khi Group */}
                {active.type !== "Direct" && !isMine(m) && m.sender?.name && (
                  <div className="text-xs font-semibold mb-1 opacity-80">{m.sender.name}</div>
                )}
                <div>{m.content}</div>
                <div className={`text-[10px] mt-1 ${isMine(m) ? "text-white/80" : "text-gray-500"}`}>
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {active && typingUser && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <img src={typingUser.avatarUrl} className="w-5 h-5 rounded-full" />
              <span>{typingUser.name} đang nhập…</span>
            </div>
          )}
        </div>

        {/* Composer */}
        {active && (
          <div className="p-3 border-t flex gap-2">
            <input
              className="border rounded px-3 py-2 flex-1"
              value={text}
              onChange={e=>onInputChange(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Nhập tin nhắn…"
            />
            <button className="px-4 py-2 rounded bg-black text-white" onClick={handleSend}>
              Gửi
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
