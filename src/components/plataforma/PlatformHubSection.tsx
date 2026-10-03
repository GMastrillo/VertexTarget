"use client";

import { motion } from "motion/react";
import {
  MapPinned,
  LayoutTemplate,
  PenTool,
  FileCheck2,
  Zap,
} from "lucide-react";

const HUB_ITEMS = [
  {
    id: "prospeccao",
    title: "Prospecção no Maps",
    subtitle: "Ache quem precisa",
    desc: "Busca no Google Maps os negócios da sua cidade que ainda não têm site, com telefone e endereço prontos.",
    icon: MapPinned,
    accent: "#00f0ff",
  },
  {
    id: "gerador",
    title: "Gerador Instantâneo de IA",
    subtitle: "Site pronto em < 1 min",
    desc: "Responda um questionário rápido e o site nasce pronto com fotos, copy persuasiva e celular resolvido.",
    icon: LayoutTemplate,
    accent: "#8b5cf6",
  },
  {
    id: "editor",
    title: "Editor Visual Sem Código",
    subtitle: "Ajuste no clique",
    desc: "Altere textos, cores, WhatsApp e fotos com facilidade quantas vezes precisar antes de entregar ao cliente.",
    icon: PenTool,
    accent: "#e040fb",
  },
  {
    id: "crm",
    title: "CRM, Proposta & Contrato",
    subtitle: "Feche com segurança",
    desc: "Script de abordagem pronto para WhatsApp, roteiro de ligação, preço de mercado e contrato formal.",
    icon: FileCheck2,
    accent: "#00e676",
  },
];

export default function PlatformHubSection() {
  return (
    <section className="relative py-24 px-4 overflow-hidden" id="ferramentas">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-mono text-cyan-400 mb-4">
          <Zap className="w-3.5 h-3.5" />
          <span>Da busca ao site no ar</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          4 ferramentas. 1 painel.{" "}
          <span className="gradient-text">Nenhuma aba perdida.</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-white/60 max-w-xl mx-auto">
          Você não precisa de mais nada: a plataforma acha o cliente, gera o site, permite personalizar e organiza a venda até o Pix cair.
        </p>
      </div>

      {/* Interactive Connected Architecture */}
      <div className="relative max-w-5xl mx-auto">
        {/* Animated Connecting SVG Curves (Visible on desktop) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 1000 420"
            fill="none"
            preserveAspectRatio="none"
          >
            {/* Left Top to Center */}
            <path
              d="M 280 90 C 380 90, 420 210, 500 210"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 280 90 C 380 90, 420 210, 500 210"
              stroke="#00f0ff"
              strokeWidth="2.5"
              strokeDasharray="20 180"
              className="animate-pulse"
              style={{ animationDuration: "2.4s" }}
            />

            {/* Left Bottom to Center */}
            <path
              d="M 280 330 C 380 330, 420 210, 500 210"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 280 330 C 380 330, 420 210, 500 210"
              stroke="#8b5cf6"
              strokeWidth="2.5"
              strokeDasharray="20 180"
              className="animate-pulse"
              style={{ animationDuration: "2.8s", animationDelay: "0.6s" }}
            />

            {/* Right Top to Center */}
            <path
              d="M 720 90 C 620 90, 580 210, 500 210"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 720 90 C 620 90, 580 210, 500 210"
              stroke="#e040fb"
              strokeWidth="2.5"
              strokeDasharray="20 180"
              className="animate-pulse"
              style={{ animationDuration: "3s", animationDelay: "1.2s" }}
            />

            {/* Right Bottom to Center */}
            <path
              d="M 720 330 C 620 330, 580 210, 500 210"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
            <path
              d="M 720 330 C 620 330, 580 210, 500 210"
              stroke="#00e676"
              strokeWidth="2.5"
              strokeDasharray="20 180"
              className="animate-pulse"
              style={{ animationDuration: "2.6s", animationDelay: "1.8s" }}
            />
          </svg>
        </div>

        {/* 3-Column Grid with Center Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px_1fr] gap-6 lg:gap-10 items-center">
          {/* Left Column (Items 0 & 1) */}
          <div className="space-y-6">
            {HUB_ITEMS.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-cyan-400/40 transition-all shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${item.accent}20`,
                        color: item.accent,
                        border: `1px solid ${item.accent}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-mono text-cyan-300">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-3">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Center Orb */}
          <div className="hidden lg:flex flex-col items-center justify-center relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-500/20 via-violet-500/20 to-magenta-500/20 border border-white/20 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,240,255,0.3)] backdrop-blur-xl animate-pulse">
              <span className="font-heading font-black text-xl text-white tracking-tight">
                Vertex
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                OS Engine
              </span>
            </div>
            <div className="absolute w-36 h-36 rounded-full border border-cyan-400/20 animate-spin" style={{ animationDuration: "16s" }} />
          </div>

          {/* Right Column (Items 2 & 3) */}
          <div className="space-y-6">
            {HUB_ITEMS.slice(2, 4).map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 hover:border-emerald-400/40 transition-all shadow-xl backdrop-blur-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                      style={{
                        backgroundColor: `${item.accent}20`,
                        color: item.accent,
                        border: `1px solid ${item.accent}40`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-mono text-emerald-300">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed mt-3">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
