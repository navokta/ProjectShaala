// components/Terms/TermsSection.jsx
"use client";

export default function TermsSection({ id, title, content, isActive }) {
  return (
    <section
      id={id}
      className={`scroll-mt-32 p-8 bg-white border border-gray-200 rounded-2xl transition-all duration-300 ${
        isActive ? "shadow-lg border-gray-400" : "hover:shadow-md"
      }`}
    >
      <h2 className="font-poppins text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
        {title}
      </h2>

      <div
        className="font-sans text-gray-700 leading-relaxed space-y-4 terms-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </section>
  );
}
