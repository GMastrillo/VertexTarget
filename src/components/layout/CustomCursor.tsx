"use client";
/* eslint-disable complexity -- pointer, reduced-motion and theme fallbacks are one cursor lifecycle. */

import { useRef, useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  // Respect prefers-reduced-motion: disable cursor physics entirely
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Dark is the default/theme of record; light mode gets a solid black cursor
  const isDark = mounted ? resolvedTheme !== "light" : true;

  /* Theme-aware cursor colors:
     - Dark mode: white + mix-blend difference (inverts over content)
     - Light mode: solid dark navy, normal blend (always visible) */
  const ringColor = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(11, 16, 32, 0.35)";
  const ringHoverColor = isDark ? "rgba(0, 240, 255, 0.6)" : "rgba(0, 144, 200, 0.55)";
  const dotColor = isDark ? "white" : "#0b1020";
  const blend = isDark ? "difference" : "normal";

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnterInteractive = () => setIsHovering(true);
    const handleMouseLeaveInteractive = () => setIsHovering(false);

    window.addEventListener("mousemove", handleMouseMove);

    // Observe DOM for interactive elements
    const addListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", handleMouseEnterInteractive);
        el.addEventListener("mouseleave", handleMouseLeaveInteractive);
      });
      return interactiveElements;
    };

    const elements = addListeners();
    const weakSet = new WeakSet(Array.from(elements));

    // Re-add listeners when DOM changes (only for elements not yet tracked)
    const observer = new MutationObserver(() => {
      document
        .querySelectorAll(
          'a, button, [role="button"], input, textarea, select, [data-cursor-hover]'
        )
        .forEach((el) => {
          if (!weakSet.has(el)) {
            weakSet.add(el);
            el.addEventListener("mouseenter", handleMouseEnterInteractive);
            el.addEventListener("mouseleave", handleMouseLeaveInteractive);
          }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      elements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnterInteractive);
        el.removeEventListener("mouseleave", handleMouseLeaveInteractive);
      });
      observer.disconnect();
    };
  }, [cursorX, cursorY, isVisible, reducedMotion]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer ring — liquid glass bubble on hover */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 56 : 32,
            height: isHovering ? 56 : 32,
            borderColor: isHovering ? ringHoverColor : ringColor,
            /* Liquid glass: frosted fill + blur appears on hover */
            backgroundColor: isHovering
              ? isDark
                ? "rgba(255, 255, 255, 0.06)"
                : "rgba(255, 255, 255, 0.25)"
              : "rgba(0, 0, 0, 0)",
            backdropFilter: isHovering ? "blur(6px) saturate(160%)" : "blur(0px)",
            WebkitBackdropFilter: isHovering ? "blur(6px) saturate(160%)" : "blur(0px)",
            boxShadow: isHovering
              ? isDark
                ? "inset 0 1px 0 rgba(255, 255, 255, 0.25)"
                : "inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 4px 14px rgba(11, 16, 32, 0.12)"
              : "none",
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            borderRadius: "50%",
            border: `1px solid ${ringColor}`,
            mixBlendMode: blend,
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          animate={{
            width: isHovering ? 8 : 5,
            height: isHovering ? 8 : 5,
            opacity: isHovering && isDark ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          style={{
            borderRadius: "50%",
            background: dotColor,
            mixBlendMode: blend,
            boxShadow: isDark ? "none" : "0 0 0 1px rgba(255,255,255,0.4)",
          }}
        />
      </motion.div>

      {/* Hide default cursor */}
      <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
