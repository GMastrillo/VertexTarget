"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/providers/LanguageProvider";

const SkillsOrbit = dynamic(() => import("./SkillsOrbit"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[380px] rounded-2xl flex items-center justify-center my-12 border"
      style={{
        background: "var(--color-vt-bg-card)",
        borderColor: "var(--color-vt-border)",
      }}
    >
      <div className="text-xs font-mono animate-pulse" style={{ color: "var(--color-vt-text-dim)" }}>
        Carregando Constelação 3D de Habilidades...
      </div>
    </div>
  ),
});

gsap.registerPlugin(ScrollTrigger);

/* Visual accents per CEO (colors don't translate; copy comes from i18n) */
const CEO_ACCENTS = [
  { accent: "#00f0ff", accentRgb: "0, 240, 255" },
  { accent: "#8b5cf6", accentRgb: "139, 92, 246" },
];

export default function AboutSection() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current.children,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: titleRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    // Recalculate trigger positions after layout settles (dynamic imports,
    // pin-spacers from sections above and font loading shift offsets)
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    const t1 = window.setTimeout(() => ScrollTrigger.refresh(), 600);
    const t2 = window.setTimeout(() => ScrollTrigger.refresh(), 1800);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ctx.revert();
    };
    // Re-create animations when language changes so the new DOM nodes animate
  }, [t]);

  return (
    <section ref={sectionRef} id="about" className="section">
      <div className="section-inner">
        {/* Section Header */}
        <div ref={titleRef} className="mb-14">
          <div className="label mb-4">{t.about.label}</div>
          <h2 className="heading-lg mb-6">
            {t.about.title1}
            <br />
            <span className="gradient-text">{t.about.title2}</span>
          </h2>
          <p className="body-lg max-w-3xl">{t.about.subtitle}</p>
        </div>

        {/* CEO Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {t.about.ceos.map((ceo, i) => {
            const { accent, accentRgb } = CEO_ACCENTS[i] ?? CEO_ACCENTS[0];
            return (
            <div
              key={ceo.name}
              className="p-8 md:p-10 rounded-2xl border relative overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(180deg, var(--card-grad-a) 0%, var(--card-grad-b) 100%)",
                backdropFilter: "blur(20px) saturate(170%)",
                WebkitBackdropFilter: "blur(20px) saturate(170%)",
                borderColor: "var(--glass-border)",
                boxShadow: "var(--glass-outer-shadow), inset 0 1px 0 var(--glass-highlight)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${accentRgb}, 0.45)`;
                e.currentTarget.style.boxShadow = `0 24px 60px -20px rgba(${accentRgb}, 0.25)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--glass-border)";
                e.currentTarget.style.boxShadow =
                  "var(--glass-outer-shadow), inset 0 1px 0 var(--glass-highlight)";
              }}
            >
              {/* Top glow accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
                }}
              />

              {/* Corner radial glow */}
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, rgba(${accentRgb}, 0.14), transparent 70%)`,
                }}
              />

              {/* Header: avatar + badge */}
              <div className="flex items-start justify-between mb-7">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl tracking-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    background: `linear-gradient(135deg, rgba(${accentRgb}, 0.18), rgba(${accentRgb}, 0.06))`,
                    border: `1px solid rgba(${accentRgb}, 0.35)`,
                    color: accent,
                    boxShadow: `0 0 24px rgba(${accentRgb}, 0.15)`,
                  }}
                >
                  {ceo.initials}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                    style={{
                      background: `rgba(${accentRgb}, 0.10)`,
                      color: accent,
                      borderColor: `rgba(${accentRgb}, 0.30)`,
                    }}
                  >
                    {ceo.badge}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
                    {ceo.side}
                  </span>
                </div>
              </div>

              {/* Name & role */}
              <h3
                className="text-2xl md:text-3xl font-bold mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-vt-text)" }}
              >
                {ceo.name}
              </h3>
              <p
                className="text-xs md:text-sm font-mono mb-6"
                style={{ color: accent }}
              >
                {ceo.subtitle}
              </p>

              {/* Bio */}
              <p
                className="text-sm leading-relaxed mb-8 flex-1"
                style={{ color: "var(--color-vt-text-muted)" }}
              >
                {ceo.bio}
              </p>

              {/* Tags */}
              <div className="pt-6 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-2">
                  {ceo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono"
                      style={{
                        color: `${accent}dd`,
                        border: `1px solid rgba(${accentRgb}, 0.20)`,
                        background: `rgba(${accentRgb}, 0.05)`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 py-8 border-t border-b"
          style={{ borderColor: "var(--color-vt-border)" }}
        >
          {t.about.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold mb-2 gradient-text"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-wider uppercase"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3D Skills Constellation */}
        <SkillsOrbit />
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
