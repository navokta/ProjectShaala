"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function Inbox({ user, basePath = "/dashboard/messages" }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter out pending requests where the user is the receiver to keep Inbox clean
          // Pending requests will appear in "Chat Requests" folder
          const inProgress = data.data.filter(
            (c) => c.status === "active" || c.status === "restricted" || (c.status === "pending" && c.initiator._id === user._id)
          );
          setConversations(inProgress);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleLeftRightIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">No Messages Yet</h3>
        <p className="text-gray-500 font-inter">You don't have any active conversations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-inter">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">Your Inbox</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {conversations.map((chat) => {
          const otherUser = chat.participants.find((p) => p._id !== user._id);
          return (
            <Link
              key={chat._id}
              href={`${basePath}/${chat._id}`}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 relative"
            >
              <img
                src={otherUser?.avatar || "https://placehold.co/400x400?text=Avatar"}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {otherUser?.name || "Unknown User"}
                  </h3>
                  <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                     {chat.lastMessage ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true }) : "New"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                   {chat.status === "pending" && chat.initiator._id === user._id && (
                       <span className="text-orange-500 font-medium mr-2">Request Pending</span>
                   )}
                   {chat.status === "restricted" && (
                       <span className="text-red-500 font-medium mr-2">Restricted</span>
                   )}
                  {chat.lastMessage ? "New messages..." : "Tap to start chatting."}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
