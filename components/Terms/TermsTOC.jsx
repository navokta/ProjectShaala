// components/Terms/TermsTOC.jsx
"use client";

export default function TermsTOC({ activeSection, onSectionChange }) {
  const sections = [
    { id: "introduction", label: "1. Introduction" },
    { id: "account", label: "2. Account Terms" },
    { id: "user-conduct", label: "3. User Conduct" },
    { id: "intellectual-property", label: "4. Intellectual Property" },
    { id: "fees-payment", label: "5. Fees & Payment" },
    { id: "refunds", label: "6. Refund Policy" },
    { id: "disputes", label: "7. Dispute Resolution" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "termination", label: "9. Termination" },
    { id: "privacy", label: "10. Privacy Policy" },
    { id: "changes", label: "11. Changes to Terms" },
    { id: "contact", label: "12. Contact Information" },
    { id: "governing-law", label: "13. Governing Law" },
  ];

  return (
    <nav className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 className="font-poppins font-bold text-gray-900 mb-4 text-lg">
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => onSectionChange(section.id)}
              className={`w-full text-left font-sans text-sm py-2 px-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {section.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <button
          onClick={() => window.print()}
          className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-sans text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
        >
          📄 Print Terms
        </button>
        <a
          href="/privacy"
          className="block w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-sans text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors text-center"
        >
          🔒 Privacy Policy
        </a>
      </div>
    </nav>
  );
}
