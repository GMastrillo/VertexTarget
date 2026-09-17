"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ServiceItem } from "@/lib/constants";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

const CARD_ICONS: Record<string, React.ReactNode> = {
  "ai-automation": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  "web-development": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "digital-strategy": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  "system-integration": (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="4" width="8" height="6" rx="1" />
      <rect x="14" y="14" width="8" height="6" rx="1" />
      <path d="M6 10v4a2 2 0 0 0 2 2h6" />
      <path d="M18 14v-4a2 2 0 0 0-2-2h-6" />
    </svg>
  ),
  infrastructure: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <rect x="2" y="14" width="20" height="7" rx="2" />
      <rect x="2" y="3" width="20" height="7" rx="2" />
      <line x1="6" y1="6.5" x2="6.01" y2="6.5" />
      <line x1="6" y1="17.5" x2="6.01" y2="17.5" />
    </svg>
  ),
};

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 10 });
    setGlow({ x: px * 100, y: py * 100, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setGlow((g) => ({ ...g, active: false }));
  };

  const isEven = index % 2 === 0;
  const accent = isEven ? "var(--color-vt-accent-cyan)" : "var(--color-vt-accent-violet)";
  const accentRgb = isEven ? "0, 240, 255" : "139, 92, 246";

  return (
    <motion.div
      ref={cardRef}
      className="service-card flex-shrink-0 w-[82vw] max-w-[400px] min-w-[280px] sm:w-[380px] md:w-[400px] h-[480px] rounded-2xl relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        background:
          "linear-gradient(180deg, rgba(15, 15, 36, 0.95) 0%, rgba(10, 10, 26, 0.98) 100%)",
        border: `1px solid ${glow.active ? `rgba(${accentRgb}, 0.45)` : "rgba(255, 255, 255, 0.07)"}`,
        boxShadow: glow.active
          ? `0 24px 60px -20px rgba(${accentRgb}, 0.35), inset 0 1px 0 rgba(255,255,255,0.05)`
          : "0 12px 40px -18px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      {/* Mouse-follow glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: glow.active ? 1 : 0,
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(${accentRgb}, 0.10), transparent 55%)`,
        }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          opacity: 0.7,
        }}
      />

      {/* Filled content — flex column, evenly distributed */}
      <div className="relative z-10 h-full p-7 sm:p-8 flex flex-col">
        {/* Top row: number + icon */}
        <div className="flex items-start justify-between mb-6">
          <span
            className="text-5xl font-black leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              color: "rgba(255, 255, 255, 0.10)",
            }}
          >
            {service.number}
          </span>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `rgba(${accentRgb}, 0.10)`,
              border: `1px solid rgba(${accentRgb}, 0.30)`,
              color: accent,
              boxShadow: `0 0 16px rgba(${accentRgb}, 0.15)`,
            }}
          >
            {CARD_ICONS[service.id] ?? CARD_ICONS["ai-automation"]}
          </div>
        </div>

        {/* Title */}
        <h3
          className="text-xl sm:text-2xl font-semibold mb-3 leading-snug tracking-tight whitespace-pre-line"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-vt-text)",
          }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-6 flex-1"
          style={{ color: "var(--color-vt-text-muted)" }}
        >
          {service.description}
        </p>

        {/* Bottom: tags pinned at card bottom */}
        <div className="pt-5 border-t border-white/[0.06]">
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                style={{
                  background: `rgba(${accentRgb}, 0.08)`,
                  color: accent,
                  border: `1px solid rgba(${accentRgb}, 0.18)`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
