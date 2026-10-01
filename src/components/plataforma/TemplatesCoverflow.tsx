"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Smartphone,
} from "lucide-react";

interface TemplateItem {
  id: string;
  title: string;
  category: string;
  conversionStat: string;
  accent: string;
  bgGrad: string;
  highlights: string[];
  description: string;
  demoUrl: string;
}

const TEMPLATES: TemplateItem[] = [
  {
    id: "barbearia",
    title: "Navalha Nobre — Barbearia & Club",
    category: "Estética & Serviços",
    conversionStat: "+42% agendamentos",
    accent: "#ff9900",
    bgGrad: "from-amber-950/50 via-neutral-900 to-black",
    highlights: ["Agendamento WhatsApp 1-Click", "Tabela de serviços e combos", "Mapa interativo & Horários"],
    description: "Design clássico com tons amadeirados, tipografia de barbearia tradicional e checkout direto para WhatsApp.",
    demoUrl: "#planos",
  },
  {
    id: "clinica",
    title: "ClinicFlow — Odontologia & Estética",
    category: "Saúde & Clínicas",
    conversionStat: "3.8x mais leads qualificados",
    accent: "#00f0ff",
    bgGrad: "from-cyan-950/50 via-slate-900 to-black",
    highlights: ["Calculadora de tratamentos", "Antes & Depois interativo", "Avaliações verificadas do Google"],
    description: "Layout editorial médico com ar de prestígio e autoridade que transforma curiosos em consultas agendadas.",
    demoUrl: "#planos",
  },
  {
    id: "pizzaria",
    title: "Forneria Napoletana — Delivery & Salão",
    category: "Gastronomia & Restaurantes",
    conversionStat: "Zero taxas de marketplace",
    accent: "#ff4d4d",
    bgGrad: "from-rose-950/50 via-neutral-900 to-black",
    highlights: ["Cardápio digital responsivo", "Pedidos automáticos via WhatsApp", "Filtro de sabores e combos"],
    description: "Experiência de alta apetência visual com fotos em destaque e envio direto do pedido formatado ao restaurante.",
    demoUrl: "#planos",
  },
  {
    id: "automotivo",
    title: "Apex Studio — Detalhamento & PPF",
    category: "Automotivo & Supercarros",
    conversionStat: "+68% ticket médio",
    accent: "#00e676",
    bgGrad: "from-emerald-950/50 via-zinc-900 to-black",
    highlights: ["Galeria de laudos periciais", "Comparador de pacotes de proteção", "CTA magnético para orçamento"],
    description: "Estética técnica e premium, focada em clientes exigentes que buscam vitrificação, blindagem e PPF.",
    demoUrl: "#planos",
  },
  {
    id: "solar",
    title: "Solarium CleanTech — Energia Solar",
    category: "Engenharia & B2B",
    conversionStat: "+85% taxa de proposta",
    accent: "#ffa726",
    bgGrad: "from-yellow-950/50 via-stone-900 to-black",
    highlights: ["Simulador de economia em kWh", "Calculadora de retorno de investimento", "Validação por satélite"],
    description: "Estrutura focada em provar o retorno financeiro com formulário inteligente que pré-qualifica o lead comercial.",
    demoUrl: "#planos",
  },
];

export default function TemplatesCoverflow() {
  const [currentIndex, setCurrentIndex] = useState(1);

  const prev = useCallback(() => {
    setCurrentIndex((c) => (c === 0 ? TEMPLATES.length - 1 : c - 1));
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((c) => (c === TEMPLATES.length - 1 ? 0 : c + 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next]);

  return (
    <section className="relative py-20 px-4 overflow-hidden select-none" id="modelos">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-cyan-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>O que você entrega para os clientes</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Modelos de alta conversão{" "}
          <span className="gradient-text">feitos à mão por designers</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-white/60 max-w-2xl mx-auto">
          Cada ramo tem um layout próprio, tipografia autoral, responsividade perfeita para celular e gatilhos de WhatsApp já resolvidos.
        </p>
      </div>

      {/* 3D Coverflow Container */}
      <div
        className="relative mx-auto h-[480px] sm:h-[530px] w-full max-w-4xl flex items-center justify-center"
        style={{ perspective: "1400px" }}
      >
        {TEMPLATES.map((item, index) => {
          // Distance from active card (-2, -1, 0, 1, 2)
          let offset = index - currentIndex;
          if (offset < -2) offset += TEMPLATES.length;
          if (offset > 2) offset -= TEMPLATES.length;

          const isActive = offset === 0;
          const isVisible = Math.abs(offset) <= 2;

          if (!isVisible) return null;

          // Spatial 3D coordinates
          const tx = offset * (typeof window !== "undefined" && window.innerWidth < 640 ? 120 : 190);
          const tz = isActive ? 0 : -Math.abs(offset) * 160;
          const ry = offset * -28;
          const scale = isActive ? 1 : 0.84 - Math.abs(offset) * 0.08;
          const opacity = isActive ? 1 : 0.65 - Math.abs(offset) * 0.25;
          const zIndex = 20 - Math.abs(offset) * 5;

          return (
            <motion.div
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              animate={{
                x: tx,
                z: tz,
                rotateY: ry,
                scale,
                opacity,
              }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                zIndex,
                transformStyle: "preserve-3d",
              }}
              className="absolute w-[300px] sm:w-[380px] md:w-[420px] rounded-2xl cursor-pointer p-4 sm:p-6 bg-gradient-to-b from-[#141426] via-[#0d0d1b] to-[#070712] border border-white/12 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] hover:border-cyan-400/40 transition-colors"
            >
              {/* Card Browser Chrome */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                </div>
                <span className="text-[10px] font-mono text-white/40 tracking-wider uppercase">
                  {item.category}
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${item.accent}20`,
                    color: item.accent,
                    border: `1px solid ${item.accent}40`,
                  }}
                >
                  {item.conversionStat}
                </span>
              </div>

              {/* Template Preview Area */}
              <div
                className={`mt-4 rounded-xl p-4 sm:p-5 bg-gradient-to-br ${item.bgGrad} border border-white/[0.08] relative overflow-hidden`}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black text-sm mb-3 shadow-md"
                  style={{ background: item.accent }}
                >
                  {item.title[0]}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs text-white/70 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {/* Highlights List */}
                <div className="mt-4 space-y-1.5 pt-3 border-t border-white/[0.08]">
                  {item.highlights.map((hl) => (
                    <div key={hl} className="flex items-center gap-2 text-[11px] text-white/80">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 flex items-center justify-between pt-2">
                <span className="flex items-center gap-1 text-[11px] text-white/50">
                  <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> 100% Responsivo
                </span>

                <a
                  href="#planos"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg bg-white/10 hover:bg-cyan-500 hover:text-black transition-all duration-300"
                >
                  <span>Ver Modelo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          );
        })}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prev}
          aria-label="Modelo anterior"
          className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          aria-label="Próximo modelo"
          className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center backdrop-blur-md hover:bg-white/20 hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {TEMPLATES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            aria-label={`Ir para modelo ${i + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              i === currentIndex
                ? "w-8 h-2 bg-cyan-400 shadow-[0_0_10px_#00f0ff]"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
