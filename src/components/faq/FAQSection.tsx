"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useT } from "@/providers/LanguageProvider";

/**
 * FAQ accordion — VTEX-style objection handling before the contact section.
 * One item open at a time; smooth height animation; reduced-motion safe
 * (framer-motion respects the OS setting when `useReducedMotion` is honored
 * by the user — here transitions are short enough to be unobtrusive).
 */
export default function FAQSection() {
  const t = useT();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Title reveal via CSS-friendly IntersectionObserver (avoids extra GSAP
    // ScrollTriggers that go stale after locale switches)
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="section">
      <div className="section-inner max-w-3xl">
        {/* Header */}
        <div
          ref={titleRef}
          className="text-center mb-12 transition-all duration-700"
          style={{ opacity: 0, transform: "translateY(24px)" }}
        >
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
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
