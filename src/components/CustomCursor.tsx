"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [cursorType, setCursorType] = useState<"default" | "interactive" | "text" | "hidden">("default");
  const [cursorLabel, setCursorLabel] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.2 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  const updateCursorPosition = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);

    const target = e.target as HTMLElement;
    const interactiveEl = target.closest('button, a, [role="button"], .cursor-pointer, input, select, textarea') as HTMLElement;
    const isText = !!target.closest('p, h1, h2, h3, h4, h5, h6, span, li') && !interactiveEl;

    if (interactiveEl) {
      setCursorType("interactive");
      setCursorLabel(interactiveEl.getAttribute("data-cursor") || "");
    } else if (isText) {
      setCursorType("text");
      setCursorLabel("");
    } else {
      setCursorType("default");
      setCursorLabel("");
    }

    if (!isVisible) setIsVisible(true);
  }, [mouseX, mouseY, isVisible]);

  useEffect(() => {
    setMounted(true);
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", updateCursorPosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [updateCursorPosition]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block overflow-hidden">
      {/* Precision Dot - Follows mouse exactly */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorType === "interactive" ? 0 : isMouseDown ? 0.8 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
      />

      {/* Lagging Ring - Weighted Professional Feel */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: cursorType === "interactive" ? 64 : cursorType === "text" ? 2 : 24,
          height: cursorType === "interactive" ? 64 : cursorType === "text" ? 32 : 24,
          opacity: isVisible ? 1 : 0,
          backgroundColor: cursorType === "interactive" ? "rgba(16, 185, 129, 0.05)" : "transparent",
          border: cursorType === "interactive" 
            ? "1px solid rgba(16, 185, 129, 0.3)" 
            : cursorType === "text"
              ? "1px solid rgba(16, 185, 129, 0.4)"
              : "1.5px solid rgba(16, 185, 129, 0.5)",
          borderRadius: cursorType === "text" ? "2px" : "100%",
        }}
        className="flex items-center justify-center transition-opacity duration-300"
      >
        <AnimatePresence>
          {cursorType === "interactive" && cursorLabel && (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-[-24px] whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400"
            >
              {cursorLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Subtle Ambient Glow */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: cursorType === "interactive" ? 2 : 1,
          opacity: isVisible ? 0.1 : 0,
        }}
        className="w-32 h-32 bg-emerald-500 blur-[64px] rounded-full mix-blend-screen"
      />
    </div>
  );
}
