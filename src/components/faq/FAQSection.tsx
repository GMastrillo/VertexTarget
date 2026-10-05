"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { motionTokens } from "@/lib/motion";
import { useT } from "@/providers/LanguageProvider";

/**
 * FAQ accordion — VTEX-style objection handling before the contact section.
 * One item open at a time; reduced motion uses a short fade without layout travel.
 */
export default function FAQSection() {
  const t = useT();
  const reducedMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="section-inner max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="label mb-4">{t.faq.label}</div>
          <h2 className="heading-lg">
            {t.faq.title1}
            <br />
            <span className="gradient-text">{t.faq.title2}</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {t.faq.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={item.q}
                className="rounded-2xl border transition-all duration-300 overflow-hidden"
                style={{
                  background: "var(--card-grad-a)",
                  backdropFilter: "blur(20px) saturate(170%)",
                  WebkitBackdropFilter: "blur(20px) saturate(170%)",
                  borderColor: isOpen ? "rgba(0, 240, 255, 0.35)" : "var(--glass-border)",
                  boxShadow: isOpen
                    ? "0 18px 50px -20px rgba(0, 240, 255, 0.18), inset 0 1px 0 var(--glass-highlight)"
                    : "var(--glass-outer-shadow), inset 0 1px 0 var(--glass-highlight)",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 sm:px-7 py-5 cursor-pointer"
                >
                  <span
                    className="text-base sm:text-lg font-semibold leading-snug"
                    style={{
                      fontFamily: "var(--font-heading)",
                      color: isOpen ? "var(--color-vt-text)" : "var(--color-vt-text-muted)",
                    }}
                  >
                    {item.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen ? "rgba(0, 240, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${isOpen ? "rgba(0, 240, 255, 0.4)" : "var(--glass-border)"}`,
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      stroke={isOpen ? "var(--color-vt-accent-cyan)" : "var(--color-vt-text-dim)"}
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M7 1v12M1 7h12" />
                    </svg>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: reducedMotion ? motionTokens.duration.fast : motionTokens.duration.base, ease: motionTokens.ease.out }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        className="px-6 sm:px-7 pb-6 text-sm sm:text-base leading-relaxed"
                        style={{ color: "var(--color-vt-text-muted)" }}
                      >
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="divider mt-16" />
    </section>
  );
}
