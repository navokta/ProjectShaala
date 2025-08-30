"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import SharedCursor from '../ui/SharedCursor';
import AnimatedBackground from '../ui/AnimatedBackground';
import { useCursor } from '@/context/CursorContext';

const HeroSection = () => {
     const { textEnter, buttonEnter, leave } = useCursor();
  const [cursorVariant, setCursorVariant] = useState("default");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-900 py-16 px-4">
      {/* Shared Cursor */}
      <SharedCursor />
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      <div className="container mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left"
          >
            <motion.h1 
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Turn Code into <span className="gradient-text">Commerce</span>
            </motion.h1>
            <motion.p 
              onMouseEnter={textEnter}
              onMouseLeave={leave}
              className="text-xl text-gray-200 mb-10 max-w-lg mx-auto lg:mx-0"
            >
              The marketplace where developers transform their skills and creations into thriving businesses. Showcase, sell, and grow your developer projects.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link href="/projects">
                <motion.div
                  onMouseEnter={buttonEnter}
                  onMouseLeave={leave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-center"
                >
                  Explore Projects
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 opacity-75 blur-md -z-10"></div>
                </motion.div>
              </Link>
              <Link href="/auth/register?as=seller">
                <motion.div
                  onMouseEnter={buttonEnter}
                  onMouseLeave={leave}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-indigo-400 text-indigo-100 font-semibold rounded-xl hover:bg-indigo-800/20 transition-all duration-300 cursor-pointer text-center"
                >
                  Become a Seller
                </motion.div>
              </Link>
            </div>
          </motion.div>
          
          {/* Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-slate-800/40 backdrop-blur-md rounded-2xl shadow-2xl p-8 h-96 flex items-center justify-center border border-slate-700/50">
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <motion.div 
                    className="relative mb-6"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-12 h-12 md:w-16 md:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                      </svg>
                    </div>
                    <motion.div 
                      className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </motion.div>
                  </motion.div>
                  <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <motion.div
                        key={item}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(99, 102, 241, 0.5)" }}
                        className="h-10 bg-slate-700/50 rounded-lg flex items-center justify-center backdrop-blur-sm"
                        animate={{
                          y: [0, item % 2 === 0 ? -5 : 5, 0],
                        }}
                        transition={{
                          duration: 2 + item,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: item * 0.2,
                        }}
                      >
                        <div className="h-2 w-2 bg-indigo-400 rounded-full"></div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.p 
                    className="text-indigo-300 font-medium mt-6"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Developer Marketplace
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 10px rgba(129, 140, 248, 0.3);
        }
      `}</style>
    </section>
  );
};

export default HeroSection;