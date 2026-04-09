"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function MessageButton({ receiverId, dashboardPath = "/dashboard/messages", className = "", label = "Message" }) {
  const router = useRouter();
  const [messaging, setMessaging] = useState(false);

  const handleMessage = async () => {
    if (!receiverId) return;
    setMessaging(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId })
      });
      const data = await res.json();
      if (data.success) {
        router.push(dashboardPath);
      } else {
        alert(data.error || 'Failed to initiate chat');
      }
    } catch(err) {
      console.error(err);
    } finally {
      setMessaging(false);
    }
  };

  return (
    <button
      onClick={handleMessage}
      disabled={messaging || !receiverId}
      className={`inline-flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${className}`}
    >
      <ChatBubbleLeftRightIcon className="w-5 h-5 flex-shrink-0" />
      <span>{messaging ? "Connecting..." : label}</span>
    </button>
  );
}
