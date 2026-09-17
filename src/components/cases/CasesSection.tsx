"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { CASES } from "@/lib/constants";
import CaseCard from "./CaseCard";

gsap.registerPlugin(ScrollTrigger);

export default function CasesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [activeCase, setActiveCase] = useState<string | null>(null);

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActiveCase(null);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cases" className="section">
      <div className="section-inner">
        {/* Section Header */}
        <div ref={titleRef} className="mb-16">
          <div className="label mb-4">Portfólio & Engenharia</div>
          <h2 className="heading-lg mb-6">
            Projetos que
            <br />
            <span className="gradient-text">definem mercados.</span>
          </h2>
          <p className="body-lg max-w-2xl">
            Cada aplicação é uma obra de alta precisão técnica. Unimos arquitetura full-stack,
            design imersivo, automação inteligente e performance extrema para transformar negócios reais.
          </p>
        </div>

        {/* Cases Grid — responsive staggered layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CASES.map((caseStudy, index) => (
            <CaseCard
              key={caseStudy.id}
              caseStudy={caseStudy}
              index={index}
              onExpand={() => setActiveCase(caseStudy.id)}
            />
          ))}
        </div>

        {/* Expanded Case Detail Modal */}
        <AnimatePresence>
          {activeCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
              style={{ background: "rgba(5, 5, 16, 0.85)", backdropFilter: "blur(12px)" }}
              onClick={() => setActiveCase(null)}
            >
              <motion.div
                layoutId={`case-${activeCase}`}
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full max-w-4xl rounded-2xl p-6 sm:p-10 my-8 max-h-[90vh] overflow-y-auto border shadow-2xl relative"
                style={{
                  background: "var(--color-vt-bg-card)",
                  borderColor: "var(--color-vt-border)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const c = CASES.find((cs) => cs.id === activeCase);
                  if (!c) return null;
                  return (
                    <div className="space-y-6">
                      {/* Browser Mockup Bar */}
                      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-500/80" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <span className="w-3 h-3 rounded-full bg-green-500/80" />
                          <div className="ml-3 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-zinc-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            <span className="text-zinc-300 truncate max-w-xs">{c.liveUrl}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setActiveCase(null)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/[0.08] transition-colors"
                          style={{ color: "var(--color-vt-text-muted)" }}
                          aria-label="Fechar modal"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Header Info */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="label text-xs uppercase font-semibold"
                            style={{ color: c.color }}
                          >
                            {c.category}
                          </span>
                          <span className="text-xs opacity-40">•</span>
                          <span className="text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
                            {c.client}
                          </span>
                        </div>
                        <span
                          className="text-xs font-mono px-3 py-1 rounded-full border"
                          style={{
                            borderColor: `${c.color}40`,
                            color: c.color,
                            background: `${c.color}10`,
                          }}
                        >
                          Ano {c.year}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <h3 className="text-2xl sm:text-4xl font-bold tracking-tight mb-2" style={{ color: c.color }}>
                          {c.title}
                        </h3>
                        <p className="text-sm sm:text-base font-mono" style={{ color: `${c.color}dd` }}>
                          {c.tagline}
                        </p>
                      </div>

                      {/* Metrics Banner */}
                      <div
                        className="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        style={{
                          background: `${c.color}08`,
                          borderColor: `${c.color}30`,
                        }}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                          <span className="text-xs sm:text-sm font-mono font-medium text-white">
                            {c.metrics}
                          </span>
                        </div>

                        <span
                          className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          Ambiente de Produção 100% Ativo
                        </span>
                      </div>

                      {/* Description */}
                      <div className="space-y-4 text-sm sm:text-base leading-relaxed" style={{ color: "var(--color-vt-text-muted)" }}>
                        <p>{c.description}</p>
                      </div>

                      {/* Stack Badges */}
                      <div>
                        <div className="text-xs font-mono uppercase tracking-wider mb-2.5" style={{ color: "var(--color-vt-text-dim)" }}>
                          Tecnologias & Arquitetura:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {c.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium"
                              style={{
                                background: `${c.color}14`,
                                color: c.color,
                                border: `1px solid ${c.color}35`,
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action CTA Button */}
                      <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs font-mono text-zinc-400">
                          Deploy oficial hospedado e otimizado na Vercel Edge Network
                        </div>

                        <a
                          href={c.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                          style={{
                            background: c.color,
                            color: "#050510",
                            boxShadow: `0 10px 30px -10px ${c.color}80`,
                          }}
                        >
                          <span>Visitar Projeto Online (Live Demo)</span>
                          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                            <path
                              d="M4 12L12 4M12 4H5M12 4v7"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
