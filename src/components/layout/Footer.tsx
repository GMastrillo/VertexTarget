"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT =
  "VERTEXTARGET • MARKETING DIGITAL • AUTOMAÇÃO IA • DESENVOLVIMENTO WEB • WEBGL • ESTRATÉGIA DIGITAL • ";

export default function Footer() {
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

      {/* Footer Content */}
      <div className="section-inner py-12 px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          {/* Left */}
          <div>
            <div className="mb-4" style={{ fontFamily: "var(--font-heading)" }}>
              <span className="gradient-text text-2xl font-bold">Vertex</span>
              <span className="text-2xl font-bold" style={{ color: "var(--color-vt-text)" }}>
                Target
              </span>
            </div>
            <p className="body-md max-w-md" style={{ color: "var(--color-vt-text-dim)" }}>
              Engenharia digital de alto impacto.
              <br />
              Marketing + IA + Código.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <div className="flex gap-6">
              {[
                { label: "GitHub", href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "Instagram", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-sm font-medium transition-colors duration-300 hover:text-white"
                  style={{ color: "var(--color-vt-text-muted)" }}
                >
                  {social.label}
                </a>
              ))}
            </div>
            <p className="text-xs" style={{ color: "var(--color-vt-text-dim)" }}>
              © {new Date().getFullYear()} VertexTarget. Engineered with{" "}
              <span className="gradient-text">precision</span>.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
