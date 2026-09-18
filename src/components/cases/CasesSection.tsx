"use client";
/* eslint-disable max-lines-per-function, @next/next/no-img-element -- case grid and detail sheet share selection state. */

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { CASES } from "@/lib/constants";
import CaseCard from "./CaseCard";
import { useLanguage } from "@/providers/LanguageProvider";
import { CARD_CONTENT } from "@/lib/i18n-data";

gsap.registerPlugin(ScrollTrigger);

/**
 * Large live screenshot used inside the expanded modal.
 * Single <img> always mounted; fades in when complete (event + ref + polling
 * safety nets so the modal never gets stuck on the placeholder).
 */
function ModalPreview({ url, color }: { url: string; color: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const src = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

  const handleRef = (node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const img = imgRef.current;
      if (img?.complete) {
        if (img.naturalWidth > 0) setLoaded(true);
        else setFailed(true);
        clearInterval(interval);
      }
    }, 300);
    const timeout = setTimeout(() => clearInterval(interval), 25000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div
      className="relative w-full aspect-[16/9] overflow-hidden rounded-xl border"
      style={{ background: "#0a0a1a", borderColor: `${color}25` }}
    >
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${color}12, #0a0a1a 70%)`,
          }}
        >
          {!failed && (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: color, opacity: 0.5 }}
                  animate={{ y: [0, -8, 0], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {!failed && (
      <img
          ref={handleRef}
          src={src}
          alt={`Screenshot do site ${url}`}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

export default function CasesSection() {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState<string | null>(null);

  // Card copy follows the active locale (category, tagline, description, metrics, tags)
  const localizedCases = CASES.map((c) => ({
    ...c,
    ...CARD_CONTENT[locale].cases[c.id],
  }));

  // Close on Escape key + lock body scroll while modal is open
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveCase(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!activeCase) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeCase]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const c = localizedCases.find((cs) => cs.id === activeCase);

  return (
    <section ref={sectionRef} id="cases" className="section">
      <div className="section-inner">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16">
          <div className="label mb-4">{t.cases.label}</div>
          <h2 className="heading-lg mb-6">
            {t.cases.title1}
            <br />
            <span className="gradient-text">{t.cases.title2}</span>
          </h2>
          <p className="body-lg max-w-2xl">{t.cases.subtitle}</p>
          <Link
            href="/cases"
            className="mt-6 inline-flex min-h-11 items-center gap-3 rounded-xl border border-cyan-300/40 bg-gradient-to-r from-cyan-300 to-violet-400 px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-slate-950 shadow-[0_10px_30px_-12px_rgba(0,240,255,.8)] transition-all duration-300 hover:-translate-y-0.5 hover:gap-4 hover:shadow-[0_14px_34px_-12px_rgba(139,92,246,.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
          >
            {t.cases.exploreAll}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Cases Grid — responsive staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {localizedCases.map((caseStudy, index) => (
            <CaseCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              onExpand={() => setActiveCase(caseStudy.id)}
            />
          ))}
        </div>

        {/* Expanded Case Detail Modal */}
        <AnimatePresence>
          {activeCase && c && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-label={c.title}
              style={{ background: "rgba(5, 5, 16, 0.88)", backdropFilter: "blur(14px)" }}
              onClick={() => setActiveCase(null)}
            >
              <motion.div
                layoutId={`case-${activeCase}`}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-4xl rounded-2xl border shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto"
                style={{
                  background: "var(--color-vt-bg-card)",
                  borderColor: "rgba(255,255,255,0.10)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* ── HERO: Screenshot with overlaid browser bar ── */}
                <div className="relative">
                  <ModalPreview url={c.liveUrl} color={c.color} />

                  {/* Browser bar overlay */}
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex gap-1.5 flex-shrink-0">
                        <span className="w-3 h-3 rounded-full bg-red-500/80" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] font-mono min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="text-zinc-300 truncate">{c.liveUrl}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveCase(null)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10 transition-colors flex-shrink-0"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                      aria-label="Fechar modal"
                      data-i18n-ignore
                    >
                      ✕
                    </button>
                  </div>

                  {/* Floating CTA on the screenshot */}
                  <a
                    href={c.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      background: c.color,
                      color: "#050510",
                      boxShadow: `0 10px 30px -8px ${c.color}90`,
                    }}
                  >
                    <span>{t.cases.visitProject}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 12L12 4M12 4H5M12 4v7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>

                {/* ── CONTENT: well-spaced, clear hierarchy ── */}
                <div className="p-6 sm:p-10 space-y-8">
                  {/* Title block */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span
                        className="text-[11px] uppercase font-mono font-semibold tracking-wider px-3 py-1.5 rounded-full border"
                        style={{
                          color: c.color,
                          borderColor: `${c.color}40`,
                          background: `${c.color}10`,
                        }}
                      >
                        {c.category}
                      </span>
                      <span
                        className="text-xs font-mono px-3 py-1.5 rounded-full border"
                        style={{
                          color: "var(--color-vt-text-dim)",
                          borderColor: "rgba(255,255,255,0.10)",
                        }}
                      >
                        {c.year}
                      </span>
                      <span className="text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
                        {c.client}
                      </span>
                    </div>

                    <h3
                      className="text-3xl sm:text-4xl font-bold tracking-tight mb-2"
                      style={{ fontFamily: "var(--font-heading)", color: "var(--color-vt-text)" }}
                    >
                      {c.title}
                    </h3>
                    <p className="text-sm sm:text-base font-mono" style={{ color: `${c.color}cc` }}>
                      {c.tagline}
                    </p>
                  </div>

                  {/* Metrics banner */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-5 rounded-xl border"
                    style={{
                      background: `${c.color}08`,
                      borderColor: `${c.color}30`,
                    }}
                  >
                    <div className="flex items-center gap-2.5 flex-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
                        style={{ background: c.color }}
                      />
                      <span className="text-sm font-mono font-medium text-white">{c.metrics}</span>
                    </div>
                    <span
                      className="text-[10px] font-mono px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        background: "rgba(0, 230, 118, 0.10)",
                        color: "var(--color-vt-success)",
                        border: "1px solid rgba(0, 230, 118, 0.25)",
                      }}
                    >
                      {t.cases.production}
                    </span>
                  </div>

                  {/* Description */}
                  <div>
                    <div
                      className="text-[11px] font-mono uppercase tracking-widest mb-3"
                      style={{ color: "var(--color-vt-text-dim)" }}
                    >
                      {t.cases.aboutProject}
                    </div>
                    <p
                      className="text-sm sm:text-base leading-relaxed"
                      style={{ color: "var(--color-vt-text-muted)" }}
                    >
                      {c.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div>
                    <div
                      className="text-[11px] font-mono uppercase tracking-widest mb-3"
                      style={{ color: "var(--color-vt-text-dim)" }}
                    >
                      {t.cases.techStack}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{
                            background: `${c.color}12`,
                            color: c.color,
                            border: `1px solid ${c.color}30`,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer note + study CTA */}
                  <div
                    className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <span className="text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
                      {t.cases.deployNote}
                    </span>
                    <Link
                      href={`/cases/${c.id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold tracking-wide transition-all duration-300 hover:scale-105 flex-shrink-0"
                      style={{
                        background: `${c.color}12`,
                        border: `1px solid ${c.color}40`,
                        color: c.color,
                      }}
                    >
                      {t.cases.viewStudy}
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
