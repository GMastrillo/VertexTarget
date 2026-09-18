"use client";
/* eslint-disable max-lines-per-function -- testimonial carousel and motion composition share state. */

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage, useT } from "@/providers/LanguageProvider";
import { CARD_CONTENT } from "@/lib/i18n-data";

gsap.registerPlugin(ScrollTrigger);

const ACCENTS = ["#00f0ff", "#8b5cf6", "#00f0ff", "#8b5cf6"];

/**
 * Testimonials wall — VTEX-style social proof with client quotes.
 * Staggered grid; fromTo + refresh pattern (safe against stale triggers).
 */
export default function TestimonialsSection() {
  const t = useT();
  const { locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 85%" },
          }
        );
      }
      if (gridRef.current) {
        gsap.fromTo(
          gridRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: { trigger: gridRef.current, start: "top 88%" },
          }
        );
      }
    }, sectionRef);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
      ctx.revert();
    };
  }, [locale]);

  const testimonials = CARD_CONTENT[locale].testimonials;

  return (
    <section ref={sectionRef} className="section" aria-label="testimonials">
      <div className="section-inner">
        <div ref={titleRef} className="text-center mb-14">
          <div className="label mb-4">{t.trusted.label}</div>
          <h2 className="heading-lg">
            <span className="gradient-text">{t.testimonials.title}</span>
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
        >
          {testimonials.map((item, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const initials = item.role
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase();

            return (
              <figure
                key={item.author + item.role}
                className="relative rounded-2xl border p-7 sm:p-8 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:
                    "linear-gradient(180deg, var(--card-grad-a) 0%, var(--card-grad-b) 100%)",
                  backdropFilter: "blur(20px) saturate(170%)",
                  WebkitBackdropFilter: "blur(20px) saturate(170%)",
                  borderColor: "var(--glass-border)",
                  boxShadow:
                    "var(--glass-outer-shadow), inset 0 1px 0 var(--glass-highlight)",
                }}
              >
                {/* Quote mark */}
                <span
                  className="absolute top-5 right-7 text-6xl leading-none select-none pointer-events-none"
                  style={{
                    fontFamily: "var(--font-heading)",
                    color: accent,
                    opacity: 0.14,
                  }}
                  aria-hidden="true"
                >
                  &ldquo;
                </span>

                {/* Stars */}
                <div className="flex gap-1" role="img" aria-label="5/5">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <svg
                      key={s}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={accent}
                      style={{ opacity: 0.85 }}
                    >
                      <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                    </svg>
                  ))}
                </div>

                <blockquote
                  className="text-sm sm:text-base leading-relaxed flex-1"
                  style={{ color: "var(--color-vt-text-muted)" }}
                >
                  {item.quote}
                </blockquote>

                <figcaption
                  className="flex items-center gap-3 pt-2 border-t"
                  style={{ borderColor: "var(--glass-border)" }}
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      fontFamily: "var(--font-heading)",
                      background: `${accent}18`,
                      border: `1px solid ${accent}40`,
                      color: accent,
                    }}
                  >
                    {initials}
                  </span>
                  <span className="min-w-0">
                    <span
                      className="block text-sm font-semibold truncate"
                      style={{ color: "var(--color-vt-text)" }}
                    >
                      {item.author}
                    </span>
                    <span
                      className="block text-xs font-mono truncate"
                      style={{ color: accent }}
                    >
                      {item.role}
                    </span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
