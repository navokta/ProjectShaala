// components/Dashboard/ProfileCompletion.jsx
"use client";

export default function ProfileCompletion({ percentage }) {
  const steps = [
    { label: "Basic Info", done: true },
    { label: "Profile Photo", done: true },
    { label: "Payment Method", done: percentage >= 75 },
    { label: "Verification", done: false },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-poppins font-bold text-gray-900 mb-4 text-lg">
        👤 Profile Setup
      </h3>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="font-sans text-gray-600">Completion</span>
          <span className="font-poppins font-bold text-gray-900">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                step.done
                  ? "bg-emerald-500 border-emerald-500"
                  : "border-gray-300"
              }`}
            >
              {step.done && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span
              className={`font-sans text-sm ${
                step.done ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      {percentage < 100 && (
        <a
          href="/dashboard/settings"
          className="block mt-5 py-2.5 text-center text-sm font-poppins font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Complete Profile →
        </a>
      )}
    </div>
  );
}
