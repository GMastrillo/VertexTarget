'use client';

import { AnimatePresence } from 'motion/react';
import type { SiteDemo } from './laptop-data';
import LaptopScreenContent from './LaptopScreenContent';

interface LaptopChassisFrameProps {
  currentSite: SiteDemo;
  rotX: number;
  rotY: number;
  mode: 'showcase' | 'sandbox';
}

export default function LaptopChassisFrame({
  currentSite,
  rotX,
  rotY,
  mode,
}: LaptopChassisFrameProps) {
  const urlDomain = currentSite.name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'empresa';

  return (
    <div
      className="relative mx-auto transition-transform duration-500 ease-out"
      style={{
        perspective: '2600px',
        perspectiveOrigin: '50% 36%',
      }}
    >
      <div
        className="relative mx-auto transition-transform duration-700 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* Ambient Lighting */}
        <div
          className="absolute left-1/2 -bottom-6 -translate-x-1/2 w-[85%] h-24 rounded-full pointer-events-none transition-colors duration-1000"
          style={{
            background: `radial-gradient(ellipse at center, ${currentSite.accent}40 0%, rgba(0,240,255,0.18) 45%, transparent 75%)`,
            filter: 'blur(32px)',
            transform: 'translateZ(-20px)',
          }}
        />

        {/* LAPTOP LID / SCREEN */}
        <div
          className="relative mx-auto w-[92%] sm:w-[86%] md:w-[78%] rounded-t-2xl p-[7px] sm:p-[10px] md:p-[12px] shadow-2xl transition-all duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 100%',
            background: 'linear-gradient(180deg, #2b2b36 0%, #151522 50%, #0d0d16 100%)',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-700 inline-block" />
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse inline-block" />
          </div>

          <div
            className="relative w-full aspect-[16/10] overflow-hidden rounded-t-lg bg-[#07070f] border border-black/80 flex flex-col"
            style={{ boxShadow: 'inset 0 0 24px rgba(0,0,0,0.8)' }}
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
                <span>{urlDomain}.com.br</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
                  {mode === 'sandbox' ? 'Seu Preview' : 'Live Preview'}
                </span>
              </div>
            </div>

            {/* Screen Webpage Content */}
            <div className="relative flex-1 overflow-hidden p-4 sm:p-6 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                <LaptopScreenContent currentSite={currentSite} />
              </AnimatePresence>
              <div
                className="absolute inset-0 pointer-events-none z-30"
                style={{
                  background: 'linear-gradient(118deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.01) 32%, transparent 55%)',
                  mixBlendMode: 'screen',
                }}
              />
            </div>
          </div>
        </div>

        {/* LAPTOP BASE CHASSIS */}
        <div
          className="relative mx-auto w-[98%] sm:w-[94%] md:w-[88%] h-4 sm:h-5 md:h-6 rounded-b-2xl shadow-2xl"
          style={{
            background: 'linear-gradient(180deg, #1f1f2e 0%, #11111c 65%, #080811 100%)',
            borderTop: '1px solid rgba(255,255,255,0.22)',
            borderBottom: '1px solid rgba(0,0,0,0.8)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 sm:w-28 h-1 sm:h-1.5 rounded-b-md bg-[#08080f] border-b border-white/20" />
          <div className="absolute -bottom-1 left-8 w-12 h-1 bg-black/60 rounded-full blur-xs" />
          <div className="absolute -bottom-1 right-8 w-12 h-1 bg-black/60 rounded-full blur-xs" />
        </div>
      </div>
    </div>
  );
}
