"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

interface Metric {
  value: number;
  suffix: string;
  labelKey: "projects" | "roi" | "years" | "uptime";
}

const METRICS: Metric[] = [
  { value: 50, suffix: "+", labelKey: "projects" },
  { value: 340, suffix: "%", labelKey: "roi" },
  { value: 7, suffix: "+", labelKey: "years" },
  { value: 99.9, suffix: "%", labelKey: "uptime" },
];

function formatValue(v: number): string {
  return v % 1 === 0 ? String(Math.round(v)) : v.toFixed(1).replace(".", ",");
}

/**
 * VTEX-style metrics band: big animated counters between sections.
 * Counters animate from 0 when the band enters the viewport.
 */
export default function MetricsBand() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const counters = useRef<Map<string, HTMLSpanElement>>(new Map());

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      METRICS.forEach((m, i) => {
        const el = counters.current.get(`m-${i}`);
        if (el) el.textContent = formatValue(m.value) + m.suffix;
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tweenObj = { progress: 0 };
      const tween = gsap.to(
        tweenObj,
        {
          progress: 1,
          duration: 1.8,
          ease: "power2.out",
          paused: true,
          onUpdate: () => {
            const p = tweenObj.progress;
            METRICS.forEach((m, i) => {
              const el = counters.current.get(`m-${i}`);
              if (!el) return;
              // Stagger: each counter starts a bit later
              const localP = Math.min(1, Math.max(0, (p - i * 0.08) / (1 - i * 0.08)));
              el.textContent = formatValue(m.value * localP) + m.suffix;
            });
          },
        }
      );

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => tween.play(),
      });

      const grid = gridRef.current;
      if (!grid) return;
      gsap.fromTo(
        grid.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 88%", once: true },
        }
      );
    }, sectionRef);

    const id = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => {
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [t]);

  return (
    <section ref={sectionRef} aria-label="metrics">
      <div className="section-inner">
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-t border-b"
          style={{ borderColor: "var(--color-vt-border)" }}
        >
          {METRICS.map((m, i) => (
            <div key={m.labelKey} className="text-center">
              <div
                className="text-4xl md:text-5xl font-black mb-2 gradient-text leading-none"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span ref={(el) => { if (el) counters.current.set(`m-${i}`, el); }}>
                  0{m.suffix}
                </span>
              </div>
              <div
                className="text-xs tracking-wider uppercase"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {t.metrics[m.labelKey]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
