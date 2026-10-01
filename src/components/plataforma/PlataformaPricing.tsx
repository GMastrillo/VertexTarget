"use client";

import { useState } from "react";
import { Check, ShieldCheck, Sparkles } from "lucide-react";

export default function PlataformaPricing() {
  const [billingCycle, setBillingCycle] = useState<"mensal" | "anual">("anual");

  return (
    <section className="relative py-24 px-4 scroll-mt-20" id="planos">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-xs font-mono text-cyan-400 mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Investimento & Planos</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Escolha como quer começar e{" "}
          <span className="gradient-text">feche seu 1º cliente hoje</span>
        </h2>

        <p className="mt-4 text-sm sm:text-base text-white/60 max-w-xl mx-auto">
          Um único site vendido por R$ 600 a R$ 1.500 já paga a ferramenta pelo ano inteiro. O restante é 100% margem sua.
        </p>

        {/* Billing Switcher Toggle */}
        <div className="mt-8 flex justify-center">
          <div className="p-1 rounded-full bg-white/[0.06] border border-white/12 flex items-center relative shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle("mensal")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                billingCycle === "mensal"
                  ? "bg-white text-black shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("anual")}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 transition-all duration-300 cursor-pointer ${
                billingCycle === "anual"
                  ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <span>Anual</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/20">
                Economize 60%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing 3-Card Grid */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
        {/* Tier 1: Gratuito */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white/[0.02] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="text-xl font-bold text-white">Gratuito</h3>
              <p className="text-xs text-white/50 mt-1">Para conhecer e validar</p>
              <div className="mt-4">
                <span className="text-3xl font-black text-white">R$ 0</span>
                <span className="text-xs text-white/40 block mt-1">Sem cartão · 1 teste completo</span>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-white/70">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1 site completo gerado em menos de 1 minuto</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>1 busca no Maps: 10 negócios reais com telefone</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Editor visual completo para ajustes</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>CRM básico de acompanhamento</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <a
              href="https://wa.me/5519999999999?text=Ol%C3%A1%2C%20quero%20testar%20a%20plataforma%20de%20cria%C3%A7%C3%A3o%20de%20sites%20no%20plano%20gratuito"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center block transition-all"
            >
              Criar Conta Grátis
            </a>
            <p className="text-[10px] text-center text-white/40 mt-2">Sem prazo para decidir</p>
          </div>
        </div>

        {/* Tier 2: Starter */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-white/[0.05] to-black/60 border border-white/15 flex flex-col justify-between hover:border-cyan-400/50 transition-all shadow-xl">
          <div>
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="text-xl font-bold text-white">Starter</h3>
              <p className="text-xs text-white/50 mt-1">Para começar a vender com consistência</p>
              <div className="mt-4">
                {billingCycle === "anual" ? (
                  <div>
                    <span className="text-xs font-mono text-cyan-400 block font-bold">12x de</span>
                    <span className="text-4xl font-black text-white">R$ 74,27</span>
                    <span className="text-xs text-white/40 block mt-1">ou R$ 697 à vista no Pix</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-black text-white">R$ 147</span>
                    <span className="text-xs text-white/40 block mt-1">por mês no Pix ou cartão</span>
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-white">Sites ilimitados: gere quantos quiser</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Qualquer cidade do Brasil, sem limite geográfico</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>17 categorias comerciais de alta procura</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Sites 100% White Label (sem selo da plataforma)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Hospedagem de alta velocidade e SSL inclusos</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Scripts de abordagem e modelos de contrato</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <a
              href="https://wa.me/5519999999999?text=Ol%C3%A1%2C%20quero%20assinar%20o%20plano%20Starter%20da%20plataforma"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-extrabold text-xs uppercase tracking-wider text-center block transition-all shadow-md"
            >
              Escolher Starter
            </a>
            <p className="text-[10px] text-center text-white/40 mt-2">7 dias de garantia · Acesso imediato</p>
          </div>
        </div>

        {/* Tier 3: Pro (Highlighted) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-cyan-950/40 via-violet-950/20 to-black border-2 border-cyan-400/80 flex flex-col justify-between relative shadow-[0_0_40px_rgba(0,240,255,0.2)] hover:border-cyan-300 transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-cyan-400 text-black font-extrabold text-[10px] uppercase tracking-widest shadow-md">
            Mais Escolhido
          </div>

          <div>
            <div className="pb-4 border-b border-white/[0.08]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Pro</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-mono">
                  Scale
                </span>
              </h3>
              <p className="text-xs text-white/50 mt-1">Para transformar criação de sites em operação</p>
              <div className="mt-4">
                {billingCycle === "anual" ? (
                  <div>
                    <span className="text-xs font-mono text-cyan-400 block font-bold">12x de</span>
                    <span className="text-4xl font-black text-white">R$ 95,58</span>
                    <span className="text-xs text-white/40 block mt-1">ou R$ 897 à vista no Pix</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-black text-white">R$ 197</span>
                    <span className="text-xs text-white/40 block mt-1">por mês no Pix ou cartão</span>
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-xs sm:text-sm text-white/90">
              <li className="flex items-start gap-2.5 font-bold text-cyan-300">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Acesso exclusivo aos Templates Premium Awwwards</span>
              </li>
              <li className="flex items-start gap-2.5 font-bold text-cyan-300">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Comunidade exclusiva de networking com quem vende</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Tudo do Starter, com o dobro de velocidade</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Todas as 32 categorias comerciais completas</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Prospecção internacional em 10 países (cobre em USD/EUR)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Novos módulos de IA chegam primeiro no Pro</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-4">
            <a
              href="https://wa.me/5519999999999?text=Ol%C3%A1%2C%20quero%20assinar%20o%20plano%20PRO%20da%20plataforma"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider text-center block transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:scale-102"
            >
              Escolher Pro
            </a>
            <p className="text-[10px] text-center text-white/50 mt-2">7 dias de garantia · Cancele quando quiser</p>
          </div>
        </div>
      </div>

      {/* Trust Security Footer */}
      <div className="mt-12 flex items-center justify-center gap-3 text-xs text-white/40">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Pagamento 100% criptografado e seguro · 7 dias de garantia incondicional</span>
      </div>
    </section>
  );
}
