"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import {
  Scissors,
  Pizza,
  Stethoscope,
  Dumbbell,
  Scale,
  Car,
  Utensils,
  Salad,
  Home,
  ShieldCheck,
  Sun,
  PawPrint,
  Anchor,
  Calculator,
} from "lucide-react";

interface NicheItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
}

const NICHES: NicheItem[] = [
  { name: "Barbearia", icon: Scissors, accent: "#ff9900" },
  { name: "Pizzaria & Massas", icon: Pizza, accent: "#ff4d4d" },
  { name: "Clínica & Odonto", icon: Stethoscope, accent: "#00f0ff" },
  { name: "Academia & CrossFit", icon: Dumbbell, accent: "#e040fb" },
  { name: "Advocacia & Direito", icon: Scale, accent: "#8b5cf6" },
  { name: "Estética Automotiva", icon: Car, accent: "#00e676" },
  { name: "Restaurante", icon: Utensils, accent: "#ff7043" },
  { name: "Nutrição & Saúde", icon: Salad, accent: "#66bb6a" },
  { name: "Imobiliária", icon: Home, accent: "#29b6f6" },
  { name: "Seguros & Blindagem", icon: ShieldCheck, accent: "#26c6da" },
  { name: "Energia Solar", icon: Sun, accent: "#ffa726" },
  { name: "Veterinária & Pet", icon: PawPrint, accent: "#ab47bc" },
  { name: "Náutica & Marinas", icon: Anchor, accent: "#00bcd4" },
  { name: "Contabilidade & BPO", icon: Calculator, accent: "#42a5f5" },
];

export default function NichesMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tween = gsap.to(trackRef.current, {
      xPercent: -50,
      duration: 32,
      ease: "none",
      repeat: -1,
    });

    const el = trackRef.current;
    const pause = () => tween.pause();
    const resume = () => tween.resume();

    el.addEventListener("mouseenter", pause);
    el.addEventListener("mouseleave", resume);

    return () => {
      tween.kill();
      el.removeEventListener("mouseenter", pause);
      el.removeEventListener("mouseleave", resume);
    };
  }, []);

  return (
    <div className="relative w-full py-8 overflow-hidden select-none border-y border-white/[0.06] bg-black/30 backdrop-blur-md">
      {/* Edge gradient masks */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10"
        style={{
          background:
            "linear-gradient(90deg, var(--color-vt-bg) 0%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10"
        style={{
          background:
            "linear-gradient(270deg, var(--color-vt-bg) 0%, transparent 100%)",
        }}
      />

      {/* Marquee Track */}
      <div ref={trackRef} className="flex w-fit items-center whitespace-nowrap">
        {/* Track A */}
        <div className="flex items-center gap-3 pr-3">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            return (
              <div
                key={`a-${niche.name}`}
                className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer shadow-sm"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/[0.06] text-white/80 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: niche.accent }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-white/75 group-hover:text-white transition-colors">
                  {niche.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Track B (clone for seamless loop) */}
        <div className="flex items-center gap-3 pr-3" aria-hidden="true">
          {NICHES.map((niche) => {
            const Icon = niche.icon;
            return (
              <div
                key={`b-${niche.name}`}
                className="group flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyan-400/50 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer shadow-sm"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/[0.06] text-white/80 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: niche.accent }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-white/75 group-hover:text-white transition-colors">
                  {niche.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
