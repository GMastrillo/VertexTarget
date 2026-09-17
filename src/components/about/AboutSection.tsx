"use client";

import { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

const CEOS = [
  {
    name: "Gabriel Mastrillo",
    badge: "⚡ CEO & CTO",
    subtitle: "Engenharia de Software, Arquitetura de Sistemas & IA",
    bio: "Fundador e líder técnico-executivo da VertexTarget. Com sólida formação prática em suporte técnico, hardware e resolução de problemas complexos, projeta ecossistemas digitais de alta precisão: arquiteturas full-stack, WebGL/3D com shaders customizados e integrações com inteligência artificial para marcas que buscam autoridade absoluta.",
    accent: "#00f0ff",
    accentRgb: "0, 240, 255",
    sideLabel: "Engenharia & IA",
    tags: ["Arquitetura Full-Stack", "Three.js / WebGL", "IA Generativa", "DevOps & Cloud"],
    initials: "GM",
  },
  {
    name: "Denis Braghin",
    badge: "🚀 CEO · Vendas & Marketing",
    subtitle: "Estratégia Comercial, Growth Hacking & Funis de Conversão",
    bio: "Co-CEO especializado em vendas e marketing da VertexTarget. Especialista em acelerar receitas através de estratégias data-driven, funis de vendas de alta performance, automação de processos comerciais e posicionamento premium para transformar leads em clientes fiéis.",
    accent: "#8b5cf6",
    accentRgb: "139, 92, 246",
    sideLabel: "Growth & Tração",
    tags: ["Estratégia de Vendas", "Growth Hacking", "Funis de Conversão", "Posicionamento B2B"],
    initials: "DB",
  },
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

        {/* CEO Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {CEOS.map((ceo) => (
            <div
              key={ceo.name}
              className="p-8 md:p-10 rounded-2xl border relative overflow-hidden flex flex-col group transition-all duration-300 hover:-translate-y-1"
              style={{
                background:
                  "linear-gradient(180deg, rgba(15, 15, 36, 0.95) 0%, rgba(10, 10, 26, 0.98) 100%)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${ceo.accentRgb}, 0.45)`;
                e.currentTarget.style.boxShadow = `0 24px 60px -20px rgba(${ceo.accentRgb}, 0.25)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Top glow accent */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ceo.accent}, transparent)`,
                }}
              />

              {/* Corner radial glow */}
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle, rgba(${ceo.accentRgb}, 0.14), transparent 70%)`,
                }}
              />

              {/* Header: avatar + badge */}
              <div className="flex items-start justify-between mb-7">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl tracking-tight"
                  style={{
                    fontFamily: "var(--font-heading)",
                    background: `linear-gradient(135deg, rgba(${ceo.accentRgb}, 0.18), rgba(${ceo.accentRgb}, 0.06))`,
                    border: `1px solid rgba(${ceo.accentRgb}, 0.35)`,
                    color: ceo.accent,
                    boxShadow: `0 0 24px rgba(${ceo.accentRgb}, 0.15)`,
                  }}
                >
                  {ceo.initials}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border"
                    style={{
                      background: `rgba(${ceo.accentRgb}, 0.10)`,
                      color: ceo.accent,
                      borderColor: `rgba(${ceo.accentRgb}, 0.30)`,
                    }}
                  >
                    {ceo.badge}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "var(--color-vt-text-dim)" }}>
                    {ceo.sideLabel}
                  </span>
                </div>
              </div>

              {/* Name & role */}
              <h3
                className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {ceo.name}
              </h3>
              <p
                className="text-xs md:text-sm font-mono mb-6"
                style={{ color: ceo.accent }}
              >
                {ceo.subtitle}
              </p>

              {/* Bio */}
              <p
                className="text-sm leading-relaxed mb-8 flex-1"
                style={{ color: "var(--color-vt-text-muted)" }}
              >
                {ceo.bio}
              </p>

              {/* Tags */}
              <div className="pt-6 border-t border-white/[0.06]">
                <div className="flex flex-wrap gap-2">
                  {ceo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono"
                      style={{
                        color: `${ceo.accent}dd`,
                        border: `1px solid rgba(${ceo.accentRgb}, 0.20)`,
                        background: `rgba(${ceo.accentRgb}, 0.05)`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
