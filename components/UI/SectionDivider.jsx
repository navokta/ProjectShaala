// components/UI/SectionDivider.jsx
"use client";

import { ArrowDownIcon } from "@heroicons/react/24/outline";

/**
 * SectionDivider Component
 * @param {'simple' | 'dotted' | 'arrow' | 'gradient'} variant - Divider style
 * @param {string} className - Additional CSS classes
 */
export default function SectionDivider({ variant = "simple", className = "" }) {
  const variants = {
    simple: (
      <div className="w-full max-w-4xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
      </div>
    ),

    dotted: (
      <div className="w-full max-w-4xl mx-auto flex items-center justify-center gap-2">
        <div className="flex-1 h-px bg-gray-200" />
        <div className="w-2 h-2 rounded-full bg-gray-400" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-gray-200" />
        <div className="flex-1 h-px bg-gray-200" />
      </div>
    ),

    arrow: (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-3">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-gray-300" />
        <ArrowDownIcon className="w-5 h-5 text-gray-400 animate-bounce" />
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-gray-300" />
      </div>
    ),

    gradient: (
      <div className="w-full max-w-4xl mx-auto relative">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent opacity-30" />
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-gray-900/50 to-transparent blur-[1px]" />
      </div>
    ),
  };

  return (
    <div className={`py-8 sm:py-12 ${className}`}>{variants[variant]}</div>
  );
}
