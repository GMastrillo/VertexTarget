"use client";
/* eslint-disable max-lines-per-function -- hero copy and CTA animation are a single above-the-fold composition. */

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/ui/MagneticButton";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function HeroSection({ canvasReady = true }: { canvasReady?: boolean }) {
  const t = useT();
  const [showCanvas, setShowCanvas] = useState(false);

  // Defer the Three.js chunk evaluation to browser idle time: the hero looks
  // complete without it (gradient overlay) and the main thread stays free
  // for first interaction (TBT/TTI win).
  useEffect(() => {
    if (!canvasReady) return;
    const ric =
      typeof window.requestIdleCallback === "function"
        ? (cb: IdleRequestCallback) => window.requestIdleCallback(cb)
        : (cb: IdleRequestCallback) =>
            window.setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 300);
    const id = ric(() => setShowCanvas(true));
    return () => {
      if (typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(id as number);
      } else {
        window.clearTimeout(id as number);
      }
    };
  }, [canvasReady]);
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: canvasReady ? 0 : 2.8 });

      // Label
      tl.from(labelRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      });

      // Headline — split into lines
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll(".hero-line");
        tl.from(
          lines,
          {
            y: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.3"
        );
      }

      // Subline
      tl.from(
        sublineRef.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      );

      // CTA
      tl.from(
        ctaRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );

      // Scroll indicator
      tl.from(
        scrollIndicatorRef.current,
        {
          opacity: 0,
          duration: 0.6,
        },
        "-=0.2"
      );

      // Parallax on scroll
      gsap.to(headlineRef.current, {
        y: -80,
        opacity: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [canvasReady]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* WebGL Background — dimmed in light mode via .hero-canvas.
          Mounted after preloader + idle: keeps first paint interactive. */}
      <div className="absolute inset-0 z-0 hero-canvas transition-opacity duration-500">
        {showCanvas && <HeroCanvas />}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, var(--color-vt-bg) 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center w-full">
        <div ref={labelRef} className="label mb-6 tracking-widest">
          {t.hero.label}
        </div>

        <h1
          ref={headlineRef}
          className="heading-xl mb-6 text-center w-full flex flex-col items-center"
        >
          <span className="hero-line block text-center">
            {t.hero.title1}
          </span>
          <span className="hero-line inline-block gradient-text text-glow text-center">
            {t.hero.title2}
          </span>
        </h1>

        <p
          ref={sublineRef}
          className="body-lg max-w-2xl mx-auto mb-10 sm:mb-12 text-center leading-relaxed"
          style={{ color: "var(--color-vt-text-muted)" }}
        >
          {t.hero.subtitle}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pt-2 w-full"
        >
          {/* Primary CTA — Radiant Obsidian/Cyan/Violet */}
          <MagneticButton href="#contact" variant="primary">
            <span>{t.hero.ctaPrimary}</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>

          {/* Secondary CTA — Luxury Obsidian Glass Pill */}
          <MagneticButton href="#cases" variant="secondary">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-pulse" />
            <span>{t.hero.ctaSecondary}</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 opacity-90 group-hover:opacity-100"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M4 12L12 4M12 4H6M12 4V10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span
          className="text-xs tracking-widest uppercase"
          style={{ color: "var(--color-vt-text-dim)" }}
        >
          {t.hero.scroll}
        </span>
        <div
          className="w-[1px] h-8 overflow-hidden"
          style={{ background: "var(--color-vt-border)" }}
        >
          <div
            className="w-full h-full"
            style={{
              background: "var(--color-vt-accent-cyan)",
              animation: "scrollDown 1.5s ease-in-out infinite",
            }}
          />
        </div>
        <style jsx>{`
          @keyframes scrollDown {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </div>
    </section>
  );
}
