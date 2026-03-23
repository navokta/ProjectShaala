// components/DevDashboard/EarningsOverview.jsx
"use client";

export default function EarningsOverview({ pending, released, total }) {
  const withdrawalThreshold = 5000;
  const canWithdraw = pending >= withdrawalThreshold;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-900 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-poppins font-semibold text-gray-900 text-lg">
          Earnings Overview
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          This Month
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">Pending (Escrow)</p>
          <p className="font-poppins font-semibold text-gray-900 text-xl">
            ₹{pending.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Released</p>
          <p className="font-poppins font-semibold text-green-600 text-xl">
            ₹{released.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Earned</p>
          <p className="font-poppins font-semibold text-gray-900 text-xl">
            ₹{total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Withdrawal Progress</span>
          <span>
            {Math.min((pending / withdrawalThreshold) * 100, 100).toFixed(0)}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${canWithdraw ? "bg-green-500" : "bg-gray-900"}`}
            style={{
              width: `${Math.min((pending / withdrawalThreshold) * 100, 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Minimum withdrawal: ₹{withdrawalThreshold.toLocaleString()}
        </p>
      </div>

      {/* Withdraw Button */}
      <button
        disabled={!canWithdraw}
        className={`w-full py-3 rounded-xl font-poppins font-medium text-sm transition-all
          ${
            canWithdraw
              ? "bg-gray-900 text-white border-2 border-gray-900 hover:bg-white hover:text-gray-900"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200"
          }`}
      >
        {canWithdraw
          ? "Withdraw Funds"
          : `Need ₹${(withdrawalThreshold - pending).toLocaleString()} more to withdraw`}
      </button>
    </div>
  );
}
