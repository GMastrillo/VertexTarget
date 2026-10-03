"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Menu, X, Sparkles } from "lucide-react";
import ThemeToggle from "@/components/layout/ThemeToggle";

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "liquid-glass py-3 border-b border-white/10"
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
              <span className="font-bold text-2xl text-white tracking-tight">
                OS
              </span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] animate-pulse" />
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              <Sparkles className="w-2.5 h-2.5" /> Criador de Sites
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-white/70">
            <a href="#ferramentas" className="hover:text-cyan-400 transition-colors">
              Ferramentas
            </a>
            <a href="#modelos" className="hover:text-cyan-400 transition-colors">
              Modelos
            </a>
            <a href="#planos" className="hover:text-cyan-400 transition-colors">
              Planos
            </a>
            <a href="#faq" className="hover:text-cyan-400 transition-colors">
              FAQ
            </a>
            <Link
              href="/"
              className="flex items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao site
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <a
              href="#planos"
              className="px-5 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all hover:scale-105"
            >
              Começar Agora
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 text-white"
              aria-label="Abrir menu"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#060612]/95 backdrop-blur-2xl pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            <a
              href="#ferramentas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-cyan-400"
            >
              Ferramentas
            </a>
            <a
              href="#modelos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-cyan-400"
            >
              Modelos
            </a>
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-cyan-400"
            >
              Planos
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-white hover:text-cyan-400"
            >
              FAQ
            </a>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold text-cyan-400 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Voltar ao site principal
            </Link>
            <div className="pt-4 border-t border-white/10">
              <a
                href="#planos"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-cyan-400 text-black font-extrabold text-xs uppercase tracking-wider text-center block shadow-[0_0_20px_rgba(0,240,255,0.4)]"
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
