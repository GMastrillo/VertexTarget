"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExperienceTimeline from "./ExperienceTimeline";

const SkillsOrbit = dynamic(() => import("./SkillsOrbit"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[380px] rounded-2xl flex items-center justify-center my-12 border"
      style={{
        background: "var(--color-vt-bg-card)",
        borderColor: "var(--color-vt-border)",
      }}
    >
      <div className="text-xs font-mono text-zinc-500 animate-pulse">
        Carregando Constelação 3D de Habilidades...
      </div>
    </div>
  ),
});

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 40,
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

      // Leadership cards reveal
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 85%",
          },
        });
      }

      // Stats reveal
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { value: "50+", label: "Projetos Entregues" },
    { value: "340%", label: "ROI Médio Clientes" },
    { value: "7+", label: "Anos de Experiência" },
    { value: "∞", label: "Linhas de Código" },
  ];

  return (
    <section ref={sectionRef} id="about" className="section">
      <div className="section-inner">
        {/* Section Header */}
        <div ref={titleRef} className="mb-14">
          <div className="label mb-4">Liderança & Visão</div>
          <h2 className="heading-lg mb-6">
            Liderança que une
            <br />
            <span className="gradient-text">Engenharia & Tração.</span>
          </h2>
          <p className="body-lg max-w-3xl">
            A VertexTarget nasce da fusão estratégica entre arquitetura técnica de ponta e agressividade
            comercial. Construímos experiências digitais imersivas respaldadas por estratégias de vendas que convertem.
          </p>
        </div>

        {/* Executive Duo Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Gabriel Mastrillo — CEO & CTO */}
          <div
            className="p-8 md:p-10 rounded-2xl border relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-cyan-400/50"
            style={{
              background: "var(--color-vt-bg-card)",
              borderColor: "var(--color-vt-border)",
            }}
          >
            {/* Top Glow Accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
              style={{
                background: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
              }}
            />

            <div>
              <div className="flex items-center justify-between mb-5">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                  style={{
                    background: "rgba(0, 240, 255, 0.1)",
                    color: "#00f0ff",
                    borderColor: "rgba(0, 240, 255, 0.3)",
                  }}
                >
                  ⚡ CEO & CTO
                </span>
                <span className="text-xs font-mono text-zinc-500">Engenharia & IA</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                Gabriel Mastrillo
              </h3>
              <p className="text-xs md:text-sm font-mono text-cyan-300 mb-6">
                Engenharia de Software, Arquitetura de Sistemas & IA
              </p>

              <p className="body-md mb-6" style={{ color: "var(--color-vt-text-muted)" }}>
                Liderança técnica e executiva da VertexTarget. Com sólida formação prática em suporte,
                hardware e resolução de problemas complexos, projeta ecossistemas digitais de alta precisão,
                WebGL/3D com shaders customizados e integrações com inteligência artificial para marcas que buscam autoridade absoluta.
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-2">
                {["Arquitetura Full-Stack", "Three.js / WebGL", "IA Generativa", "DevOps & Cloud"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono text-cyan-200 border border-cyan-400/20 bg-cyan-500/[0.05]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Denis Braghin — CEO Vendas & Marketing */}
          <div
            className="p-8 md:p-10 rounded-2xl border relative overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:border-violet-400/50"
            style={{
              background: "var(--color-vt-bg-card)",
              borderColor: "var(--color-vt-border)",
            }}
          >
            {/* Top Glow Accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
              style={{
                background: "linear-gradient(90deg, transparent, #8b5cf6, transparent)",
              }}
            />

            <div>
              <div className="flex items-center justify-between mb-5">
                <span
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                  style={{
                    background: "rgba(139, 92, 246, 0.12)",
                    color: "#a78bfa",
                    borderColor: "rgba(139, 92, 246, 0.3)",
                  }}
                >
                  🚀 CEO · Vendas & Marketing
                </span>
                <span className="text-xs font-mono text-zinc-500">Growth & Tração</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                Denis Braghin
              </h3>
              <p className="text-xs md:text-sm font-mono text-violet-300 mb-6">
                Estratégia Comercial, Growth Hacking & Funis de Conversão
              </p>

              <p className="body-md mb-6" style={{ color: "var(--color-vt-text-muted)" }}>
                Liderança comercial e estratégica da VertexTarget. Especialista em acelerar receitas através de
                estratégias data-driven, funis de vendas de alta performance, automação de processos comerciais e
                posicionamento premium para transformar leads em clientes fiéis.
              </p>
            </div>

            <div className="pt-6 border-t border-white/[0.06]">
              <div className="flex flex-wrap gap-2">
                {["Estratégia de Vendas", "Growth Hacking", "Funis de Conversão", "Posicionamento B2B"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-[11px] font-mono text-violet-200 border border-violet-400/20 bg-violet-500/[0.05]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 py-8 border-t border-b"
          style={{ borderColor: "var(--color-vt-border)" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl md:text-4xl font-bold mb-2 gradient-text"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {stat.value}
              </div>
              <div
                className="text-xs tracking-wider uppercase"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 3D Skills Constellation */}
        <SkillsOrbit />

        {/* Experience Timeline */}
        <ExperienceTimeline />
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
