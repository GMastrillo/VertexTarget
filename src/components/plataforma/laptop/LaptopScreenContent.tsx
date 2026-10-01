"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Star,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import type { SiteDemo } from "./laptop-data";

interface LaptopScreenContentProps {
  currentSite: SiteDemo;
}

export default function LaptopScreenContent({ currentSite }: LaptopScreenContentProps) {
  return (
    <motion.div
      key={currentSite.id}
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 h-full flex flex-col justify-between"
    >
      {/* Mock Site Navbar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-black"
            style={{ background: currentSite.accent }}
          >
            {currentSite.name[0]}
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
              {currentSite.name}
            </p>
            <p className="text-[9px] text-white/40">{currentSite.niche}</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] text-white/60">
          <span>Início</span>
          <span>Serviços</span>
          <span>Avaliações</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <MapPin className="w-3 h-3" /> {currentSite.city}
          </span>
        </div>

        <div
          className="text-[10px] font-bold px-3 py-1 rounded-full text-black flex items-center gap-1 shadow-sm"
          style={{ background: currentSite.accent }}
        >
          <PhoneCall className="w-3 h-3" /> Falar Agora
        </div>
      </div>

      {/* Mock Site Hero Content */}
      <div className="py-3 sm:py-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[9px] sm:text-[10px] text-white/80 mb-2">
          <Sparkles className="w-3 h-3" style={{ color: currentSite.accent }} />
          <span>{currentSite.badge}</span>
        </div>

        <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight max-w-xl">
          {currentSite.headline}
        </h2>

        <p className="text-[10px] sm:text-xs text-white/60 mt-1.5 max-w-lg leading-relaxed line-clamp-2">
          {currentSite.sub}
        </p>

        {/* Mock Features Chips */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3">
          {currentSite.features.map((feat) => (
            <span
              key={feat}
              className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-white/70 flex items-center gap-1"
            >
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              {feat}
            </span>
          ))}
        </div>
      </div>

      {/* Mock Site Social Proof / Trust Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[9px] sm:text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="font-bold text-white">{currentSite.rating}</span>
          <span className="text-white/40">({currentSite.reviews})</span>
        </div>

        <div className="flex items-center gap-2 text-white/50">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" /> Aberto hoje
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:flex items-center gap-1">
            <Calendar className="w-3 h-3 text-cyan-400" /> Atendimento 1-Click
          </span>
        </div>
      </div>
    </motion.div>
  );
}
