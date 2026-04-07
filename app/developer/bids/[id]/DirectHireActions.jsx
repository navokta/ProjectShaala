"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function DirectHireActions({ bidId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleResponse = async (status) => {
    if (!confirm(`Are you sure you want to ${status === 'accepted' ? 'accept' : 'decline'} this job offer?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/developer/bids/${bidId}/respond`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
         router.refresh();
      } else {
         alert(data.message || "Failed to process request");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing response");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex gap-4">
      <button 
        onClick={() => handleResponse("accepted")}
        disabled={loading}
        className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition shadow-sm disabled:opacity-50"
      >
        <CheckIcon className="w-5 h-5 mr-2" />
        Accept Job Offer
      </button>
      <button 
        onClick={() => handleResponse("rejected")}
        disabled={loading}
        className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-white text-red-600 border border-red-200 rounded-xl font-medium hover:bg-red-50 transition shadow-sm disabled:opacity-50"
      >
        <XMarkIcon className="w-5 h-5 mr-2" />
        Decline Offer
      </button>
    </div>
  );
}
