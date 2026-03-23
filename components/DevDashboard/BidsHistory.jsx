// components/DevDashboard/BidsHistory.jsx
"use client";

import Link from "next/link";

const statusConfig = {
  pending: { label: "Pending", class: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "Accepted", class: "bg-green-100 text-green-800" },
  rejected: { label: "Rejected", class: "bg-gray-100 text-gray-800" },
};

export default function BidsHistory({ bids, limit = 5 }) {
  const displayBids = limit ? bids.slice(0, limit) : bids;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-gray-900 text-lg">
          Recent Bids
        </h3>
        <Link
          href="/developer/bids"
          className="text-sm text-gray-900 hover:underline font-inter"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {displayBids.map((bid) => {
          const status = statusConfig[bid.status] || statusConfig.pending;
          return (
            <div
              key={bid.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="font-poppins font-medium text-gray-900 truncate">
                  {bid.projectTitle}
                </p>
                <p className="text-sm text-gray-500 truncate">{bid.client}</p>
                <p className="text-xs text-gray-400 mt-1">{bid.date}</p>
              </div>
              <div className="text-right ml-4">
                <p className="font-poppins font-semibold text-gray-900">
                  ₹{bid.amount.toLocaleString()}
                </p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${status.class}`}
                >
                  {status.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {bids.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-inter">No bids yet</p>
          <Link
            href="/project"
            className="mt-2 inline-block text-sm text-gray-900 hover:underline"
          >
            Browse Projects →
          </Link>
        </div>
      )}
    </div>
  );
}
