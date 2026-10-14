"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

interface SteppedStage {
  id: string;
  name: string;
  dashed?: boolean;
}

const STAGES: SteppedStage[] = [
  { id: "01", name: "BUSINESS" },
  { id: "02", name: "OPERATIONS" },
  { id: "03", name: "PROBLEM" },
  { id: "04", name: "SYSTEM" },
  { id: "05", name: "TECHNOLOGY", dashed: true },
  { id: "06", name: "GROWTH" },
];

export function CompanyHero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: motion.ease.out },
          delay: 0.1,
        });

        // 1. Badge reveal
        tl.fromTo(
          "[data-animate='company-badge']",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          0,
        );

        // 2. Title mask slide up
        tl.fromTo(
          "[data-animate='company-title']",
          { opacity: 0, yPercent: 100 },
          { opacity: 1, yPercent: 0, duration: 0.7, ease: "power3.out" },
          0.06,
        );

        // 3. Description & CTA
        tl.fromTo(
          "[data-animate='company-desc']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          0.16,
        );

        tl.fromTo(
          "[data-animate='company-btn']",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.24,
        );

        // 4. Stepped Cascade boxes reveal
        tl.fromTo(
          "[data-animate='cascade-box']",
          { opacity: 0, x: 24, scale: 0.98 },
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.45,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.1,
        );

        // 5. Connectors reveal
        tl.fromTo(
          "[data-animate='cascade-connector']",
          { opacity: 0, y: -6 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            stagger: 0.08,
            ease: "power2.out",
          },
          0.16,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", {
          opacity: 1,
          x: 0,
          y: 0,
          yPercent: 0,
          scale: 1,
        });
      });

      return () => mm.revert();
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full pt-12 pb-20 md:pt-20 md:pb-28 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Hero Text */}
        <div className="lg:col-span-6 flex flex-col space-y-8">
          <span
            data-animate="company-badge"
            className="text-xs font-semibold tracking-[3px] uppercase text-brand font-mono opacity-0"
          >
            CITADEL / COMPANY
          </span>

          <div className="overflow-hidden py-1">
            <h1
              data-animate="company-title"
              className="text-4xl sm:text-6xl lg:text-[60px] font-bold text-white tracking-tight uppercase leading-[1.08] opacity-0"
            >
              STRONG SYSTEMS.
              <br />
              SUSTAINABLE GROWTH.
            </h1>
          </div>

          <p
            data-animate="company-desc"
            className="text-base sm:text-lg text-white/70 font-normal leading-relaxed max-w-xl opacity-0"
          >
            We understand the business first, then build technology around how
            it really works.
          </p>

          <div data-animate="company-btn" className="pt-2 opacity-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-6 border border-white/30 hover:border-brand text-white hover:text-brand px-6 py-3.5 rounded-sm font-semibold text-xs tracking-[2px] uppercase transition-colors"
            >
              <span>WORK WITH CITADEL</span>
              <span className="text-sm font-mono">↗</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Cascading Stepped Architecture Diagram */}
        <div className="lg:col-span-6 w-full flex flex-col space-y-1 overflow-x-auto pb-4 pt-2 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {STAGES.map((stage, idx) => {
            const indentRem = idx * 2.5;

            return (
              <div key={stage.id} className="relative flex flex-col">
                <div
                  data-animate="cascade-box"
                  style={{ marginLeft: `${indentRem}rem` }}
                  className={`group relative flex items-center justify-between px-6 py-4 rounded-sm transition-all duration-300  hover:bg-[#0c1422]/50 border opacity-0 ${
                    stage.dashed
                      ? "border-dashed border-white/35 hover:border-brand/70"
                      : "border-solid border-white/20 hover:border-brand/70"
                  } text-white hover:shadow-[0_0_24px_rgba(196,162,84,0.18)] hover:translate-x-1.5 cursor-pointer backdrop-blur-xs overflow-hidden`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0.75 bg-brand scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                  <span className="text-sm sm:text-base font-bold tracking-[2px] uppercase group-hover:text-white transition-colors duration-200">
                    {stage.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-semibold font-mono text-white/50 group-hover:text-brand tracking-[2px] transition-colors duration-200">
                      {stage.id}
                    </span>
                    <span className="text-xs text-brand opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 font-mono">
                      →
                    </span>
                  </div>
                </div>

                {/* Step Connector Line */}
                {idx < STAGES.length - 1 && (
                  <div
                    data-animate="cascade-connector"
                    style={{ marginLeft: `${indentRem + 1.25}rem` }}
                    className="text-white/30 text-sm font-mono py-0.5 opacity-0"
                  >
                    ↓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
