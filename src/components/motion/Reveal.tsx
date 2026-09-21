"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionTokens } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface RevealProps {
  children: ReactNode;
  y?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}

export function Reveal({
  children,
  y = motionTokens.distance.lg,
  duration = motionTokens.duration.slow,
  stagger = motionTokens.stagger.base,
  className,
}: RevealProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el.children, {
          y,
          opacity: 0,
          duration,
          stagger,
          ease: motionTokens.ease.gsapOut,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
    },
    { scope }
  );

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  );
}

export default Reveal;
