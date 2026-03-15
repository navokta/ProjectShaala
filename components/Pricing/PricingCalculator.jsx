// components/Pricing/PricingCalculator.jsx
"use client";

import { useState } from "react";
import { CalculatorIcon } from "@heroicons/react/24/outline";

export default function PricingCalculator() {
  const [projectAmount, setProjectAmount] = useState(10000);

  const platformFee = Math.round(projectAmount * 0.02);
  const youReceive = projectAmount - platformFee;

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <div className="py-16 lg:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 sm:px-10 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-4">
            <CalculatorIcon className="w-5 h-5 text-gray-900" />
            <span className="font-sans text-sm font-medium text-gray-700">
              Calculate Your Earnings
            </span>
          </div>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            See What You Earn
          </h2>
          <p className="font-sans text-lg text-gray-600">
            Move the slider to calculate your earnings after our 2% fee
          </p>
        </div>

        {/* Calculator Card */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 lg:p-12 shadow-lg">
          {/* Amount Display */}
          <div className="text-center mb-8">
            <div className="text-sm font-sans text-gray-500 mb-2">
              Project Amount
            </div>
            <div className="font-poppins text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              {formatCurrency(projectAmount)}
            </div>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={projectAmount}
              onChange={(e) => setProjectAmount(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500 font-sans">
              <span>₹1,000</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-sm font-sans text-gray-500 mb-2">
                Platform Fee (2%)
              </div>
              <div className="font-poppins text-2xl font-bold text-gray-900">
                {formatCurrency(platformFee)}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6 text-center sm:col-span-2">
              <div className="text-sm font-sans text-gray-400 mb-2">
                You Receive
              </div>
              <div className="font-poppins text-3xl lg:text-4xl font-bold text-white">
                {formatCurrency(youReceive)}
              </div>
              <div className="text-sm font-sans text-gray-400 mt-1">
                {((youReceive / projectAmount) * 100).toFixed(0)}% of project
                value
              </div>
            </div>
          </div>

          {/* Example Scenarios */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="font-poppins font-semibold text-gray-900 mb-4 text-center">
              Quick Examples
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[5000, 15000, 50000].map((amount) => {
                const fee = Math.round(amount * 0.02);
                const receive = amount - fee;
                return (
                  <button
                    key={amount}
                    onClick={() => setProjectAmount(amount)}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-900 hover:bg-white transition-all duration-300 text-left"
                  >
                    <div className="font-sans text-sm text-gray-500 mb-1">
                      Project: {formatCurrency(amount)}
                    </div>
                    <div className="font-poppins font-bold text-gray-900">
                      You get: {formatCurrency(receive)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
