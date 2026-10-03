"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { DEMO_SITES } from "./laptop/laptop-data";
import LaptopScreenContent from "./laptop/LaptopScreenContent";

export default function Laptop3DShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % DEMO_SITES.length);
    }, 4800);
    return () => clearInterval(interval);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const currentSite = DEMO_SITES[activeIndex];
  const rotY = mousePos.x * 14;
  const rotX = 14 - mousePos.y * 10;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto w-full max-w-5xl py-8 select-none"
    >
      {/* Perspective Wrapper */}
      <div
        className="relative mx-auto transition-transform duration-500 ease-out"
        style={{
          perspective: "2600px",
          perspectiveOrigin: "50% 36%",
        }}
      >
        {/* 3D World */}
        <div
          className="relative mx-auto transition-transform duration-700 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          }}
        >
          {/* Ambient Lighting Under Laptop */}
          <div
            className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-[85%] h-24 rounded-full pointer-events-none transition-colors duration-1000"
            style={{
              background: `radial-gradient(ellipse at center, ${currentSite.accent}40 0%, rgba(0,240,255,0.18) 45%, transparent 75%)`,
              filter: "blur(32px)",
              transform: "translateZ(-20px)",
            }}
          />

          {/* LAPTOP LID / SCREEN */}
          <div
            className="relative mx-auto w-[92%] sm:w-[86%] md:w-[78%] rounded-t-2xl p-[7px] sm:p-[10px] md:p-[12px] shadow-2xl transition-all duration-500"
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "50% 100%",
              background:
                "linear-gradient(180deg, #2b2b36 0%, #151522 50%, #0d0d16 100%)",
              border: "1px solid rgba(255,255,255,0.16)",
              boxShadow:
                "0 25px 60px -15px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.3)",
            }}
          >
            {/* Top Webcam Notch */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-700 inline-block" />
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
            </div>

            {/* Inner Screen Display (16:10 Ratio) */}
            <div
              className="relative w-full aspect-[16/10] overflow-hidden rounded-t-lg bg-[#07070f] border border-black/80 flex flex-col"
              style={{
                boxShadow: "inset 0 0 24px rgba(0,0,0,0.8)",
              }}
            >
              {/* Browser Bar */}
              <div className="h-7 sm:h-8 bg-[#10101c] border-b border-white/[0.08] px-3 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-[#0a0a14] border border-white/[0.06] text-[10px] text-white/50 font-mono tracking-tight max-w-[260px] truncate">
                  <span className="text-emerald-400">https://</span>
                  <span>{currentSite.name.toLowerCase().replace(/[^a-z0-9]/g, "")}.com.br</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                    Live Preview
                  </span>
                </div>
              </div>

              {/* Dynamic Screen Webpage Content */}
              <div className="relative flex-1 overflow-hidden p-4 sm:p-6 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <LaptopScreenContent currentSite={currentSite} />
                </AnimatePresence>

                {/* Liquid Glass Glare / Sheen Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-30"
                  style={{
                    background:
                      "linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 32%, transparent 55%)",
                    mixBlendMode: "screen",
                  }}
                />
              </div>
            </div>
          </div>

          {/* LAPTOP BASE CHASSIS */}
          <div
            className="relative mx-auto w-[98%] sm:w-[94%] md:w-[88%] h-4 sm:h-5 md:h-6 rounded-b-2xl shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, #1f1f2e 0%, #11111c 65%, #080811 100%)",
              borderTop: "1px solid rgba(255,255,255,0.22)",
              borderBottom: "1px solid rgba(0,0,0,0.8)",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
          >
            {/* Center Opening Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-1 sm:h-1.5 rounded-b-md bg-[#08080f] border-b border-white/20" />
            {/* Rubber Feet Shadow */}
            <div className="absolute -bottom-1 left-8 w-12 h-1 bg-black/60 rounded-full blur-xs" />
            <div className="absolute -bottom-1 right-8 w-12 h-1 bg-black/60 rounded-full blur-xs" />
          </div>
        </div>
      </div>

      {/* Interactive Tabs / Site Selector */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 px-2">
        {DEMO_SITES.map((site, index) => {
          const isSelected = index === activeIndex;
          return (
            <button
              key={site.id}
              onClick={() => setActiveIndex(index)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-white/12 text-white border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                  : "bg-white/[0.03] text-white/50 border border-white/[0.07] hover:text-white/80 hover:bg-white/[0.06]"
              }`}
            >
              <span
                className="w-2 h-2 rounded-full transition-transform duration-300"
                style={{
                  background: site.accent,
                  transform: isSelected ? "scale(1.25)" : "scale(1)",
                  boxShadow: isSelected ? `0 0 8px ${site.accent}` : "none",
                }}
              />
              <span>{site.name}</span>
              <span className="text-[10px] text-white/40 hidden sm:inline">
                ({site.niche})
              </span>
            </button>
          );
        })}
      </div>

      {/* Real-time Indicator Caption */}
      <p className="text-center text-[11px] text-white/40 mt-3 font-mono">
        Exemplos reais gerados pela plataforma. O notebook alterna automaticamente a cada 4 segundos.
      </p>
    </div>
  );
}
