"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export function ContactHero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: motion.ease.out },
          delay: 0.1,
        });

        tl.fromTo(
          "[data-animate='contact-badge']",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          0,
        );

        tl.fromTo(
          "[data-animate='contact-title']",
          { opacity: 0, yPercent: 100 },
          { opacity: 1, yPercent: 0, duration: 0.7, ease: "power3.out" },
          0.06,
        );

        tl.fromTo(
          "[data-animate='contact-copy']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.16,
        );

        tl.fromTo(
          "[data-animate='contact-btn']",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.24,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, y: 0, yPercent: 0 });
      });

      return () => mm.revert();
    },
    { scope: heroRef },
  );

  const scrollToForm = () => {
    const el = document.getElementById("booking-container");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 px-6 sm:px-10 md:px-20 text-center flex flex-col items-center border-b border-white/10"
    >
      <div className="max-w-5xl flex flex-col items-center space-y-6 md:space-y-8">
        <span
          data-animate="contact-badge"
          className="text-xs font-semibold tracking-[3px] uppercase text-brand font-mono opacity-0"
        >
          CITADEL / CONTACT
        </span>

        <div className="overflow-hidden py-1">
          <h1
            data-animate="contact-title"
            className="text-3xl sm:text-5xl lg:text-[60px] text-balnce font-bold text-white tracking-tight uppercase leading-[1.12] opacity-0"
          >
            A CLEAR PROJECT STARTS
            <br />
            WITH A CLEAR CONVERSATION.
          </h1>
        </div>

        <p
          data-animate="contact-copy"
          className="text-base sm:text-lg text-white/70 font-normal leading-relaxed max-w-4xl opacity-0"
        >
          Tell us what is slowing the business down. We will start by
          understanding how it works today.
        </p>

        <div data-animate="contact-btn" className="pt-2 opacity-0">
          <button
            onClick={scrollToForm}
            className="inline-flex items-center gap-6 border border-white/30 hover:border-brand text-white hover:text-brand px-6 py-3.5 rounded-sm font-semibold text-xs tracking-[2px] uppercase transition-colors"
          >
            <span>SHARE A PROJECT BRIEF</span>
            <span className="text-sm font-mono">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
