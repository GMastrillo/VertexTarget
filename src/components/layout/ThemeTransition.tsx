"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Circular theme reveal: when <html> gains the "light" class, an overlay
 * sweeps across the screen in the new theme's background color (clip-path
 * circle). Respects prefers-reduced-motion (instant switch, no overlay).
 */
export default function ThemeTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const prevTheme = useRef<string | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const html = document.documentElement;
    prevTheme.current = html.classList.contains("light") ? "light" : "dark";

    const observer = new MutationObserver(() => {
      const next = html.classList.contains("light") ? "light" : "dark";
      if (next === prevTheme.current) return;

      const goingLight = next === "light";
      const overlay = overlayRef.current;
      if (!overlay) return;

      prevTheme.current = next;

      // Paint the overlay with the DESTINATION background and sweep it in
      overlay.style.background = goingLight ? "#f2f5fa" : "#050510";
      overlay.style.transition = "none";
      overlay.style.clipPath = "circle(0% at calc(100% - 60px) 60px)";
      overlay.style.opacity = "1";

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.transition = "clip-path 0.65s cubic-bezier(0.16, 1, 0.3, 1)";
          overlay.style.clipPath = "circle(150% at calc(100% - 60px) 60px)";
        });
      });

      // Fade the overlay out once the sweep completes
      window.setTimeout(() => {
        overlay.style.transition = "opacity 0.3s ease";
        overlay.style.opacity = "0";
      }, 680);
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9997] pointer-events-none"
      style={{ opacity: 0 }}
    />
  );
}
