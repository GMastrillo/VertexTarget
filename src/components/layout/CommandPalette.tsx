"use client";
/* eslint-disable max-lines-per-function -- keyboard navigation and palette rendering share state. */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/providers/LanguageProvider";

interface Command {
  id: string;
  label: string;
  hint: string;
  href: string;
  keywords: string;
}

/**
 * Linear/Stripe-style command palette (⌘K / Ctrl+K).
 * Fuzzy search across sections + theme/language actions.
 */
export default function CommandPalette() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    { id: "hero", label: t.nav.hero, hint: "Início", href: "#hero", keywords: "home inicio start" },
    { id: "services", label: t.nav.services, hint: "Serviços", href: "#services", keywords: "serviços services automação web seo infra" },
    { id: "cases", label: t.nav.cases, hint: "Portfólio", href: "#cases", keywords: "cases portfolio projetos clinicflow autobelle elon watches" },
    { id: "about", label: t.nav.about, hint: "Liderança", href: "#about", keywords: "sobre about ceos gabriel denis equipe" },
    { id: "ai-lab", label: t.nav.aiLab, hint: "IA", href: "#ai-lab", keywords: "ai lab ia gemini estratégia" },
    { id: "contact", label: t.nav.contact, hint: "Contato", href: "#contact", keywords: "contato contact orçamento email conversar" },
  ];

  const filtered = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.keywords.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = useCallback((href: string) => {
    setOpen(false);
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Global shortcut: ⌘K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Keyboard navigation
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      navigate(filtered[activeIndex].href);
    }
  };

  return (
    <>
      {/* Floating trigger button (bottom-right, subtle) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[90] hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass text-xs font-mono transition-all duration-300 hover:scale-105 cursor-pointer"
        aria-label="Abrir command palette (Ctrl+K)"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <span style={{ color: "var(--color-vt-text-dim)" }}>K</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[210] flex items-start justify-center pt-[18vh] px-4"
            style={{ background: "rgba(5, 5, 16, 0.72)", backdropFilter: "blur(10px)" }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl rounded-2xl border overflow-hidden shadow-2xl"
              style={{
                background: "var(--card-grad-a)",
                backdropFilter: "blur(28px) saturate(180%)",
                WebkitBackdropFilter: "blur(28px) saturate(180%)",
                borderColor: "var(--glass-border)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-5 py-4 border-b"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-vt-text-dim)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={t.palette.placeholder}
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--color-vt-text)" }}
                />
                <kbd
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{ color: "var(--color-vt-text-dim)", borderColor: "var(--glass-border)" }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="p-2 max-h-[320px] overflow-y-auto" role="listbox">
                {filtered.length === 0 && (
                  <div
                    className="px-4 py-8 text-center text-sm"
                    style={{ color: "var(--color-vt-text-dim)" }}
                  >
                    {t.palette.empty}
                  </div>
                )}
                {filtered.map((c, i) => (
                  <button
                    key={c.id}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => navigate(c.href)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors duration-100 cursor-pointer"
                    style={{
                      background: i === activeIndex ? "rgba(0, 240, 255, 0.08)" : "transparent",
                    }}
                  >
                    <span className="flex items-center gap-3 min-w-0">
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: i === activeIndex ? "var(--color-vt-accent-cyan)" : "var(--glass-border)" }}
                      />
                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: i === activeIndex ? "var(--color-vt-text)" : "var(--color-vt-text-muted)" }}
                      >
                        {c.label}
                      </span>
                    </span>
                    <span
                      className="text-[11px] font-mono flex-shrink-0 ml-3"
                      style={{ color: "var(--color-vt-text-dim)" }}
                    >
                      {c.hint}
                    </span>
                  </button>
                ))}
              </div>

              {/* Footer hints */}
              <div
                className="flex items-center gap-4 px-5 py-2.5 border-t text-[10px] font-mono"
                style={{ borderColor: "var(--glass-border)", color: "var(--color-vt-text-dim)" }}
              >
                <span>↑↓ {t.palette.navigate}</span>
                <span>↵ {t.palette.select}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
