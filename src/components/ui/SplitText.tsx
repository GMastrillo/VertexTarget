"use client";

import { useRef, useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  type?: "chars" | "words" | "lines";
  stagger?: number;
  duration?: number;
  delay?: number;
  scrollTrigger?: boolean;
  y?: number;
}

export default function SplitText({
  children,
  className = "",
  as: Tag = "span",
  type = "chars",
  stagger = 0.03,
  duration = 0.8,
  delay = 0,
  scrollTrigger = true,
  y = 60,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = elementsRef.current;
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
    gsap.set(elements, {
      y,
      opacity: 0,
      rotateX: 40,
    });

    const animConfig: gsap.TweenVars = {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration,
      stagger,
      delay,
      ease: "power3.out",
    };

    if (scrollTrigger) {
      gsap.to(elements, {
        ...animConfig,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    } else {
      gsap.to(elements, animConfig);
    }

    });

    return () => {
      // Revert kills both the tween and its ScrollTrigger without scanning global triggers.
      ctx.revert();
    };
  }, [children, stagger, duration, delay, scrollTrigger, y]);

  const splitContent = () => {
    elementsRef.current = [];

    if (type === "chars") {
      return children.split("").map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            if (el) elementsRef.current.push(el);
          }}
          style={{
            display: "inline-block",
            whiteSpace: char === " " ? "pre" : "normal",
            perspective: "400px",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }

    if (type === "words") {
      return children.split(" ").map((word, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", perspective: "400px" }}>
          <span
            ref={(el) => {
              if (el) elementsRef.current.push(el);
            }}
            style={{ display: "inline-block" }}
          >
            {word}
          </span>
          {i < children.split(" ").length - 1 && "\u00A0"}
        </span>
      ));
    }

    // lines
    return children.split("\n").map((line, i) => (
      <span key={i} style={{ display: "block", overflow: "hidden", perspective: "400px" }}>
        <span
          ref={(el) => {
            if (el) elementsRef.current.push(el);
          }}
          style={{ display: "block" }}
        >
          {line}
        </span>
      </span>
    ));
  };

  return (
    <div ref={containerRef} className={className} style={{ display: "contents" }}>
      <Tag>
        {splitContent()}
      </Tag>
    </div>
  );
}
