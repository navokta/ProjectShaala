// components/Dashboard/BidList.jsx
"use client";

import { useState } from "react";
import BidCard from "./BidCard";

export default function BidList({ bids, projectId, onSelectBid }) {
  const [sortBy, setSortBy] = useState("newest");

  const sortedBids = [...bids].sort((a, b) => {
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === "lowest") return a.amount - b.amount;
    if (sortBy === "highest") return b.amount - a.amount;
    if (sortBy === "rating") return b.developer?.rating - a.developer?.rating;
    return 0;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-gray-900 text-lg">
          All Bids
        </h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-inter focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="newest">Newest First</option>
          <option value="lowest">Lowest Price</option>
          <option value="highest">Highest Price</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedBids.map((bid) => (
          <BidCard key={bid._id} bid={bid} onSelect={onSelectBid} />
        ))}
      </div>

      {bids.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 font-inter">No bids yet</p>
        </div>
      )}
    </div>
  );
}
