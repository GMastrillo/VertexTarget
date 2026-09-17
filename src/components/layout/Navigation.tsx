"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { NAV_LINKS } from "@/lib/constants";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 50);
      setHidden(currentY > lastScrollY.current && currentY > 300);
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: hidden ? -100 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 sm:px-12 py-5 sm:py-6 transition-all duration-500"
      >
        <div
          className={`relative mx-auto max-w-[1400px] w-full flex items-center justify-between transition-all duration-500 ${
            isScrolled
              ? "bg-[#050510]/85 backdrop-blur-xl border border-white/10 px-8 py-3.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(0,240,255,0.05)]"
              : "bg-transparent border-0 shadow-none px-0 py-0"
          }`}
        >
          {/* COLUMN 1 (LEFT): VertexTarget Logo — Aumentado para presença marcante e imponente */}
          <div className="flex items-center justify-start z-10">
            <a
              href="#hero"
              className="font-heading text-3xl sm:text-[34px] lg:text-[38px] font-black tracking-tight flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]"
              style={{ fontFamily: "var(--font-heading)" }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#hero");
              }}
            >
              <span className="gradient-text font-black">Vertex</span>
              <span className="text-white font-bold opacity-95">Target</span>
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_14px_#00f0ff] animate-pulse ml-0.5" />
            </a>
          </div>

          {/* COLUMN 2 (CENTER): 100% ABSOLUTE DEAD-CENTER DOS LINKS NO VIEWPORT */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
            <div className="flex items-center gap-8 xl:gap-11">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                />
              ))}
            </div>
          </div>

          {/* COLUMN 3 (RIGHT): Botão Iniciar Projeto — Redesenhado em Neon Glass de Alto Luxo */}
          <div className="flex items-center justify-end gap-3 z-10">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-3 px-7 py-3 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden cursor-pointer"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0, 240, 255, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
                border: "1.5px solid rgba(0, 240, 255, 0.65)",
                boxShadow:
                  "0 0 20px rgba(0, 240, 255, 0.25), inset 0 0 15px rgba(0, 240, 255, 0.08)",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact");
              }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-pulse" />
              <span className="relative z-10 text-white font-extrabold tracking-wider group-hover:text-cyan-300 transition-colors">
                Iniciar Projeto
              </span>
              <svg
                className="relative z-10 w-4 h-4 text-cyan-400 transform group-hover:translate-x-1.5 transition-transform duration-300"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Efeito shimmer ao passar o mouse */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </a>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden relative z-[110] w-12 h-12 rounded-full bg-white/[0.06] border border-white/15 hover:border-cyan-400/60 flex flex-col items-center justify-center gap-1.5 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              <motion.span
                animate={{
                  rotate: isOpen ? 45 : 0,
                  y: isOpen ? 6 : 0,
                }}
                className="block w-5 h-[2px] rounded-full"
                style={{ background: "var(--color-vt-text)" }}
              />
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="block w-5 h-[2px] rounded-full"
                style={{ background: "var(--color-vt-text)" }}
              />
              <motion.span
                animate={{
                  rotate: isOpen ? -45 : 0,
                  y: isOpen ? -6 : 0,
                }}
                className="block w-5 h-[2px] rounded-full"
                style={{ background: "var(--color-vt-text)" }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8 px-6"
            style={{ background: "rgba(5, 5, 16, 0.98)" }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ delay: i * 0.08 + 0.2, duration: 0.5 }}
                className="heading-md hover:text-cyan-400 transition-colors"
                style={{ fontFamily: "var(--font-heading)" }}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
              >
                {link.label}
              </motion.a>
            ))}

            <motion.a
              href="#contact"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#contact");
              }}
              className="mt-6 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-white bg-white/[0.08] border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.3)]"
            >
              Iniciar Projeto
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: () => void;
}) {
  const { ref, onMouseMove, onMouseLeave } =
    useMagneticEffect<HTMLAnchorElement>({ strength: 0.2 });

  return (
    <a
      ref={ref as React.Ref<HTMLAnchorElement>}
      href={href}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="relative py-2 text-[15px] font-medium transition-colors duration-200 group text-zinc-300 hover:text-white"
    >
      <span className="relative z-10 transition-colors duration-200">
        {label}
      </span>
      {/* Subtle glowing underline indicator */}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#00f0ff]" />
    </a>
  );
}
