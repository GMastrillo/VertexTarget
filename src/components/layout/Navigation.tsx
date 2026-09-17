"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "@/lib/constants";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { useT } from "@/providers/LanguageProvider";

export default function Navigation() {
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);

  // rAF loop: immune to Lenis scroll interception and missed scroll events.
  // React bails out of re-renders when the computed value is unchanged.
  useEffect(() => {
    let raf: number;
    const loop = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > lastScrollY.current && y > 300);
      lastScrollY.current = y;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
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
      {/* Transparent bar — big logo on the left, spacious links in the center */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{
          y: hidden ? -120 : 0,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-5 sm:px-14 lg:px-20 py-4 sm:py-8 transition-[padding] duration-500"
        style={{ paddingTop: scrolled ? 14 : undefined, paddingBottom: scrolled ? 14 : undefined }}
      >
        {/* Liquid Glass shell — invisible at top, frosted when scrolled */}
        <div
          className={`relative mx-auto max-w-[1400px] w-full grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center rounded-full transition-all duration-500 ${
            scrolled ? "liquid-glass px-6 sm:px-8 py-2.5" : "bg-transparent border-0 shadow-none px-0 py-0"
          }`}
        >
          {/* Logo — detached from the top-left corner with generous spacing */}
          <a
            href="#hero"
            className="flex items-center gap-2 transition-transform duration-300 hover:scale-[1.03] justify-self-start"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#hero");
            }}
          >
            <span
              className="gradient-text font-heading font-black text-2xl sm:text-4xl lg:text-[40px] tracking-tight leading-none"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0, 240, 255, 0.25))" }}
            >
              Vertex
            </span>
            <span
              className="font-bold text-2xl sm:text-4xl lg:text-[40px] tracking-tight leading-none"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--color-vt-text)",
                filter: "drop-shadow(0 2px 6px var(--logo-shadow))",
              }}
            >
              Target
            </span>
            <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_14px_#00f0ff] animate-pulse ml-1" />
          </a>

          {/* Links — dead-center of the viewport (middle grid column) */}
          <div className="hidden lg:flex items-center justify-center">
            <nav className="flex items-center gap-12 xl:gap-16">
              {[
                { href: "#hero", label: t.nav.hero },
                { href: "#services", label: t.nav.services },
                { href: "#cases", label: t.nav.cases },
                { href: "#about", label: t.nav.about },
                { href: "#ai-lab", label: t.nav.aiLab },
                { href: "#contact", label: t.nav.contact },
              ].map((link) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                />
              ))}
            </nav>
          </div>

          {/* Right column: language switcher + theme toggle (fixed top-right) */}
          <div className="hidden lg:flex items-center justify-self-end gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile: language + theme + hamburger in the right grid column */}
          <div className="lg:hidden flex items-center gap-2 justify-self-end">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              className="relative z-[110] w-10 h-10 rounded-full bg-white/[0.06] border border-white/15 hover:border-cyan-400/60 flex flex-col items-center justify-center gap-1.5 transition-colors"
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

      {/* Mobile Full-Screen Menu (language switcher injected next to theme via portal-free mount) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 40px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 40px) 40px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8 px-6"
            style={{ background: "var(--menu-overlay)" }}
          >
            {[
              { href: "#hero", label: t.nav.hero },
              { href: "#services", label: t.nav.services },
              { href: "#cases", label: t.nav.cases },
              { href: "#about", label: t.nav.about },
              { href: "#ai-lab", label: t.nav.aiLab },
              { href: "#contact", label: t.nav.contact },
            ].map((link, i) => (
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
              className="mt-6 px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider bg-white/[0.08] border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.3)]"
              style={{ color: "var(--color-vt-text)" }}
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
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-vt-text)")}
      onMouseLeave={(e) => {
        onMouseLeave();
        e.currentTarget.style.color = "var(--color-vt-text-muted)";
      }}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className="relative py-2 text-lg xl:text-xl font-medium transition-colors duration-200 group text-center"
      style={{ color: "var(--color-vt-text-muted)" }}
    >
      <span className="relative z-10 transition-colors duration-200">
        {label}
      </span>
      {/* Glowing underline indicator */}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#00f0ff]" />
    </a>
  );
}
