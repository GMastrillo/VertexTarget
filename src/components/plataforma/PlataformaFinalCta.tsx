"use client";

import Link from "next/link";
import { ArrowRight, Globe, MessageSquare, Smartphone, Sparkles } from "lucide-react";

export default function PlataformaFinalCta() {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl p-8 sm:p-16 bg-gradient-to-b from-card via-card to-background border border-primary/30 text-center relative overflow-hidden shadow-[0_0_60px_rgba(0,240,255,0.15)]">
          {/* Neon radial glow in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/15 to-violet-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-mono text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>O mercado da sua cidade está esperando</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight max-w-3xl mx-auto">
              Sua cidade tem negócios sem site.{" "}
              <span className="gradient-text">Comece pelo primeiro hoje.</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Crie sua conta gratuitamente, configure seu primeiro projeto e publique com endereço exclusivo ainda hoje.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/os/cadastro"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,240,255,0.5)] hover:bg-primary hover:scale-105 active:scale-95 transition-all"
              >
                <span>Criar Conta Gratuita</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/os/entrar"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-muted hover:bg-muted text-foreground font-bold text-sm border border-border transition-all"
              >
                <span>Acessar Minha Conta →</span>
              </Link>
            </div>

            {/* Quick Guarantees Footer */}
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" /> Hospedagem e SSL inclusos
              </span>
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-success" /> Botão WhatsApp integrado
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-accent" /> 100% Otimizado para celular
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
