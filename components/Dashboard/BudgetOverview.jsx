// components/Dashboard/BudgetOverview.jsx
"use client";

export default function BudgetOverview({ spent, budget }) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const remaining = budget - spent;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-poppins font-bold text-gray-900 mb-6 text-lg">
        💰 Budget Overview
      </h3>

      {/* Progress Circle */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#111827"
              strokeWidth="8"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-poppins text-2xl font-bold text-gray-900">
              {Math.round(percentage)}%
            </span>
            <span className="font-sans text-xs text-gray-500">Used</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <span className="font-sans text-sm text-gray-600">Spent</span>
          <span className="font-poppins font-semibold text-gray-900">
            ₹{spent.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
          <span className="font-sans text-sm text-gray-600">Budget</span>
          <span className="font-poppins font-semibold text-gray-900">
            ₹{budget.toLocaleString("en-IN")}
          </span>
        </div>
        <div
          className={`flex items-center justify-between p-3 rounded-xl ${
            remaining < budget * 0.2
              ? "bg-red-50 border border-red-200"
              : "bg-emerald-50 border border-emerald-200"
          }`}
        >
          <span
            className={`font-sans text-sm ${
              remaining < budget * 0.2 ? "text-red-700" : "text-emerald-700"
            }`}
          >
            Remaining
          </span>
          <span
            className={`font-poppins font-semibold ${
              remaining < budget * 0.2 ? "text-red-900" : "text-emerald-900"
            }`}
          >
            ₹{remaining.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Warning */}
      {remaining < budget * 0.2 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="font-sans text-xs text-red-700 text-center">
            ⚠️ Budget running low! Consider adding funds.
          </p>
        </div>
      )}

      {/* Add Funds Button */}
      <button className="w-full mt-4 py-3 bg-gray-900 text-white font-poppins font-semibold rounded-xl border-2 border-gray-900 hover:bg-white hover:text-gray-900 transition-all duration-300">
        + Add Funds
      </button>
    </div>
  );
}
