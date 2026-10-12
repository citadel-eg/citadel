"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface LayerItem {
  id: string;
  name: string;
  description: string;
  minHeightClass: string;
  activeSteps: number; // 1 to 5 for the mini indicator bar
}

const layers: LayerItem[] = [
  {
    id: "01",
    name: "DISCOVER",
    description: "Understand the operational problem.",
    minHeightClass: "min-h-[280px] lg:mt-[340px]",
    activeSteps: 1,
  },
  {
    id: "02",
    name: "ARCHITECT",
    description: "Design the system structure.",
    minHeightClass: "min-h-[360px] lg:mt-[255px]",
    activeSteps: 2,
  },
  {
    id: "03",
    name: "BUILD",
    description: "Develop and test the solution.",
    minHeightClass: "min-h-[450px] lg:mt-[170px]",
    activeSteps: 3,
  },
  {
    id: "04",
    name: "DEPLOY",
    description: "Implement and transfer ownership.",
    minHeightClass: "min-h-[530px] lg:mt-[85px]",
    activeSteps: 4,
  },
  {
    id: "05",
    name: "SUPPORT",
    description: "Long-term partnership and evolution.",
    minHeightClass: "min-h-[620px] lg:mt-0",
    activeSteps: 5,
  },
];

export function ApproachSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const columns = gsap.utils.toArray<HTMLElement>(
        "[data-animate='layer-column']",
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Set initial hidden states immediately to guarantee clean initial load
        gsap.set(columns, {
          opacity: 0,
          y: 24,
          scale: 0.98,
        });
        gsap.set("[data-animate='layer-icon']", {
          opacity: 0,
          scale: 0.75,
          rotate: -6,
        });
        gsap.set("[data-animate='step-segment']", {
          scaleX: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        });

        // 1. Header marker: crisp snap in
        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0,
        );
        tl.fromTo(
          "[data-animate='header-line']",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.28,
            ease: "power2.out",
          },
          0.02,
        );
        tl.fromTo(
          "[data-animate='header-title']",
          { opacity: 0, x: 10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0.04,
        );

        // 2. Headline & Philosophy quote
        tl.fromTo(
          "[data-animate='headline']",
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.38,
            ease: "power3.out",
          },
          0.04,
        );
        tl.fromTo(
          "[data-animate='quote-box']",
          { opacity: 0, x: 14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0.08,
        );

        // 3. Ascending Columns: snappy cascade rising from left to right
        if (columns.length) {
          tl.to(
            columns,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.42,
              ease: "power3.out",
              stagger: 0.07,
            },
            0.08,
          );
        }

        // 4. Layer internal micro-details (icons & indicator bars)
        tl.to(
          "[data-animate='layer-icon']",
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.3,
            ease: "power3.out",
            stagger: 0.06,
          },
          0.16,
        );

        tl.to(
          "[data-animate='step-segment']",
          {
            scaleX: 1,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.03,
          },
          0.18,
        );

      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          "[data-animate]",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.25,
            stagger: 0.03,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              once: true,
              fastScrollEnd: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16 relative">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            05
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            OUR APPROACH
          </span>
        </div>

        {/* Section Title and Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between">
          <div className="lg:col-span-8">
            <h2
              data-animate="headline"
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-[1.08] tracking-tight"
            >
              <span className="block">FIVE LAYERS.</span> EACH ONE EARNS THE
              NEXT.
            </h2>
          </div>
          <div
            data-animate="quote-box"
            className="lg:col-span-4 border-l border-white pl-3 py-2"
          >
            <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
              A disciplined sequence. No layer is built until the one beneath it
              can carry the weight.
            </p>
          </div>
        </div>

        {/* 5 Ascending Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-0 lg:items-end">
          {layers.map((layer) => (
            <div
              key={layer.id}
              data-animate="layer-column"
              className={`group relative flex flex-col justify-between p-7 border border-white lg:border-r-0 lg:last:border-r hover:border-brand/70 bg-[#080d16] hover:bg-[#0c1422] transition-all duration-300 ${layer.minHeightClass} hover:shadow-[0_0_30px_rgba(196,162,84,0.14)] hover:z-10 cursor-default overflow-hidden opacity-0`}
            >
              {/* Top ambient gold indicator hairline on hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              {/* Ambient bottom glow sheen on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Top: Number & Stair Icon */}
              <div className="relative flex items-start justify-between">
                <span className="text-3xl sm:text-4xl font-extrabold text-white group-hover:text-brand font-mono tracking-tight transition-colors duration-200">
                  {layer.id}
                </span>
                <div
                  data-animate="layer-icon"
                  className="transition-all duration-300 group-hover:scale-110 group-hover:text-brand text-white/50"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 20h4v-4h4v-4h4v-4h4" />
                  </svg>
                </div>
              </div>

              {/* Bottom: Progress bars + Title + Description */}
              <div className="relative flex flex-col space-y-2 pt-10">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight group-hover:text-white transition-colors duration-200">
                  {layer.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 font-normal leading-relaxed group-hover:text-white/80 transition-colors duration-200">
                  {layer.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
