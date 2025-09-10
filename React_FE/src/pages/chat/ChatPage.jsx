// src/pages/chat/ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { getMyConversations, getMessages } from "../../services/chatAPI";
import { joinConversation, sendMessage, onMessage } from "../../services/chatHub";

export default function ChatPage() {
  const [cons, setCons] = useState([]);
  const [active, setActive] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const unsubRef = useRef(null);

  useEffect(() => {
    getMyConversations().then(res => setCons(res.data)); // axios instance trả về { data: ... }
  }, []);

  useEffect(() => {
    if (!active) return;

    joinConversation(active.id);
    getMessages(active.id).then(res => {
      // API trả list (mới nhất trước) → đảo ngược để render từ cũ → mới
      const arr = Array.isArray(res.data) ? [...res.data].reverse() : [];
      setMsgs(arr);
    });

    unsubRef.current && unsubRef.current();
    unsubRef.current = onMessage(dto => {
      if (dto.conversationId === active.id) {
        setMsgs(prev => [...prev, dto]);
      }
    });

    return () => unsubRef.current && unsubRef.current();
  }, [active]);

  const handleSend = async () => {
    const content = text.trim();
    if (!content || !active) return;
    await sendMessage(active.id, content, []);
    setText("");
  };

  return (
    <div className="flex h-[80vh]">
      <aside className="w-72 border-r p-3 overflow-auto">
        <h3 className="font-bold mb-2">Conversations</h3>
        <ul>
          {cons.map(c => (
            <li key={c.id}
                className={`p-2 rounded cursor-pointer ${active?.id===c.id?"bg-gray-200":""}`}
                onClick={() => setActive(c)}>
              {c.type==="Direct" ? `Direct: ${c.memberIds.join(",")}` : (c.title || c.id)}
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {!active && <div>Chọn cuộc trò chuyện…</div>}
          {active && msgs.map(m => (
            <div key={m.id} className="max-w-[70%]">
              <div className="px-3 py-2 rounded-lg bg-gray-100">{m.content}</div>
              <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {active && (
          <div className="p-3 border-t flex gap-2">
            <input
              className="border rounded px-3 py-2 flex-1"
              value={text}
              onChange={e=>setText(e.target.value)}
              onKeyDown={e => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Nhập tin nhắn…"
            />
            <button className="px-4 py-2 rounded bg-black text-white" onClick={handleSend}>Gửi</button>
          </div>
        )}
      </main>
    </div>
  );
}
