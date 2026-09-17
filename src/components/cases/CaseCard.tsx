"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CaseStudy } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

interface CaseCardProps {
  caseStudy: CaseStudy;
  index: number;
  onExpand: () => void;
}

export default function CaseCard({ caseStudy, index, onExpand }: CaseCardProps) {
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
        minHeight: isLarge ? "420px" : "380px",
        background: "var(--color-vt-bg-card)",
        borderColor: isHovered ? `${caseStudy.color}60` : "var(--color-vt-border)",
        boxShadow: isHovered ? `0 20px 50px -15px ${caseStudy.color}25` : "none",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onExpand}
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Gradient Background */}
      <div
        className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle at 25% 75%, ${caseStudy.color}35, transparent 65%)`,
        }}
      />

      {/* Subtle Grid Pattern on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${caseStudy.color}0a 1px, transparent 1px),
            linear-gradient(90deg, ${caseStudy.color}0a 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Banner Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 opacity-60 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${caseStudy.color}, transparent)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full p-7 md:p-8 flex flex-col justify-between">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className="label text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: caseStudy.color }}
              >
                {caseStudy.category}
              </span>
              <span className="text-[11px] opacity-40">•</span>
              <span
                className="text-[11px] font-mono tracking-wider"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {caseStudy.client}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono px-2.5 py-1 rounded-full border"
              style={{
                borderColor: `${caseStudy.color}30`,
                color: "var(--color-vt-text-dim)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {caseStudy.year}
            </span>

            {/* Direct External Link Icon */}
            <a
              href={caseStudy.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{
                background: `${caseStudy.color}15`,
                border: `1px solid ${caseStudy.color}40`,
                color: caseStudy.color,
              }}
              title="Abrir projeto em nova aba"
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

        {/* Card Body */}
        <div className="my-auto pt-6 pb-4">
          <h3
            className="heading-md mb-2 transition-colors duration-300 tracking-tight"
            style={{
              color: isHovered ? caseStudy.color : "var(--color-vt-text)",
            }}
          >
            {caseStudy.title}
          </h3>

          <p
            className="text-xs md:text-sm font-mono mb-3"
            style={{ color: `${caseStudy.color}cc` }}
          >
            {caseStudy.tagline}
          </p>

          <p
            className="body-md max-w-2xl mb-5 line-clamp-2"
            style={{ color: "var(--color-vt-text-muted)" }}
          >
            {caseStudy.description}
          </p>

          {/* Metric Pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border mb-5 text-xs font-mono"
            style={{
              background: `${caseStudy.color}0a`,
              borderColor: `${caseStudy.color}25`,
              color: caseStudy.color,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: caseStudy.color }}
            />
            <span>{caseStudy.metrics}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {caseStudy.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide"
                style={{
                  background: `${caseStudy.color}10`,
                  color: `${caseStudy.color}dd`,
                  border: `1px solid ${caseStudy.color}25`,
                }}
              >
                {tag}
              </span>
            ))}
            {caseStudy.tags.length > 4 && (
              <span
                className="px-2 py-1 rounded-full text-[10px] font-mono opacity-60"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                +{caseStudy.tags.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
          <span
            className="text-xs font-mono uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: "var(--color-vt-text-dim)" }}
          >
            <span>Ver Estudo & Arquitetura</span>
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </span>

          <a
            href={caseStudy.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200"
            style={{
              color: caseStudy.color,
              background: `${caseStudy.color}15`,
              border: `1px solid ${caseStudy.color}35`,
            }}
          >
            <span>Live Demo</span>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
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
    </motion.div>
  );
}
