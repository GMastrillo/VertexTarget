"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { motionTokens } from "@/lib/motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const isDark = mounted ? resolvedTheme !== "light" : true;
  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="liquid-glass relative flex size-10 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:size-11"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ opacity: 0, rotate: reducedMotion ? 0 : -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: reducedMotion ? 0 : 90 }}
          transition={{ duration: reducedMotion ? 0 : motionTokens.duration.fast, ease: motionTokens.ease.out }}
          className="flex items-center justify-center"
        >
          <Icon size={18} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
