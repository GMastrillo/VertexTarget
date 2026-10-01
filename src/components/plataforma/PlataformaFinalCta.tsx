"use client";

import { ArrowRight, Globe, MessageSquare, Smartphone, Sparkles } from "lucide-react";

export default function PlataformaFinalCta() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-16 bg-gradient-to-b from-[#14142b] via-[#0d0d1e] to-[#060610] border border-cyan-500/30 text-center relative overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15)]">
          {/* Neon radial glow in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 to-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-xs font-mono text-cyan-400 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O mercado da sua cidade está esperando</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
              Sua cidade tem negócios sem site.{" "}
              <span className="gradient-text">Comece pelo primeiro hoje.</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
              Escolha seu plano, gere a primeira página em 1 minuto e apresente ainda hoje. Um único projeto vendido já paga todo o seu investimento do ano.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#planos"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-cyan-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:bg-cyan-300 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Escolher Meu Plano</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/5519999999999?text=Ol%C3%A1%2C%20gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20a%20plataforma%20de%20sites"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/[0.06] hover:bg-white/12 text-white font-bold text-sm border border-white/10 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Falar com Consultor</span>
              </a>
            </div>

            {/* Quick Guarantees Footer */}
            <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-white/50">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-cyan-400" /> Hospedagem e SSL inclusos
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400" /> Botão WhatsApp integrado
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-violet-400" /> 100% Otimizado para celular
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
