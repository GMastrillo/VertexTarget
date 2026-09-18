"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

/**
 * Client roster — real VertexTarget customers (names as they appear on Cases).
 * Typographic "logos" stay grayscale/dim and light up on hover (VTEX pattern).
 */
const CLIENTS = [
  { name: "ELON", suffix: "Watches" },
  { name: "ClinicFlow", suffix: "Co." },
  { name: "Absoluto", suffix: "Sistemas" },
  { name: "Ale Rei", suffix: "Marine" },
  { name: "Autobelle", suffix: "Multimarcas" },
  { name: "CACCIA", suffix: "Solar" },
  { name: "Lucena", suffix: "Refrigeração" },
];

export default function TrustedBy() {
  const t = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 26,
      ease: "none",
      repeat: -1,
    });

    // Pause on hover so visitors can read a logo
    const el = trackRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();
    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    // Reveal on scroll
    let ctx: gsap.Context | undefined;
    if (sectionRef.current) {
      const section = sectionRef.current;
      ctx = gsap.context(() => {
        gsap.from(section.children[0], {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 88%" },
        });
      }, sectionRef);
    }

    return () => {
      tween.kill();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
      ctx?.revert();
    };
  }, []);

  const Logo = ({ name, suffix }: { name: string; suffix: string }) => (
    <div className="flex flex-col items-center gap-0.5 px-8 sm:px-12 group cursor-default select-none">
      <span
        className="text-xl sm:text-2xl font-bold tracking-tight whitespace-nowrap transition-colors duration-300"
        style={{ fontFamily: "var(--font-heading)", color: "var(--color-vt-text-dim)" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-vt-accent-cyan)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-vt-text-dim)")}
      >
        {name}
      </span>
      <span
        className="text-[10px] font-mono uppercase tracking-[0.25em] whitespace-nowrap"
        style={{ color: "var(--color-vt-text-dim)", opacity: 0.6 }}
      >
        {suffix}
      </span>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-14 sm:py-16" aria-label={t.trusted.label}>
      <div className="section-inner mb-8 text-center">
        <div className="label mb-3">{t.trusted.label}</div>
        <p
          className="text-sm sm:text-base font-medium"
          style={{ color: "var(--color-vt-text-muted)" }}
        >
          {t.trusted.title}
        </p>
      </div>

      {/* Marquee — duplicated track for seamless loop */}
      <div
        className="overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div ref={trackRef} className="flex w-fit items-center">
          <div className="flex items-center">
            {CLIENTS.map((c) => (
              <Logo key={`a-${c.name}`} {...c} />
            ))}
          </div>
          <div className="flex items-center" aria-hidden="true">
            {CLIENTS.map((c) => (
              <Logo key={`b-${c.name}`} {...c} />
            ))}
          </div>
        </div>
      </div>

      <div className="divider mt-14" />
    </section>
  );
}
