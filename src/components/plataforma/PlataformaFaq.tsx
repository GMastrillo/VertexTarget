"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "Preciso saber programar ou ter experiência com design?",
    a: "Não. A plataforma foi desenhada especificamente para quem não programa: você responde um questionário guiado de 4 passos e o site nasce pronto com fotos, copy de conversão e celular resolvido. Ajustes são feitos por cliques no editor visual.",
  },
  {
    q: "O resultado tem qualidade profissional de estúdio?",
    a: "Sim. Todos os modelos partem de layouts desenhados por diretores de arte, com tipografia de prestígio, proporções áureas, micro-interações e compatibilidade mobile perfeita. O que muda é o conteúdo e a identidade de cada comércio.",
  },
  {
    q: "Quanto eu consigo cobrar por projeto para os comércios?",
    a: "A média de mercado praticada por prestadores varia entre R$ 600 e R$ 2.500 por projeto. Como o fluxo guiado e o copywriting inteligente aceleram a produção, sua margem líquida é elevada e você mantém 100% da receita cobrada.",
  },
  {
    q: "Como encontro clientes na minha cidade se não tenho contatos?",
    a: "Nossa ferramenta de busca inteligente consulta a web em tempo real através do Google Search, identificando estabelecimentos ativos e verificando suas fontes reais para você abordar com um diagnóstico seguro.",
  },
  {
    q: "E se o cliente quiser alterar cores, textos ou fotos?",
    a: "Tudo é 100% editável. Você ou o cliente podem alterar textos, trocar fotos, ajustar botões de WhatsApp e cores quantas vezes precisarem no editor visual sem mexer em uma linha de código.",
  },
  {
    q: "Como funciona a garantia de 7 dias?",
    a: "Você tem 7 dias corridos para testar a plataforma livremente. Se por qualquer motivo você achar que não é para você, basta mandar uma mensagem no nosso suporte e nós reembolsamos 100% do valor pago na hora, sem perguntas.",
  },
];

export default function PlataformaFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative py-24 px-4 scroll-mt-20" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-xs font-mono text-primary mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Perguntas Frequentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Tire suas dúvidas antes de começar
          </h2>

          <p className="mt-3 text-sm text-muted-foreground">
            Transparência total sobre a operação, tecnologia e retorno do seu investimento.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-muted border border-border hover:border-border transition-all overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-foreground tracking-tight">
                    {item.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center bg-muted text-foreground shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-45 text-primary" : ""
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
