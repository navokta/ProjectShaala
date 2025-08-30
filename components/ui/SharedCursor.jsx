"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useCursor } from '@/context/CursorContext';

const SharedCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { cursorVariant } = useCursor();

  useEffect(() => {
    const mouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "#6366f1",
      mixBlendMode: "difference"
    },
    text: {
      x: mousePosition.x - 32,
      y: mousePosition.y - 32,
      height: 64,
      width: 64,
      backgroundColor: "#ffffff",
      mixBlendMode: "difference"
    },
    button: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "#8b5cf6",
    },
    card: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "#8b5cf6",
    }
  };

  return (
    <motion.div
      className="cursor fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50"
      variants={variants}
      animate={cursorVariant}
      transition={{ type: "tween", ease: "backOut" }}
    />
  );
};

export default SharedCursor;