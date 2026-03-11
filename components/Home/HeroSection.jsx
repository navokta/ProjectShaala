// components/Home/Hero.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  CodeBracketIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

const Hero = () => {
  return (
    <section className="relative bg-white min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50 opacity-50">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Welcome Heading */}
        <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Welcome to{" "}
          <span className="relative inline-block">
            <span className="relative z-10">ProjectShaala</span>
            <svg
              className="absolute -bottom-2 left-0 w-full h-3 text-gray-900 -z-0"
              viewBox="0 0 200 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.00025 6.99997C2.00025 6.99997 18.9393 2.55553 41.6669 2.55553C64.3945 2.55553 84.0002 6.99997 84.0002 6.99997"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M100 6.99997C100 6.99997 116.939 2.55553 139.667 2.55553C162.394 2.55553 182 6.99997 182 6.99997"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Main Description */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 sm:p-10 lg:p-12 mb-10 shadow-sm hover:shadow-md transition-shadow duration-300">
          <p className="font-sans text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed">
            A dynamic marketplace where{" "}
            <span className="font-semibold text-gray-900">clients</span> hire
            skilled{" "}
            <span className="font-semibold text-gray-900">developers</span> to
            build exceptional web, app, and software projects. Connect,
            collaborate, and create something amazing.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12">
          {/* Buy a Project Button */}
          <Link
            href="/projects"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-poppins font-semibold text-white bg-gray-900 rounded-xl border-2 border-gray-900 transition-all duration-300 hover:bg-white hover:text-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            <CommandLineIcon className="w-5 h-5 mr-2" />
            Buy a Project
            <ArrowRightIcon className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Link>

          {/* Sell a Project Button */}
          <Link
            href="/developers"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base sm:text-lg font-poppins font-semibold text-gray-900 bg-white rounded-xl border-2 border-gray-900 transition-all duration-300 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-200"
          >
            <CodeBracketIcon className="w-5 h-5 mr-2" />
            Sell a Project
            <ArrowRightIcon className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </Link>
        </div>

        {/* Motivational Quote */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 max-w-3xl mx-auto shadow-sm">
          <blockquote className="font-sans text-base sm:text-lg lg:text-xl text-gray-600 italic leading-relaxed">
            &ldquo;The best way to predict the future is to create it. Build
            your dreams with the right team, one project at a time.&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-400">
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <CodeBracketIcon className="w-4 h-4" />
            <div className="w-12 h-0.5 bg-gray-300"></div>
          </div>
        </div>

        {/* Optional: Stats or Trust Indicators */}
      </div>
      <hr />
    </section>
  );
};

export default Hero;
