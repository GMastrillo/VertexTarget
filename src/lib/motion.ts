/**
 * Design System Motion Tokens
 * Reusable animation durations, easing curves, and distances
 * for synchronized GSAP and Motion animations.
 */

export const motionTokens = {
  duration: {
    fast: 0.2,
    base: 0.45,
    slow: 0.9,
    hero: 1.4,
  },
  ease: {
    out: [0.22, 1, 0.36, 1] as const,
    gsapOut: "power3.out",
    gsapInOut: "power3.inOut",
    gsapExpo: "expo.out",
    power2Out: "power2.out",
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    loose: 0.14,
  },
  distance: {
    sm: 12,
    md: 24,
    lg: 48,
  },
} as const;

export type MotionTokens = typeof motionTokens;
