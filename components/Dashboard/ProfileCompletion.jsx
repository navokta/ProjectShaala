"use client";

export default function ProfileCompletion({ user }) {
  // Define fields that are required for a complete profile
  const fields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email Address" },
    { key: "username", label: "Username" },
    { key: "phone", label: "Phone Number" },
    { key: "avatar", label: "Profile Picture" },
  ];

  // Calculate how many fields are filled
  const filledCount = fields.filter(
    (field) => user[field.key] && user[field.key].trim() !== ""
  ).length;
  const totalFields = fields.length;
  const percentage = Math.round((filledCount / totalFields) * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="font-poppins font-bold text-gray-900 mb-4 text-lg">
        👤 Profile Setup
      </h3>

      {/* Progress Bar */}
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

      {/* Field List */}
      <div className="space-y-3">
        {fields.map((field) => {
          const isFilled = user[field.key] && user[field.key].trim() !== "";
          return (
            <div key={field.key} className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isFilled
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-gray-300"
                }`}
              >
                {isFilled && (
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
                  isFilled ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {field.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA Button */}
      {percentage < 100 && (
        <a
          href="/dashboard/profile"
          className="block mt-5 py-2.5 text-center text-sm font-poppins font-semibold text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Complete Profile →
        </a>
      )}
    </div>
  );
}