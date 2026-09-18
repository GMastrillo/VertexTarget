"use client";
/* eslint-disable max-lines-per-function -- contact form and its status states are a single user flow. */

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useT } from "@/providers/LanguageProvider";

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const t = useT();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
    budget: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current.children, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
          },
        });
      }

      // Animate form inputs on reveal
      if (formRef.current) {
        const inputs = formRef.current.querySelectorAll(".form-field");
        gsap.from(inputs, {
          y: 30,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate form submission
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");

    setTimeout(() => {
      setStatus("idle");
      setFormState({ name: "", email: "", message: "", budget: "" });
    }, 3000);
  };

  const inputStyle = {
    background: "transparent",
    borderBottom: "1px solid var(--color-vt-border)",
    color: "var(--color-vt-text)",
    padding: "1rem 0",
    width: "100%",
    outline: "none",
    fontSize: "1rem",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.3s ease",
  };

  return (
    <section ref={sectionRef} id="contact" className="section">
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — Info */}
          <div ref={titleRef}>
            <div className="label mb-4">{t.contact.label}</div>
            <h2 className="heading-lg mb-6">
              {t.contact.title1}
              <br />
              <span className="gradient-text">{t.contact.title2}</span>
            </h2>
            <p className="body-lg mb-8">{t.contact.subtitle}</p>

            <div className="space-y-4">
              <div>
                <div
                  className="text-xs tracking-wider uppercase mb-1"
                  style={{ color: "var(--color-vt-text-dim)" }}
                >
                  {t.contact.email}
                </div>
                <a
                  href="mailto:contato@vertextarget.com"
                  className="text-lg font-medium transition-colors duration-200"
                  style={{ color: "var(--color-vt-accent-cyan)" }}
                >
                  contato@vertextarget.com
                </a>
              </div>
              <div>
                <div
                  className="text-xs tracking-wider uppercase mb-1"
                  style={{ color: "var(--color-vt-text-dim)" }}
                >
                  {t.contact.location}
                </div>
                <span
                  className="text-lg"
                  style={{ color: "var(--color-vt-text-muted)" }}
                >
                  {t.contact.locationValue}
                </span>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            <div className="form-field">
              <label
                className="text-xs tracking-wider uppercase block mb-2"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {t.contact.name}
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, name: e.target.value }))
                }
                placeholder={t.contact.namePlaceholder}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-border)";
                }}
              />
            </div>

            <div className="form-field">
              <label
                className="text-xs tracking-wider uppercase block mb-2"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {t.contact.email}
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, email: e.target.value }))
                }
                placeholder={t.contact.emailPlaceholder}
                required
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-border)";
                }}
              />
            </div>

            <div className="form-field">
              <label
                htmlFor="vt-budget"
                className="text-xs tracking-wider uppercase block mb-2"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {t.contact.budget}
              </label>
              <select
                id="vt-budget"
                name="budget"
                value={formState.budget}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, budget: e.target.value }))
                }
                style={{
                  ...inputStyle,
                  appearance: "none" as const,
                  cursor: "pointer",
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-border)";
                }}
              >
                <option value="" style={{ background: "var(--color-vt-bg)" }}>
                  {t.contact.budgetPlaceholder}
                </option>
                {t.contact.budgetOptions.map((label, i) => (
                  <option
                    key={label}
                    value={String(i)}
                    style={{ background: "var(--color-vt-bg)" }}
                  >
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label
                className="text-xs tracking-wider uppercase block mb-2"
                style={{ color: "var(--color-vt-text-dim)" }}
              >
                {t.contact.message}
              </label>
              <textarea
                value={formState.message}
                onChange={(e) =>
                  setFormState((s) => ({ ...s, message: e.target.value }))
                }
                placeholder={t.contact.messagePlaceholder}
                required
                rows={4}
                style={{
                  ...inputStyle,
                  resize: "none" as const,
                }}
                onFocus={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-accent-cyan)";
                }}
                onBlur={(e) => {
                  e.target.style.borderBottomColor = "var(--color-vt-border)";
                }}
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="w-full py-4 rounded-xl text-sm font-medium tracking-wider uppercase transition-all duration-300 disabled:opacity-60"
              style={{
                background:
                  status === "sent"
                    ? "var(--color-vt-success)"
                    : "linear-gradient(135deg, var(--color-vt-accent-cyan), var(--color-vt-accent-violet))",
                color: "var(--color-vt-bg)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === "idle" && t.contact.submit}
              {status === "sending" && t.contact.sending}
              {status === "sent" && t.contact.sent}
              {status === "error" && t.contact.error}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}
