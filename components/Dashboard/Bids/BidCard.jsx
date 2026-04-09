// components/Dashboard/BidCard.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  StarIcon,
  CurrencyRupeeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

export default function BidCard({ bid, onSelect }) {
  const developer = bid.developer || {};
  const router = useRouter();
  const [messaging, setMessaging] = useState(false);

  const handleMessage = async () => {
    if (!developer._id) return;
    setMessaging(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: developer._id })
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard/messages');
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
    <div className="border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={
              developer.avatar || "https://placehold.co/50/111827/ffffff?text=D"
            }
            alt={developer.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
          <div>
            <p className="font-poppins font-semibold text-gray-900">
              {developer.name || "Developer"}
            </p>
            <p className="text-sm text-gray-500">
              {developer.title || "Developer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <StarIconSolid className="w-4 h-4 text-yellow-500" />
          <span className="font-poppins font-medium text-gray-900">
            {developer.rating || "N/A"}
          </span>
        </div>
      </div>

      <p className="text-gray-600 font-inter mb-4 line-clamp-3">
        {bid.proposal}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <CurrencyRupeeIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            ₹{bid.amount?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{bid.timeline}</span>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(bid.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onSelect && bid.status === 'pending' && (
          <button
            onClick={() => onSelect(bid._id)}
            className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-poppins font-medium hover:bg-gray-800 transition-all"
          >
            Accept Bid
          </button>
        )}
        
        <button
          onClick={handleMessage}
          disabled={messaging || !developer._id}
          className="flex-1 py-3 border-2 border-gray-900 text-gray-900 rounded-xl font-poppins font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          {messaging ? "Connecting..." : "Message"}
        </button>
      </div>

      {bid.status === 'accepted' && (
        <div className="w-full mt-3 py-3 bg-green-100 text-green-800 text-center rounded-xl font-poppins font-medium border-2 border-green-200">
          Accepted
        </div>
      )}
      
      {bid.status === 'rejected' && (
        <div className="w-full mt-3 py-3 bg-red-50 text-red-400 text-center rounded-xl font-poppins font-medium border-2 border-red-100">
          Rejected
        </div>
      )}
    </div>
  );
}
