"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { UserPlusIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function MessageRequests({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    fetch("/api/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Filter to just pending requests where we are the receiver
          const pendings = data.data.filter(
            (c) => c.status === "pending" && c.initiator._id !== user._id
          );
          setRequests(pendings);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAction = async (chatId, action) => {
      try {
          const res = await fetch(`/api/conversations/${chatId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: action }) // 'active' or 'rejected'
          });
          const data = await res.json();
          if (data.success) {
              setRequests(prev => prev.filter(req => req._id !== chatId));
          } else {
              alert(data.error);
          }
      } catch (err) {
          console.error(err);
      }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-gray-900 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserPlusIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">No Pending Requests</h3>
        <p className="text-gray-500 font-inter">You do not have any new message requests.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-inter">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">Message Requests</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {requests.map((chat) => {
          const otherUser = chat.initiator;
          return (
            <div key={chat._id} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors duration-200">
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
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                   wants to start a conversation with you.
                </p>
              </div>
              <div className="flex items-center gap-2">
                 <button
                   onClick={() => handleAction(chat._id, 'active')}
                   className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors flex items-center gap-2 px-3"
                   title="Accept Request"
                 >
                   <CheckCircleIcon className="w-6 h-6" />
                   <span className="text-sm font-medium hidden sm:block">Accept</span>
                 </button>
                 <button
                   onClick={() => handleAction(chat._id, 'rejected')}
                   className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center gap-2 px-3"
                   title="Decline Request"
                 >
                   <XCircleIcon className="w-6 h-6" />
                   <span className="text-sm font-medium hidden sm:block">Decline</span>
                 </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
