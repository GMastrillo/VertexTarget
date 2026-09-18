"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AILabSection() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: "assistant",
              content: assistantContent,
            };
            return updated;
          });
        }
      }
    } catch {
      // Do not hide production outages behind fabricated AI output.
      const message = process.env.NODE_ENV === "development"
        ? generateDemoResponse(userMessage)
        : "O serviço de IA está indisponível no momento. Tente novamente mais tarde.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section ref={sectionRef} id="ai-lab" className="section">
      <div className="section-inner">
        {/* Header */}
        <div ref={titleRef} className="mb-12">
          <div className="label mb-4">{t.aiLab.label}</div>
          <h2 className="heading-lg mb-6">
            {t.aiLab.title1}
            <br />
            <span className="gradient-text">{t.aiLab.title2}</span>
          </h2>
          <p className="body-lg max-w-xl">{t.aiLab.subtitle}</p>
        </div>

        {/* Chat Interface */}
        <div
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-vt-bg-card)",
            border: "1px solid var(--color-vt-border)",
          }}
        >
          {/* Terminal header */}
          <div
            className="flex items-center gap-2 px-5 py-3 border-b"
            style={{ borderColor: "var(--color-vt-border)" }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
            </div>
            <span
              className="ml-3 text-xs font-mono"
              style={{ color: "var(--color-vt-text-dim)" }}
            >
              vertextarget-ai v1.0 — gemini-pro
            </span>
          </div>

          {/* Messages */}
          <div
            className="min-h-[300px] max-h-[400px] overflow-y-auto p-6 space-y-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div
                  className="text-5xl mb-4"
                  style={{ filter: "grayscale(0.3)" }}
                >
                  ⚡
                </div>
                <p className="body-md mb-6">{t.aiLab.empty}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {t.aiLab.suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setInput(s)}
                      className="px-3 py-1.5 rounded-full text-xs transition-all duration-200 hover:scale-105"
                      style={{
                        background: "rgba(0, 240, 255, 0.06)",
                        color: "var(--color-vt-accent-cyan)",
                        border: "1px solid rgba(0, 240, 255, 0.15)",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed"
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg, var(--color-vt-accent-cyan), var(--color-vt-accent-violet))"
                        : "var(--color-vt-surface)",
                    color:
                      msg.role === "user"
                        ? "var(--color-vt-bg)"
                        : "var(--color-vt-text)",
                  }}
                >
                  {msg.content}
                  {msg.role === "assistant" && isLoading && i === messages.length - 1 && (
                    <span className="inline-block ml-1 animate-pulse">▊</span>
                  )}
                </div>
              </motion.div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-1 px-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "var(--color-vt-accent-cyan)" }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 p-4 border-t"
            style={{ borderColor: "var(--color-vt-border)" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.aiLab.placeholder}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-colors duration-200"
              style={{
                background: "var(--color-vt-surface)",
                color: "var(--color-vt-text)",
                border: "1px solid var(--color-vt-border)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--color-vt-accent-cyan)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--color-vt-border)";
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
              style={{
                background:
                  "linear-gradient(135deg, var(--color-vt-accent-cyan), var(--color-vt-accent-violet))",
                color: "var(--color-vt-bg)",
              }}
            >
              {t.aiLab.send}
            </button>
          </form>
        </div>
      </div>

      <div className="divider mt-16" />
    </section>
  );
}

function generateDemoResponse(prompt: string): string {
  return `## Estratégia VertexTarget AI — Análise Rápida

**Negócio:** ${prompt}

### 🎯 Posicionamento Digital
Recomendamos uma abordagem de marketing digital focada em autoridade e conversão. Seu nicho tem potencial para crescimento de 3-5x nos próximos 12 meses com a estratégia correta.

### 📊 Canais Prioritários
1. **Google Ads (Search + Performance Max)** — Captação de demanda ativa
2. **Instagram + Reels** — Branding e prova social
3. **SEO Técnico** — Tráfego orgânico de longo prazo
4. **Email Marketing Automatizado** — Nutrição e retenção

### 🤖 Automações com IA
- Segmentação preditiva de audiência
- Copy dinâmico A/B testado por IA
- Chatbot inteligente para qualificação de leads
- Dashboard de métricas em tempo real

### 💡 Próximos Passos
Entre em contato para receber um diagnóstico completo e personalizado do seu negócio.

*— Motor IA VertexTarget v1.0*`;
}
