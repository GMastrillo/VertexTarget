"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Clock, DollarSign, Search, ShieldAlert, Users, Wrench } from "lucide-react";

const PAIN_POINTS = [
  {
    icon: Clock,
    title: "Passa horas ou semanas montando cada site à mão",
    desc: "Perde tempo configurando servidor, plugins lentos e brigando com código do zero.",
  },
  {
    icon: DollarSign,
    title: "Cobra pouco porque o projeto demora para sair",
    desc: "O ciclo longo corrói a margem e você não consegue manter fluxo de caixa constante.",
  },
  {
    icon: Search,
    title: "Não sabe exatamente onde encontrar clientes que precisam",
    desc: "Depende de indicação esporádica em vez de uma lista qualificada de negócios na sua cidade.",
  },
  {
    icon: Users,
    title: "Perde o cliente entre o orçamento e a primeira apresentação",
    desc: "O cliente esfria enquanto espera a proposta. Com a gente você já chega com o site pronto na mão.",
  },
  {
    icon: ShieldAlert,
    title: "Manda proposta sem contrato e com precificação no chute",
    desc: "Insegurança na hora de negociar e medo de cobrar R$ 1.500 a R$ 2.500 por projeto.",
  },
  {
    icon: Wrench,
    title: "Depende de programador ou equipe cara para conseguir entregar",
    desc: "Seu lucro fica retido em custos de terceirização e você vira refém técnico.",
  },
];

export default function PainPointsSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl p-6 sm:p-12 bg-gradient-to-b from-card to-card border border-border shadow-2xl relative overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-[1fr_1.3fr] gap-10 items-center">
            {/* Left Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20 text-xs font-bold text-destructive mb-4 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Reconhece o cenário?</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                Você está deixando dinheiro na mesa se:
              </h2>

              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Cada item desta lista representa um comércio na sua rua ou no seu bairro que precisa desesperadamente de um site profissional e você ainda não vendeu.
              </p>

              {/* Solution box callout */}
              <div className="mt-8 p-5 rounded-2xl bg-primary/30 border border-primary/20">
                <p className="text-xs sm:text-sm text-primary leading-relaxed font-medium">
                  <strong>Com o Vertex OS, você estrutura e publica o site com agilidade profissional</strong> com design editorial, proteção contra perda de dados e links seguros. A venda e o lucro continuam 100% seus.
                </p>
                <Link
                  href="/os/cadastro"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-105"
                >
                  <span>Criar Conta Gratuita</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Pain Grid */}
            <div className="grid sm:grid-cols-2 gap-3.5">
              {PAIN_POINTS.map((pain, idx) => {
                const Icon = pain.icon;
                return (
                  <motion.div
                    key={pain.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="p-4 rounded-xl bg-muted border border-border hover:border-border transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-foreground tracking-tight leading-snug">
                      {pain.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      {pain.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
