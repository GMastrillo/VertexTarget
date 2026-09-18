"use client";
/* eslint-disable max-lines-per-function -- this page is a cohesive case-study composition. */

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CASES } from "@/lib/constants";
import { getCaseStudy } from "@/lib/case-studies";
import { useLanguage } from "@/providers/LanguageProvider";
import ThemeToggle from "@/components/layout/ThemeToggle";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

function SiteShot({ url, color }: { url: string; color: string }) {
  const [loaded, setLoaded] = useState(false);
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
      className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl border"
      style={{ background: "#0a0a1a", borderColor: `${color}30` }}
    >
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `radial-gradient(circle at 50% 40%, ${color}14, #0a0a1a 70%)` }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: `${color}88` }}>
            …
          </span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element -- case screenshots use runtime URLs from the case registry. */}
      <img
        ref={handleRef}
        src={src}
        alt={`Screenshot ${url}`}
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default function CaseStudyClient({ slug }: { slug: string }) {
  const { t, locale } = useLanguage();
  const item = CASES.find((c) => c.id === slug);
  const study = getCaseStudy(slug, locale === "pt" ? "pt" : locale);
  const pageRef = useRef<HTMLDivElement>(null);

  if (!item || !study) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p style={{ color: "var(--color-vt-text-muted)" }}>{t.caseStudy.notFound}</p>
      </main>
    );
  }

  return (
    <div ref={pageRef} className="min-h-screen" style={{ background: "var(--color-vt-bg)" }}>
      {/* Mini-nav */}
      <header
        className="sticky top-0 z-50 liquid-glass px-5 sm:px-8 py-3 flex items-center justify-between"
      >
        <Link
          href="/#cases"
          className="flex items-center gap-2 text-sm font-medium transition-colors"
          style={{ color: "var(--color-vt-text-muted)" }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M12 8H4M8 4L4 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t.caseStudy.back}
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="section-inner pt-12 pb-24 max-w-4xl">
        {/* Hero */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span
              className="text-[11px] uppercase font-mono font-semibold tracking-wider px-3 py-1.5 rounded-full border"
              style={{ color: item.color, borderColor: `${item.color}40`, background: `${item.color}10` }}
            >
              {item.category}
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full border" style={{ color: "var(--color-vt-text-dim)", borderColor: "var(--glass-border)" }}>
              {item.year}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--color-vt-success)" }} />
              {t.caseStudy.liveLabel}
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-vt-text)" }}
          >
            {item.title}
          </h1>
          <p className="text-base font-mono mb-8" style={{ color: `${item.color}cc` }}>
            {item.tagline}
          </p>

          <SiteShot url={item.liveUrl} color={item.color} />

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ background: item.color, color: "#050510", boxShadow: `0 10px 30px -8px ${item.color}90` }}
            >
              {t.caseStudy.visit}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H5M12 4v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <span className="text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
              {item.client}
            </span>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-14">
          <h2
            className="text-[11px] font-mono uppercase tracking-widest mb-4"
            style={{ color: "var(--color-vt-accent-cyan)" }}
          >
            {t.caseStudy.overview}
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-vt-text-muted)" }}>
            {study.summary}
          </p>
        </section>

        {/* Metrics banner */}
        <div
          className="flex items-center gap-3 p-5 rounded-xl border mb-14"
          style={{ background: `${item.color}08`, borderColor: `${item.color}30` }}
        >
          <span className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" style={{ background: item.color }} />
          <span className="text-sm font-mono font-medium" style={{ color: "var(--color-vt-text)" }}>
            {item.metrics}
          </span>
        </div>

        {/* Layers */}
        <section className="mb-14">
          <h2
            className="text-[11px] font-mono uppercase tracking-widest mb-6"
            style={{ color: "var(--color-vt-accent-cyan)" }}
          >
            {t.caseStudy.layers}
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {study.layers.map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border p-6"
                style={{
                  background: "linear-gradient(180deg, var(--card-grad-a) 0%, var(--card-grad-b) 100%)",
                  borderColor: "var(--glass-border)",
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: `${item.color}15`, border: `1px solid ${item.color}35`, color: item.color }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-base font-semibold leading-snug"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--color-vt-text)" }}
                  >
                    {layer.title}
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {layer.items.map((li) => (
                    <li key={li} className="flex gap-2.5 text-sm leading-relaxed" style={{ color: "var(--color-vt-text-muted)" }}>
                      <span className="flex-shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ background: item.color }} />
                      {li}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mb-14">
          <h2
            className="text-[11px] font-mono uppercase tracking-widest mb-5"
            style={{ color: "var(--color-vt-accent-cyan)" }}
          >
            {t.caseStudy.features}
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {study.features.map((f) => (
              <span
                key={f}
                className="px-4 py-2 rounded-xl text-sm"
                style={{
                  background: `${item.color}10`,
                  color: item.color,
                  border: `1px solid ${item.color}30`,
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section className="mb-14">
          <h2
            className="text-[11px] font-mono uppercase tracking-widest mb-6"
            style={{ color: "var(--color-vt-accent-cyan)" }}
          >
            {t.caseStudy.challenges}
          </h2>
          <div className="space-y-5">
            {study.challenges.map((c) => (
              <motion.div
                key={c.problem}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border p-6 sm:p-7"
                style={{
                  background: "linear-gradient(180deg, var(--card-grad-a) 0%, var(--card-grad-b) 100%)",
                  borderColor: "var(--glass-border)",
                }}
              >
                <div className="flex gap-3 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider flex-shrink-0" style={{ color: "var(--color-vt-error)" }}>
                    ↓
                  </span>
                  <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--color-vt-text)" }}>
                    {c.problem}
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider flex-shrink-0" style={{ color: "var(--color-vt-success)" }}>
                    ↑
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-vt-text-muted)" }}>
                    {c.solution}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="mb-16">
          <h2
            className="text-[11px] font-mono uppercase tracking-widest mb-6"
            style={{ color: "var(--color-vt-accent-cyan)" }}
          >
            {t.caseStudy.results}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {study.results.map((r) => (
              <div
                key={r}
                className="flex items-center gap-3 p-4 rounded-xl border"
                style={{ background: "var(--card-grad-a)", borderColor: "var(--glass-border)" }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="var(--color-vt-success)" strokeWidth="1.4" />
                  <path d="M5 8.2l2 2 4-4.4" stroke="var(--color-vt-success)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-sm" style={{ color: "var(--color-vt-text)" }}>
                  {r}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div
          className="rounded-2xl border p-8 sm:p-10 text-center"
          style={{
            background: `linear-gradient(135deg, ${item.color}0d, transparent 60%)`,
            borderColor: "var(--glass-border)",
          }}
        >
          <h3
            className="text-2xl sm:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-vt-text)" }}
          >
            {t.contact.title1} <span className="gradient-text">{t.contact.title2}</span>
          </h3>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 mt-4 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(90deg, var(--color-vt-accent-cyan), var(--color-vt-accent-violet))",
              color: "#050510",
              boxShadow: "0 10px 30px -8px rgba(0, 240, 255, 0.4)",
            }}
          >
            {t.hero.ctaPrimary}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
