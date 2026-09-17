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
    const tl = gsap.timeline({
      onComplete: () => {
        // Reveal animation
        const revealTl = gsap.timeline({
          onComplete: () => {
            if (preloaderRef.current) {
              preloaderRef.current.style.display = "none";
            }
            onComplete?.();
          },
        });

        revealTl
          .to(counterRef.current, {
            y: -60,
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
          })
          .to(
            logoRef.current,
            {
              y: -40,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            },
            "-=0.3"
          )
          .to(preloaderRef.current, {
            yPercent: -100,
            duration: 0.8,
            ease: "power3.inOut",
          });
      },
    });

    // Logo entrance
    tl.from(logoRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });

    // Counter animation
    tl.to(
      { value: 0 },
      {
        value: 100,
        duration: 2.2,
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
      barFillRef.current,
      {
        scaleX: 1,
        duration: 2.2,
        ease: "power2.inOut",
      },
      "<"
    );

    return () => {
      tl.kill();
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
