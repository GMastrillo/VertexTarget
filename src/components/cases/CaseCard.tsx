"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/constants";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  onExpand: () => void;
}/**
 * Branded card backdrop. Remote screenshots are intentionally kept in the
 * detail modal only; card previews can become stale and duplicate old CTAs.
 */
function SitePreview({ color }: { color: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      aria-hidden="true"
      style={{
        background: `radial-gradient(circle at 80% 20%, ${color}28, var(--color-vt-surface) 55%, var(--color-vt-bg) 100%)`,
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(145deg, ${color}14, transparent 45%, rgba(5,5,16,.72))`,
        }}
      />
      <div
        className="absolute -right-20 top-16 h-64 w-64 rounded-full blur-3xl"
        style={{ background: `${color}20` }}
      />
    </div>
  );
}

export default function CaseCard({ caseStudy, index, onExpand }: CaseCardProps) {
  const t = useT();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      });
    });

    return () => ctx.revert();
  }, [index]);

  const isLarge = index === 0 || index === 3;

  return (
    <motion.div
      ref={cardRef}
      layoutId={`case-${caseStudy.id}`}
      className={`relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
        isLarge ? "md:col-span-2" : ""
      }`}
      style={{
        minHeight: isLarge ? "440px" : "460px",
        background: "var(--color-vt-surface)",
        borderColor: isHovered ? `${caseStudy.color}55` : "var(--glass-border)",
        boxShadow: isHovered
          ? `0 24px 60px -18px ${caseStudy.color}30`
          : "0 12px 40px -18px rgba(0,0,0,0.55)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Full-bleed screenshot background */}
      <div className="absolute inset-0">
        <SitePreview color={caseStudy.color} />
      </div>

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-60 group-hover:opacity-100 z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${caseStudy.color}, transparent)`,
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 h-full p-7 md:p-8 flex flex-col justify-between">
        {/* Card Header — category + year + external link */}
        <div className="flex items-start justify-between gap-4">
          <span
            className="label text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full"
            style={{
              color: caseStudy.color,
              background: "rgba(5, 5, 16, 0.65)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${caseStudy.color}30`,
            }}
          >
            {caseStudy.category}
          </span>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono px-2.5 py-1.5 rounded-full border"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                color: "var(--color-vt-text-muted)",
                background: "rgba(5, 5, 16, 0.65)",
                backdropFilter: "blur(8px)",
              }}
            >
              {caseStudy.year}
            </span>

            <a
              href={caseStudy.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: "rgba(5, 5, 16, 0.65)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${caseStudy.color}40`,
                color: caseStudy.color,
              }}
              title={t.cases.openProject}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path
                  d="M4 12L12 4M12 4H5M12 4v7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* Card Body — bottom aligned over the screenshot */}
        <div className="mt-auto pt-6">
          <h3
            className="text-2xl md:text-3xl font-bold tracking-tight mb-1.5 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-heading)",
              /* Always white: sits over the dark gradient on top of the screenshot */
              color: isHovered ? caseStudy.color : "#ffffff",
            }}
          >
            {caseStudy.title}
          </h3>

          <p
            className="text-xs md:text-sm font-mono mb-3"
            style={{ color: `${caseStudy.color}dd` }}
          >
            {caseStudy.tagline}
          </p>

          <p
            className="text-sm leading-relaxed mb-4 max-w-2xl"
            style={{
              /* Fixed light color — always sits over the dark gradient overlay */
              color: "rgba(255,255,255,0.75)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {caseStudy.description}
          </p>

          {/* Metrics + tags row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
              style={{
                background: `${caseStudy.color}12`,
                borderColor: `${caseStudy.color}30`,
                color: caseStudy.color,
                backdropFilter: "blur(6px)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: caseStudy.color }}
              />
              {caseStudy.metrics}
            </span>
          </div>

          {/* Study link — only for cases with an architecture study */}
          <Link
            href={`/cases/${caseStudy.id}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-mono font-semibold tracking-wide shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 group/study"
            style={{
              color: "#050510",
              background: `linear-gradient(110deg, ${caseStudy.color}, #a78bfa)`,
              borderColor: `${caseStudy.color}99`,
              boxShadow: `0 8px 24px -10px ${caseStudy.color}`,
            }}
          >
            <span
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black/10 transition-transform duration-300 group-hover/study:scale-110"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H5M12 4v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {t.cases.viewStudy}
          </Link>

          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  background: "rgba(5, 5, 16, 0.55)",
                  backdropFilter: "blur(6px)",
                  color: "var(--color-vt-text-muted)",
                  border: "1px solid rgba(255,255,255,0.10)",
                }}
              >
                {tag}
              </span>
            ))}
            {caseStudy.tags.length > 5 && (
              <span
                className="px-2 py-1 rounded-full text-[10px] font-mono"
                style={{ color: "var(--color-vt-text-dim)", background: "rgba(5,5,16,0.55)" }}
              >
                +{caseStudy.tags.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
