"use client";

import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import Laptop3DShowcase from "@/components/plataforma/Laptop3DShowcase";
import NichesMarquee from "@/components/plataforma/NichesMarquee";

export default function HomePlatformHighlight() {
  return (
    <section className="relative py-20 overflow-hidden" id="plataforma-engine">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 75%)",
          filter: "blur(90px)",
        }}
      />

      <div className="section-inner max-w-6xl mx-auto px-4 text-center relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vertex OS · Engine de Alta Conversão</span>
        </div>

        <h2 className="heading-lg text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          Tecnologia de estúdio para{" "}
          <span className="gradient-text">qualquer ramo ou escala</span>
        </h2>

        <p
          className="mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--color-vt-text-muted)" }}
        >
          A mesma engenharia de front-end criativo, automação com IA e física de alta fidelidade usada nos nossos maiores cases, agora disponível no Vertex OS com plano gratuito.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            href="/plataforma"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-foreground border border-primary/40 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:scale-105"
          >
            <span>Conhecer a Plataforma Completa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 3D Laptop Component */}
      <div className="relative z-10">
        <Laptop3DShowcase />
      </div>

      {/* Niches Ticker */}
      <div className="mt-8 relative z-10">
        <NichesMarquee />
      </div>
    </section>
  );
}
