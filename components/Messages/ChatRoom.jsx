"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatRoom({ user, chatId }) {
  const [messages, setMessages] = useState([]);
  const [conversation, setConversation] = useState(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const endRef = useRef(null);

  const fetchChat = async () => {
    try {
      const [convRes, msgRes] = await Promise.all([
        fetch(`/api/conversations/${chatId}`),
        fetch(`/api/conversations/${chatId}/messages`)
      ]);
      const convData = await convRes.json();
      const msgData = await msgRes.json();

      if (convData.success) setConversation(convData.data);
      if (msgData.success) {
          if (messages.length !== msgData.data.length) {
              setMessages(msgData.data);
              setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          }
      }
      setLoading(false);
    } catch(err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 4000); // Poll every 4 seconds
    return () => clearInterval(interval);
  }, [chatId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/conversations/${chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
        setContent("");
        setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      } else {
        alert(data.error || "Failed to send message");
      }
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!conversation) return <div>Chat not found.</div>;

  const otherUser = conversation.participants.find((p) => p._id !== user._id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-inter flex flex-col h-[75vh]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center gap-3">
        <img
          src={otherUser?.avatar || "https://placehold.co/400x400?text=Avatar"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <div>
          <h2 className="text-sm font-semibold text-gray-900 font-poppins">{otherUser?.name}</h2>
          <p className="text-xs text-gray-500 capitalize">{otherUser?.role}</p>
        </div>
        {conversation.status === "restricted" && (
            <span className="ml-auto px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                Chat Restricted
            </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {messages.length === 0 ? (
           <div className="text-center text-gray-400 text-sm py-10">Start the conversation...</div>
        ) : (
            messages.map((msg) => {
            const isMe = msg.sender._id === user._id || msg.sender === user._id; // defensive 
            return (
                <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                        ? "bg-gray-900 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                >
                    <p>{msg.content}</p>
                    <span className={`text-[10px] mt-1 block ${isMe ? "text-gray-300" : "text-gray-500"}`}>
                    {format(new Date(msg.createdAt), "p")}
                    </span>
                </div>
                </div>
            );
            })
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      {conversation.status === "active" ? (
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center gap-2 relative">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!content.trim() || sending}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </form>
      ) : (
          <div className="p-4 text-center text-sm text-gray-500 border-t border-gray-200 bg-gray-50">
              You cannot send messages to this chat.
          </div>
      )}
    </div>
  );
}
