"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ShieldExclamationIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";

export default function ConversationsList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = () => {
    fetch("/api/admin/conversations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setConversations(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleRestrict = async (chatId, currentStatus) => {
      const newStatus = currentStatus === 'restricted' ? 'active' : 'restricted';
      try {
          const res = await fetch(`/api/admin/conversations/${chatId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: newStatus })
          });
          const data = await res.json();
          if (data.success) {
              setConversations(prev => prev.map(c => c._id === chatId ? { ...c, status: newStatus } : c));
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

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-poppins">No Conversations</h3>
        <p className="text-gray-500 font-inter">There are no messages being sent on the platform yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden font-inter">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900 font-poppins">Platform Conversations</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {conversations.map((chat) => (
              <tr key={chat._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex -space-x-2 overflow-hidden">
                      {chat.participants.map(p => (
                          <img
                            key={p._id}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                            src={p.avatar || "https://placehold.co/40?text=U"}
                            alt={p.name}
                            title={p.name}
                          />
                      ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                       {chat.participants.map(p => p.name).join(" & ")}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${chat.status === 'active' ? 'bg-green-100 text-green-800' : 
                      chat.status === 'restricted' ? 'bg-red-100 text-red-800' : 
                      'bg-orange-100 text-orange-800'}`}>
                    {chat.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleRestrict(chat._id, chat.status)}
                    className={`inline-flex items-center gap-1 hover:underline ${
                        chat.status === 'restricted' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <ShieldExclamationIcon className="w-4 h-4" />
                    {chat.status === 'restricted' ? 'Unrestrict' : 'Restrict Chat'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
