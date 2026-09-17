"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOCALES, LOCALE_LABELS, LOCALE_FLAGS, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/providers/LanguageProvider";

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { locale, setLocale } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Selecionar idioma"
        aria-expanded={open}
        className="liquid-glass w-11 h-11 rounded-full flex items-center justify-center text-base transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
      >
        <span className="leading-none">{LOCALE_FLAGS[locale]}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="liquid-glass absolute right-0 top-[52px] rounded-2xl py-2 min-w-[170px] z-[130]"
          >
            {LOCALES.map((l) => (
              <button
                key={l}
                onClick={() => {
                  setLocale(l);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors duration-150 cursor-pointer ${
                  l === locale
                    ? "text-[var(--color-vt-accent-cyan)] font-semibold"
                    : "text-[var(--color-vt-text)] hover:bg-white/[0.07]"
                }`}
              >
                <span className="text-base leading-none">{LOCALE_FLAGS[l]}</span>
                <span>{LOCALE_LABELS[l]}</span>
                {l === locale && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
