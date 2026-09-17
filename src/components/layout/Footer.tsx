"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT =
  "VERTEXTARGET • MARKETING DIGITAL • AUTOMAÇÃO IA • DESENVOLVIMENTO WEB • WEBGL • ESTRATÉGIA DIGITAL • ";

export default function Footer() {
  const t = useT();
  const marqueeRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    gsap.to(marqueeRef.current, {
      xPercent: -50,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

    // Footer reveal
    if (footerRef.current) {
      gsap.from(footerRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
        },
      });
    }
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden" style={{ background: "var(--color-vt-bg)" }}>
      {/* Marquee */}
      <div className="overflow-hidden py-8 border-t border-b" style={{ borderColor: "var(--color-vt-border)" }}>
        <div ref={marqueeRef} className="whitespace-nowrap flex" style={{ width: "fit-content" }}>
          <span
            className="heading-lg inline-block"
            style={{
              opacity: 0.08,
              fontFamily: "var(--font-heading)",
              paddingRight: "2rem",
            }}
          >
            {MARQUEE_TEXT.repeat(4)}
          </span>
        </div>
      </div>

      {/* Footer Content — fully centered */}
      <div className="section-inner py-14 px-6 flex flex-col items-center text-center gap-8">
        {/* Logo */}
        <div style={{ fontFamily: "var(--font-heading)" }}>
          <span className="gradient-text text-3xl font-black tracking-tight">Vertex</span>
          <span className="text-3xl font-bold tracking-tight" style={{ color: "var(--color-vt-text)" }}>
            Target
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#00f0ff] animate-pulse inline-block ml-1.5" />
        </div>

        {/* Tagline */}
        <p className="body-md max-w-md" style={{ color: "var(--color-vt-text-dim)" }}>
          {t.footer.tagline1}
          <br />
          {t.footer.tagline2}
        </p>

        {/* Divider */}
        <div className="w-24 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--color-vt-accent-cyan), transparent)" }} />

        {/* Social Links — centered */}
        <div className="flex items-center gap-8">
          {[
            { label: "GitHub", href: "#" },
            { label: "LinkedIn", href: "#" },
            { label: "Instagram", href: "#" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{ color: "var(--color-vt-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-vt-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-vt-text-muted)")}
            >
              {social.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs" style={{ color: "var(--color-vt-text-dim)" }}>
          © {new Date().getFullYear()} {t.footer.copyright}{" "}
          <span className="gradient-text">{t.footer.precision}</span>.
        </p>
      </div>
    </footer>
  );
}
