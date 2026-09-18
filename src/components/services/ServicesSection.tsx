"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import ServiceCard from "./ServiceCard";
import { useLanguage } from "@/providers/LanguageProvider";
import { CARD_CONTENT } from "@/lib/i18n-data";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const { t, locale } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Card copy follows the active locale (titles, descriptions, tags)
  const localizedServices = SERVICES.map((service) => ({
    ...service,
    ...CARD_CONTENT[locale].services[service.id],
  }));

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop/tablet only: pinned horizontal scroll driven by vertical scroll.
    // Mobile uses native swipe (overflow-x + snap) — a pinned 480px card stack
    // cannot fit a phone viewport.
    mm.add("(min-width: 768px)", () => {
      if (!trackRef.current || !scrollContainerRef.current) return;

      const totalWidth = () =>
        trackRef.current
          ? Math.max(0, trackRef.current.scrollWidth - window.innerWidth + 80)
          : 0;

      gsap.to(trackRef.current, {
        x: () => -totalWidth(),
        ease: "none",
        scrollTrigger: {
          trigger: scrollContainerRef.current,
          start: "top top",
          end: () => `+=${totalWidth()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  // Card copy changes size on locale switch — recalculate the pinned scroll distance
  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [locale]);

  return (
    <section ref={sectionRef} id="services" className="overflow-hidden">
      {/* Mobile: native swipe with snap. Desktop: pinned viewport with header + cards */}
      <div
        ref={scrollContainerRef}
        className="relative md:min-h-screen flex flex-col justify-center"
      >
        {/* Section Header */}
        <div className="section-inner px-5 sm:px-8 md:px-12 pt-24 pb-8 md:pb-10">
          <div className="label mb-4">{t.services.label}</div>
          <h2 className="heading-lg mb-4">
            {t.services.title1}
            <br />
            <span className="gradient-text">{t.services.title2}</span>
          </h2>
          <p className="body-lg max-w-xl">{t.services.subtitle}</p>
        </div>

        {/* Horizontal Cards Track — native swipe on mobile, GSAP-pinned on desktop */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-4 sm:gap-8 px-5 sm:px-8 md:px-12 pb-16 md:pb-20 w-full md:w-fit overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scrollbar-hide"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {localizedServices.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Mobile swipe hint */}
        <div className="md:hidden flex justify-center pb-8">
          <span
            className="text-[11px] font-mono uppercase tracking-widest animate-pulse"
            style={{ color: "var(--color-vt-text-dim)" }}
          >
            ← {t.services.swipeHint} →
          </span>
        </div>
      </div>

      <div className="divider mx-6" />
    </section>
  );
}
