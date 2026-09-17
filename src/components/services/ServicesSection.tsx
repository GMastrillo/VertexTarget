"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import ServiceCard from "./ServiceCard";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (trackRef.current && scrollContainerRef.current) {
        const totalWidth = () =>
          trackRef.current
            ? Math.max(0, trackRef.current.scrollWidth - window.innerWidth + (window.innerWidth < 768 ? 40 : 80))
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
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services">
      {/* Pinned viewport: header + cards together — no dead space */}
      <div ref={scrollContainerRef} className="relative min-h-screen flex flex-col justify-center">
        {/* Section Header */}
        <div className="section-inner px-4 sm:px-8 md:px-12 pt-24 pb-10">
          <div className="label mb-4">Serviços</div>
          <h2 className="heading-lg mb-4">
            Soluções que movem
            <br />
            <span className="gradient-text">o seu digital.</span>
          </h2>
          <p className="body-lg max-w-xl">
            Da estratégia à execução. Combinamos marketing digital, engenharia de software
            e inteligência artificial para criar resultados mensuráveis.
          </p>
        </div>

        {/* Horizontal Cards Track */}
        <div
          ref={trackRef}
          className="flex items-stretch gap-5 sm:gap-8 px-4 sm:px-8 md:px-12 pb-20"
          style={{ width: "fit-content" }}
        >
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      <div className="divider mx-6" />
    </section>
  );
}
