"use client";

import Link from "next/link";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

export default function PlataformaPricing() {
  return (
    <section className="relative py-24 px-4 scroll-mt-20" id="planos">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono text-primary mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Acesso & Serviços</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
          Comece gratuitamente ou contrate{" "}
          <span className="gradient-text">serviços sob medida</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
          O Vertex OS é gratuito com quotas mensais renovadas. Projetos customizados e serviços de engenharia são orçados com cobrança segura Stripe em BRL, USD ou EUR.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {/* Tier 1: Gratuito */}
        <div className="rounded-3xl p-6 sm:p-8 bg-muted border border-border flex flex-col justify-between hover:border-border transition-all">
          <div>
            <div className="pb-4 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Vertex OS Grátis</h3>
              <p className="text-xs text-muted-foreground mt-1">Para conhecer e validar sua operação</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-foreground">R$ 0</span>
                <span className="text-xs text-muted-foreground block mt-1">Sem cartão · Quotas renovadas todo dia 1º</span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>1 projeto e 1 site publicado simultaneamente</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>3 gerações de copywriting por IA por mês</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>1 busca web grounded com 10 fontes verificadas</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Pipeline de vendas integrado para até 50 prospects</span></li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link href="/os/cadastro" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider text-center block transition-all hover:brightness-110">
              Criar Conta Grátis
            </Link>
            <p className="text-[10px] text-center text-muted-foreground mt-2">Acesso imediato sem cartão</p>
          </div>
        </div>

        {/* Tier 2: Serviços Sob Medida (Highlighted) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-card via-card to-muted border-2 border-primary/80 flex flex-col justify-between relative shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:border-primary transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground font-extrabold text-[10px] uppercase tracking-widest shadow-md">
            Serviços Especializados
          </div>

          <div>
            <div className="pb-4 border-b border-border">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <span>Landing Pages Sob Medida</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Design nível Awwwards e engenharia dedicada</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-foreground">Sob Orçamento</span>
                <span className="text-xs text-muted-foreground block mt-1">Links de pagamento Stripe (BRL, USD ou EUR)</span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-foreground">
              <li className="flex items-start gap-2.5 font-bold text-primary"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>Design e desenvolvimento sob medida pelo nosso time</span></li>
              <li className="flex items-start gap-2.5 font-bold text-primary"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" /><span>Foco em alta taxa de conversão e velocidade de carregamento</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Integração com WhatsApp, CRM e pixels de mensuração</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Hospedagem de alta velocidade e certificado SSL dedicados</span></li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link href="/contato" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider text-center block transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:brightness-110">
              Solicitar Orçamento
            </Link>
            <p className="text-[10px] text-center text-muted-foreground mt-2">Diagnóstico inicial sem compromisso</p>
          </div>
        </div>

        {/* Tier 3: Enterprise */}
        <div className="rounded-3xl p-6 sm:p-8 bg-muted border border-border flex flex-col justify-between hover:border-border transition-all">
          <div>
            <div className="pb-4 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Enterprise & Equipes</h3>
              <p className="text-xs text-muted-foreground mt-1">Para agências e operações com múltiplos clientes</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-foreground">Sob Consulta</span>
                <span className="text-xs text-muted-foreground block mt-1">Infraestrutura e SLA dedicado</span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Workspaces isolados para cada cliente ou filial</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Domínios customizados e white-label completo</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Faturamento consolidado ou cobrança internacional segregada</span></li>
              <li className="flex items-start gap-2.5"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /><span>Suporte prioritário e canal direto com engenharia</span></li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <Link href="/contato" className="w-full py-3 rounded-xl bg-muted border border-border hover:bg-card text-foreground font-bold text-xs uppercase tracking-wider text-center block transition-all">
              Falar com Especialista
            </Link>
            <p className="text-[10px] text-center text-muted-foreground mt-2">Atendimento executivo</p>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-3 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4 text-success" />
        <span>Pagamentos processados com segurança via Stripe · Faturamento transparente</span>
      </div>
    </section>
  );
}
