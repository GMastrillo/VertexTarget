"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Menu, X, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useEscapeDismiss } from "@/hooks/useEscapeDismiss";

export default function PlataformaNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEscapeDismiss(mobileMenuOpen, () => setMobileMenuOpen(false));

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "liquid-glass py-3 border-b border-border"
            : "bg-transparent py-5 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <span className="gradient-text font-heading font-black text-2xl tracking-tight">
                Vertex
              </span>
              <span className="font-bold text-2xl text-foreground tracking-tight">
                OS
              </span>
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#00f0ff] animate-pulse" />
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-2.5 h-2.5" /> Criador de Sites
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <a href="#ferramentas" className="hover:text-primary transition-colors">
              Ferramentas
            </a>
            <a href="#modelos" className="hover:text-primary transition-colors">
              Modelos
            </a>
            <a href="#planos" className="hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#planos"
              className="px-5 py-2.5 rounded-full bg-primary hover:bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
            >
              Começar Agora
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-muted text-foreground"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="platform-mobile-menu"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="platform-mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background backdrop-blur-2xl pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            <a
              href="#ferramentas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-foreground hover:text-primary"
            >
              Ferramentas
            </a>
            <a
              href="#modelos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-foreground hover:text-primary"
            >
              Modelos
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-foreground hover:text-primary"
            >
              Planos
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-foreground hover:text-primary"
            >
              FAQ
            </a>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-primary flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao site principal
            </Link>
            <div className="pt-4 border-t border-border">
              <a
                href="#planos"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider text-center block shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                Ver Planos
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
