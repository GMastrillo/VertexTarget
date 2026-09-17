"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EXPERIENCE } from "@/lib/constants";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Draw timeline line progressively
      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleY: 0,
          duration: 1.5,
          ease: "power2.out",
          transformOrigin: "top",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 1,
          },
        });
      }

      // Reveal each entry
      const entries = timelineRef.current?.querySelectorAll(".timeline-entry");
      entries?.forEach((entry, i) => {
        gsap.from(entry, {
          x: i % 2 === 0 ? -40 : 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: entry,
            start: "top 85%",
          },
        });
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      <h3
        className="heading-sm mb-12"
        style={{ color: "var(--color-vt-text)" }}
      >
        Trajetória
      </h3>

      <div className="relative">
        {/* Vertical Line */}
        <div
          ref={lineRef}
          className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(180deg, var(--color-vt-accent-cyan), var(--color-vt-accent-violet), transparent)",
          }}
        />

        {/* Entries */}
        <div className="space-y-12 md:space-y-16">
          {EXPERIENCE.map((entry, index) => (
            <div
              key={entry.id}
              className={`timeline-entry relative flex flex-col md:flex-row gap-6 md:gap-12 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div
                className="absolute left-4 md:left-1/2 top-2 -translate-x-1/2 z-10"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: entry.isFoundation
                      ? "var(--color-vt-accent-cyan)"
                      : "var(--color-vt-accent-violet)",
                    boxShadow: entry.isFoundation
                      ? "0 0 20px rgba(0, 240, 255, 0.5), 0 0 40px rgba(0, 240, 255, 0.2)"
                      : "0 0 10px rgba(139, 92, 246, 0.3)",
                  }}
                />
              </div>

              {/* Content */}
              <div
                className={`flex-1 pl-12 md:pl-0 ${
                  index % 2 === 0
                    ? "md:text-right md:pr-16"
                    : "md:text-left md:pl-16"
                }`}
              >
                <div
                  className={`rounded-2xl p-6 md:p-8 relative overflow-hidden ${
                    entry.isFoundation ? "gradient-border" : ""
                  }`}
                  style={{
                    background: entry.isFoundation
                      ? "var(--color-vt-bg-elevated)"
                      : "var(--color-vt-bg-card)",
                  }}
                >
                  {/* Foundation Badge */}
                  {entry.isFoundation && (
                    <div
                      className={`mb-4 flex items-center gap-2 ${
                        index % 2 === 0 ? "justify-start md:justify-end" : "justify-start"
                      }`}
                    >
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                        style={{
                          background: "rgba(0, 240, 255, 0.12)",
                          color: "var(--color-vt-accent-cyan)",
                          border: "1px solid rgba(0, 240, 255, 0.25)",
                        }}
                      >
                        ⚡ Foundation
                      </span>
                    </div>
                  )}

                  {/* Period */}
                  <div
                    className="text-xs font-mono tracking-wider mb-2"
                    style={{
                      color: entry.isFoundation
                        ? "var(--color-vt-accent-cyan)"
                        : "var(--color-vt-text-dim)",
                    }}
                  >
                    {entry.period}
                  </div>

                  {/* Role & Company */}
                  <h4
                    className="text-lg font-semibold mb-1"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: "var(--color-vt-text)",
                    }}
                  >
                    {entry.role}
                  </h4>
                  <div
                    className="text-sm font-medium mb-3"
                    style={{
                      color: entry.isFoundation
                        ? "var(--color-vt-accent-cyan)"
                        : "var(--color-vt-accent-violet)",
                    }}
                  >
                    {entry.company}
                  </div>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{
                      color: "var(--color-vt-text-muted)",
                      textAlign: "left",
                    }}
                  >
                    {entry.description}
                  </p>

                  {/* Tags */}
                  <div
                    className={`flex flex-wrap gap-1.5 ${
                      index % 2 === 0 ? "justify-start md:justify-end" : "justify-start"
                    }`}
                  >
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          background: entry.isFoundation
                            ? "rgba(0, 240, 255, 0.08)"
                            : "rgba(139, 92, 246, 0.08)",
                          color: entry.isFoundation
                            ? "var(--color-vt-accent-cyan)"
                            : "var(--color-vt-accent-violet)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Foundation glow effect */}
                  {entry.isFoundation && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at 50% 50%, rgba(0, 240, 255, 0.05), transparent 60%)",
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden md:block flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
