"use client";
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 20}px`,
              height: `${Math.random() * 100 + 20}px`,
              background: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 155}, ${Math.random() * 0.3})`,
            }}
            animate={{
              y: [0, Math.random() * 100 - 50, 0],
              x: [0, Math.random() * 100 - 50, 0],
              scale: [1, 1 + Math.random() * 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-center [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-10"></div>
    </>
  );
};

export default AnimatedBackground;