"use client";

import { useEffect, useRef } from "react";
import { motionTokens } from "@/lib/motion";

/** Brief decorative fade; content stays visible and reduced motion switches instantly. */
export default function ThemeTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previousTheme = html.classList.contains("light");
    let animation: Animation | null = null;

    const stopAnimation = () => {
      animation?.cancel();
      animation = null;
    };
    const observer = new MutationObserver(() => {
      const nextTheme = html.classList.contains("light");
      if (nextTheme === previousTheme) return;
      previousTheme = nextTheme;
      stopAnimation();
      if (media.matches) return;
      animation = overlayRef.current?.animate(
        [{ opacity: 0.08 }, { opacity: 0 }],
        { duration: motionTokens.duration.fast * 1000, easing: "ease-out" }
      ) ?? null;
    });

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", stopAnimation);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", stopAnimation);
      stopAnimation();
    };
  }, []);

  return <div ref={overlayRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9997] bg-background opacity-0" />;
}
