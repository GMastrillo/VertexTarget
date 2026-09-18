"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [counter, setCounter] = useState(0);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preloaderElement = preloaderRef.current;
    const counterElement = counterRef.current;
    const barFillElement = barFillRef.current;
    const logoElement = logoRef.current;

    // Reduced motion: skip the theatrical countdown entirely
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (preloaderElement) preloaderElement.style.display = "none";
      onComplete?.();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Reveal animation
        const revealTl = gsap.timeline({
          onComplete: () => {
            if (preloaderElement) {
              preloaderElement.style.display = "none";
            }
            onComplete?.();
          },
        });

        revealTl
          .to(counterElement, {
            y: -60,
            opacity: 0,
            duration: 0.25,
            ease: "power2.in",
          })
          .to(
            logoElement,
            {
              y: -40,
              opacity: 0,
              duration: 0.25,
              ease: "power2.in",
            },
            "-=0.15"
          )
          .to(preloaderElement, {
            yPercent: -100,
            duration: 0.55,
            ease: "power3.inOut",
          });
      },
    });

    // Logo entrance
    tl.from(logoElement, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Counter animation — shortened: long pre-loaders delay LCP for zero gain
    tl.to(
      { value: 0 },
      {
        value: 100,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: function () {
          const val = Math.round(this.targets()[0].value);
          setCounter(val);
        },
      },
      "-=0.3"
    );

    // Bar fill
    tl.to(
      barFillElement,
      {
        scaleX: 1,
        duration: 0.8,
        ease: "power2.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
      gsap.killTweensOf([preloaderElement, counterElement, barFillElement, logoElement]);
    };
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader">
      <div ref={logoRef} className="label" style={{ marginBottom: "1rem" }}>
        VertexTarget
      </div>
      <div ref={counterRef} className="preloader-counter">
        {String(counter).padStart(3, "0")}
      </div>
      <div className="preloader-bar">
        <div
          ref={barFillRef}
          className="preloader-bar-fill"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
