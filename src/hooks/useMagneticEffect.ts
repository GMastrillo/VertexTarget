"use client";

import { useRef, useCallback } from "react";
import gsap from "gsap";

interface MagneticOptions {
  strength?: number;
  ease?: number;
}

export function useMagneticEffect<T extends HTMLElement>(
  options: MagneticOptions = {}
) {
  const { strength = 0.35, ease = 0.3 } = options;
  const ref = useRef<T>(null);

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(ref.current, {
        x: deltaX,
        y: deltaY,
        duration: ease,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    [strength, ease]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.3)",
      overwrite: "auto",
    });
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
