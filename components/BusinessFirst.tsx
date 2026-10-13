"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

interface StepItem {
  id: string;
  name: string;
}

const steps: StepItem[] = [
  { id: "01", name: "BUSINESS" },
  { id: "02", name: "OPERATIONS" },
  { id: "03", name: "PROBLEM" },
  { id: "04", name: "SYSTEM" },
  { id: "05", name: "TECHNOLOGY" },
  { id: "06", name: "GROWTH" },
];

export function BusinessFirst() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-animate='step-item']",
      );
      const connectors = gsap.utils.toArray<HTMLElement>(
        "[data-animate='step-connector']",
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        // 1. Header marker reveal: number, expanding accent line, title
        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -16 },
          { opacity: 1, x: 0, duration: motion.duration.base, ease: motion.ease.out },
          0,
        );
        tl.fromTo(
          "[data-animate='header-line']",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.35, ease: motion.ease.out },
          0.04,
        );
        tl.fromTo(
          "[data-animate='header-title']",
          { opacity: 0, x: 12 },
          { opacity: 1, x: 0, duration: motion.duration.base, ease: motion.ease.out },
          0.08,
        );

        // 2. Left column headline & paragraph
        tl.fromTo(
          "[data-animate='headline']",
          { opacity: 0, y: motion.distance },
          { opacity: 1, y: 0, duration: 0.55, ease: motion.ease.emphasis },
          0.1,
        );
        tl.fromTo(
          "[data-animate='paragraph']",
          { opacity: 0, y: motion.distanceSm },
          { opacity: 1, y: 0, duration: motion.duration.base, ease: motion.ease.out },
          0.18,
        );

        // 3. Right column cascading staircase items
        if (items.length) {
          tl.fromTo(
            items,
            {
              opacity: 0,
              x: 28,
              y: 14,
              scale: 0.98,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.45,
              ease: motion.ease.out,
              stagger: 0.08,
            },
            0.18,
          );
        }

        // 4. Downward arrow connectors reveal in synchronization
        if (connectors.length) {
          tl.fromTo(
            connectors,
            {
              opacity: 0,
              scaleY: 0,
            },
            {
              opacity: 1,
              scaleY: 1,
              duration: 0.3,
              ease: motion.ease.out,
              stagger: 0.08,
            },
            0.24,
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          "[data-animate]",
          { opacity: 0 },
          {
            opacity: 1,
            duration: motion.duration.fast,
            stagger: motion.staggerFast,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: motion.scrollStart,
              toggleActions: "play reverse play reverse",
            },
          },
        );
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );


  return (
    <section
      ref={sectionRef}
      id="company"
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10"
    >
      <div className="max-w-[1353px] mx-auto space-y-12">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            02
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            BUSINESS FIRST
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Mission statement */}
          <div className="flex flex-col space-y-6">
            <h2
              data-animate="headline"
              className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-white uppercase leading-[1.2] tracking-tight"
            >
              WE UNDERSTAND HOW A BUSINESS WORKS BEFORE WE WRITE A SINGLE LINE
              OF CODE.
            </h2>
            <div
              data-animate="paragraph"
              className="relative pl-4 border-l border-brand/50"
            >
              <p className="text-base text-white/70 font-normal leading-relaxed max-w-2xl">
                The best technology starts with better questions. How do your
                people work? Where does value get lost? What is holding the next
                stage back?
              </p>
            </div>
          </div>

          {/* Right Column: Cascading Stepped Structure */}
          <div
            ref={listRef}
            className="w-full flex flex-col space-y-1 overflow-x-auto pb-4 pt-2 pr-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {steps.map((step, index) => {
              // Indentation steps progressively to the right
              const indentRem = index * 3.2; // Progressive indent

              return (
                <div
                  key={step.id}
                  data-animate="step-item"
                  className="relative flex flex-col"
                >
                  {/* Stepped Box with High-End Interactive Hover */}
                  <div
                    style={{ marginLeft: `${indentRem}rem` }}
                    className="group relative flex items-center justify-between px-6 py-4.5 rounded-sm transition-all duration-300 bg-[#080d16]/90 hover:bg-[#0c1422] border border-white/15 hover:border-brand/70 text-white hover:shadow-[0_0_24px_rgba(196,162,84,0.18)] hover:translate-x-1.5 cursor-pointer backdrop-blur-xs overflow-hidden"
                  >
                    {/* Ambient gold edge highlight that activates on hover */}
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-brand scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                    <span className="text-sm sm:text-base font-semibold tracking-[2px] uppercase group-hover:text-white transition-colors duration-200">
                      {step.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-mono text-white/50 group-hover:text-brand tracking-wider transition-colors duration-200">
                        {step.id}
                      </span>
                      <span className="text-xs text-brand opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 font-mono">
                        →
                      </span>
                    </div>
                  </div>

                  {/* Down Arrow connector between steps */}
                  {index < steps.length - 1 && (
                    <div
                      data-animate="step-connector"
                      style={{ marginLeft: `${indentRem + 1.25}rem` }}
                      className="text-white/40 text-lg font-mono transition-colors duration-200 py-0.5 origin-top"
                    >
                      ↓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
