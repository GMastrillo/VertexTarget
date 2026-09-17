"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { ServiceItem } from "@/lib/constants";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
    setTilt({ x: y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="service-card gradient-border flex-shrink-0 w-[85vw] max-w-[400px] min-w-[280px] sm:w-[380px] md:w-[400px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        minHeight: "460px",
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="relative h-full p-6 sm:p-8 flex flex-col justify-between rounded-2xl"
        style={{ background: "var(--color-vt-bg-card)" }}
      >
        {/* Number */}
        <div>
          <span
            className="text-7xl font-bold block mb-8"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-vt-border)",
            }}
          >
            {service.number}
          </span>

          {/* Title */}
          <h3
            className="text-2xl font-semibold mb-4 whitespace-pre-line"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-vt-text)",
            }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--color-vt-text-muted)" }}
          >
            {service.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: "rgba(0, 240, 255, 0.08)",
                color: "var(--color-vt-accent-cyan)",
                border: "1px solid rgba(0, 240, 255, 0.15)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 240, 255, 0.06), transparent 60%)",
          }}
        />
      </div>
    </motion.div>
  );
}
