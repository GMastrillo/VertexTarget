"use client";

import { type ReactNode } from "react";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
  variant?: "primary" | "secondary" | "ghost";
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  strength = 0.3,
  variant = "secondary",
}: MagneticButtonProps) {
  const { ref, onMouseMove, onMouseLeave } =
    useMagneticEffect<HTMLButtonElement | HTMLAnchorElement>({ strength });

  // Luxury refined button variants — theme-aware via CSS variables
  const variantStyles = {
    primary: `
      relative inline-flex items-center justify-center gap-3
      px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] min-w-[180px] sm:min-w-[200px]
      rounded-full
      font-bold text-xs sm:text-sm tracking-wider uppercase
      shadow-[0_0_25px_rgba(0,240,255,0.4),0_0_50px_rgba(139,92,246,0.25)]
      hover:shadow-[0_0_35px_rgba(0,240,255,0.7),0_0_70px_rgba(139,92,246,0.4)]
      hover:scale-[1.03] active:scale-[0.98]
      transition-all duration-300
      overflow-hidden group cursor-pointer
      ${className}
    `,
    secondary: `
      relative inline-flex items-center justify-center gap-3
      px-7 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] min-w-[180px] sm:min-w-[200px]
      rounded-full
      font-semibold text-xs sm:text-sm tracking-wider uppercase
      backdrop-blur-xl
      border border-white/20
      hover:border-cyan-400/80
      shadow-[0_4px_20px_rgba(0,0,0,0.5)]
      hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]
      hover:scale-[1.03] active:scale-[0.98]
      transition-all duration-300
      overflow-hidden group cursor-pointer
      ${className}
    `,
    ghost: `
      relative inline-flex items-center justify-center gap-2.5
      px-7 py-3.5 rounded-full
      font-semibold text-sm tracking-wide
      hover:bg-white/[0.08]
      transition-all duration-300 cursor-pointer
      ${className}
    `,
  };

  const isPrimary = variant === "primary";

  const innerContent = (
    <>
      {isPrimary && (
        <>
          {/* Gradient background */}
          <span
            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105"
            style={{
              background:
                "linear-gradient(135deg, #00f0ff 0%, #8b5cf6 60%, #e040fb 100%)",
            }}
          />
          {/* Shimmer sweep effect */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        </>
      )}

      {!isPrimary && variant === "secondary" && (
        <>
          {/* Subtle cyan glow accent on hover */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/10 via-violet-500/10 to-transparent pointer-events-none" />
        </>
      )}

      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </>
  );

  /* Theme-aware text/icon colors per variant */
  const textColors: Record<string, string> = {
    primary: "var(--color-vt-btn-primary-text, #050510)",
    secondary: "var(--color-vt-text)",
    ghost: "var(--color-vt-text-muted)",
  };

  const handleHoverEnter =
    variant === "primary"
      ? undefined
      : (e: React.MouseEvent<HTMLElement>) =>
          (e.currentTarget.style.color = "var(--color-vt-accent-cyan)");
  const handleHoverLeave =
    variant === "primary"
      ? undefined
      : (e: React.MouseEvent<HTMLElement>) =>
          (e.currentTarget.style.color = textColors[variant]);

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={variantStyles[variant]}
        style={{
          color: textColors[variant],
          background:
            variant === "secondary" ? "var(--color-vt-glass-btn-bg, rgba(10, 10, 34, 0.85))" : undefined,
        }}
        onMouseMove={onMouseMove}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={(e) => {
          onMouseLeave();
          handleHoverLeave?.(e);
        }}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      onClick={onClick}
      className={variantStyles[variant]}
      style={{
        color: textColors[variant],
        background:
          variant === "secondary" ? "var(--color-vt-glass-btn-bg, rgba(10, 10, 34, 0.85))" : undefined,
      }}
      onMouseMove={onMouseMove}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={(e) => {
        onMouseLeave();
        handleHoverLeave?.(e);
      }}
    >
      {innerContent}
    </button>
  );
}
