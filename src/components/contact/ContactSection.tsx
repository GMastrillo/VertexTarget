"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/providers/LanguageProvider";
import { InterestForm } from "@/components/contact/interest-form";
import { normalizeBrazilianPhone } from "@/lib/os/contact";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formWrapRef = useRef<HTMLDivElement>(null);

  const rawPhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappNumber = rawPhone ? normalizeBrazilianPhone(rawPhone) : null;

  useEffect(() => {
    const ctx = gsap.matchMedia();
    ctx.add("(prefers-reduced-motion: no-preference)", () => {
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

      if (formWrapRef.current) {
        gsap.from(formWrapRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formWrapRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="section">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left — Info */}
          <div ref={titleRef}>
            <div className="label mb-4">{t.contact.label}</div>
            <h2 className="heading-lg mb-6">
              {t.contact.title1}
              <br />
              <span className="gradient-text">{t.contact.title2}</span>
            </h2>
            <p className="body-lg mb-8">{t.contact.subtitle}</p>

            <div className="space-y-4">
              <div>
                <div
                  className="text-xs tracking-wider uppercase mb-1"
                  style={{ color: "var(--color-vt-text-dim)" }}
                >
                  {t.contact.email}
                </div>
                <a
                  href="mailto:contato@vertextarget.com"
                  className="text-lg transition-colors duration-300 hover:text-[var(--color-vt-accent-cyan)]"
                  style={{ color: "var(--color-vt-text)" }}
                >
                  contato@vertextarget.com
                </a>
              </div>

              <div>
                <div
                  className="text-xs tracking-wider uppercase mb-1"
                  style={{ color: "var(--color-vt-text-dim)" }}
                >
                  {t.contact.location}
                </div>
                <span
                  className="text-lg"
                  style={{ color: "var(--color-vt-text-muted)" }}
                >
                  {t.contact.locationValue}
                </span>
              </div>

              {whatsappNumber && (
                <div className="pt-4">
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      "Olá, gostaria de conversar sobre um projeto com a VertexTarget!"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{
                      backgroundColor: "var(--color-vt-success)",
                      color: "var(--primary-foreground)",
                      boxShadow: "0 0 24px rgba(0, 230, 118, 0.35)",
                    }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                    <span>Iniciar conversa no WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right — Real Persisted Interest Form */}
          <div ref={formWrapRef} className="rounded-2xl border border-border/50 bg-card/30 p-6 sm:p-8 backdrop-blur-sm shadow-xl">
            <InterestForm source="home-contact" />
          </div>
        </div>
      </div>
    </section>
  );
}
