"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/constants";
import ServiceCard from "./ServiceCard";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        });
      }

      // Horizontal scroll
      if (trackRef.current && scrollContainerRef.current) {
        const cards = trackRef.current.querySelectorAll(".service-card");
        const totalWidth = () =>
          trackRef.current
            ? Math.max(0, trackRef.current.scrollWidth - window.innerWidth + (window.innerWidth < 768 ? 60 : 160))
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

        // Stagger cards reveal
        cards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "left 80%",
              containerAnimation: gsap.getById("horizontalScroll") || undefined,
              toggleActions: "play none none none",
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services">
      {/* Section Header */}
      <div className="section">
        <div className="section-inner" ref={titleRef}>
          <div className="label mb-4">Serviços</div>
          <h2 className="heading-lg mb-6">
            Soluções que movem
            <br />
            <span className="gradient-text">o seu digital.</span>
          </h2>
          <p className="body-lg max-w-xl">
            Da estratégia à execução. Combinamos marketing digital, engenharia de software
            e inteligência artificial para criar resultados mensuráveis.
          </p>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={scrollContainerRef} className="relative min-h-screen">
        <div
          ref={trackRef}
          className="flex items-center gap-5 sm:gap-8 px-4 sm:px-8 md:px-12 h-screen"
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
