"use client";

import { useRef, useState, useEffect } from "react";
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
 * Live site screenshot — free, no API key (Microlink screenshot API, cached).
 * Single <img> always mounted; fades in when complete (event + ref + polling
 * safety nets so the card never gets stuck on the placeholder).
 */
function SitePreview({ url, color }: { url: string; color: string }) {
  const t = useT();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const src = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

  // Safety net #1: image may already be complete when the ref attaches (cached)
  const handleRef = (node: HTMLImageElement | null) => {
    imgRef.current = node;
    if (node && node.complete && node.naturalWidth > 0) setLoaded(true);
  };

  // Safety net #2: poll for completion in case the load event is missed
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
      className="relative w-full h-full overflow-hidden"
      style={{ background: "var(--color-vt-surface)" }}
    >
      {/* Placeholder while loading / on failure */}
      {!loaded && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${color}18, var(--color-vt-surface) 70%)`,
          }}
        >
          {!failed && (
            <div className="text-center">
              <div className="flex gap-1.5 justify-center mb-3">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: color, opacity: 0.5 }}
                    animate={{ y: [0, -6, 0], opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <span
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: `${color}88` }}
              >
                {t.ui.loadingPreview}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Screenshot — always mounted, fades in when ready */}
      {!failed && (
        <img
          ref={handleRef}
          src={src}
          alt={`Preview do site ${url}`}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}

      {/* Gradient overlays for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,5,16,0.55) 0%, rgba(5,5,16,0.15) 30%, rgba(5,5,16,0.65) 70%, rgba(10,10,26,0.97) 100%)",
        }}
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
        <SitePreview url={caseStudy.liveUrl} color={caseStudy.color} />
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
