"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Laptop3DShowcase from "./Laptop3DShowcase";

export default function PlataformaHero() {
  return (
    <section className="relative pt-32 pb-16 px-4 overflow-hidden" id="inicio">
      {/* Background Gradient Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-violet-500/10 to-transparent rounded-full blur-[110px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Top Selo / Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/12 text-xs font-medium text-white/90 shadow-sm backdrop-blur-md mb-6"
        >
          <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
          <span>Sem saber programar · 7 dias de garantia · IA Integrada</span>
        </motion.div>

        {/* H1 Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08] max-w-4xl mx-auto"
        >
          Venda sites para o comércio{" "}
          <span className="gradient-text block sm:inline">da sua cidade</span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
        >
          A plataforma acha comércios sem site no Google Maps, monta o roteiro de abordagem e gera a página pronta em menos de 1 minuto. Você cobra de R$ 600 a R$ 2.500 por projeto.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#planos"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all"
          >
            <span>Ver Planos e Começar a Vender</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <a
            href="https://wa.me/5519999999999?text=Ol%C3%A1%2C%20quero%20testar%20a%20plataforma%20de%20sites"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/[0.06] hover:bg-white/12 text-white font-bold text-sm border border-white/10 transition-all"
          >
            <span>Prefere testar antes? Fale Conosco</span>
          </a>
        </motion.div>

        {/* Trust Badges */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-white/60"
        >
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> A partir de R$ 74,27/mês
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> 7 dias de garantia
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Sem instalar nada
          </li>
          <li className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Site pronto em minutos
          </li>
        </motion.ul>

        {/* Interactive 3D Laptop Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10"
        >
          <Laptop3DShowcase />
        </motion.div>
      </div>
    </section>
  );
}
