"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function CaseStudy() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const breakdownSteps = gsap.utils.toArray<HTMLElement>(
        "[data-animate='case-step']",
      );
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-animate='case-mockup']", {
          opacity: 0,
          y: 24,
          scale: 0.98,
        });
        gsap.set(breakdownSteps, { opacity: 0, x: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        });

        // 1. Header marker
        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          0,
        );
        tl.fromTo(
          "[data-animate='header-line']",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.28, ease: "power2.out" },
          0.02,
        );
        tl.fromTo(
          "[data-animate='header-title']",
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          0.04,
        );

        // 2. Heading
        tl.fromTo(
          "[data-animate='headline']",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
          0.04,
        );

        // 3. Mockup Image Showcase
        tl.to(
          "[data-animate='case-mockup']",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
          },
          0.08,
        );

        // 4. Breakdown title
        tl.fromTo(
          "[data-animate='case-title']",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
          0.12,
        );

        // 5. Breakdown Steps
        if (breakdownSteps.length) {
          tl.to(
            breakdownSteps,
            {
              opacity: 1,
              x: 0,
              duration: 0.35,
              ease: "power2.out",
              stagger: 0.08,
            },
            0.18,
          );
        }
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
      id="work"
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            07
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            CASE STUDIES
          </span>
        </div>

        {/* Section Heading */}
        <div>
          <h2
            data-animate="headline"
            className="text-3xl sm:text-5xl lg:text-[62px] font-bold text-white tracking-tight leading-none uppercase"
          >
            PROBLEM → SYSTEM → RESULT.
          </h2>
        </div>

        {/* Case Study Feature Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Visual Mockup Showcase */}
          <div
            data-animate="case-mockup"
            className="lg:col-span-6 relative rounded-md border border-white/15 overflow-hidden bg-[#070b12] group opacity-0 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <div className="relative aspect-4/3 sm:aspect-16/11 w-full overflow-hidden">
              <Image
                src="/galaxy-store.png"
                alt="Galaxy Store Case Study - Dashboard and website preview"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/20 pointer-events-none" />
            </div>

            {/* Badge overlay top left */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-sm">
              <span className="text-[10px] sm:text-xs font-semibold text-white tracking-wider">
                01 — Galaxy Store / Dashboard &amp; website
              </span>
            </div>
          </div>

          {/* Right Column: Breakdown */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 lg:pl-6">
            <h3
              data-animate="case-title"
              className="text-2xl sm:text-4xl font-bold text-white leading-tight capitalize"
            >
              A Storefront . An Operation , A Human Connection
            </h3>

            {/* Stepped breakdown rows */}
            <div className="space-y-6 pt-4">
              {/* 01 / PROBLEM */}
              <div
                data-animate="case-step"
                className="border-t border-white/20 pt-4 space-y-1.5 opacity-0"
              >
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white font-mono">
                  01 / PROBLEM
                </span>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  Dispatch ran through 14 shared spreadsheets and phone calls.
                </p>
              </div>

              {/* 02 / SYSTEM */}
              <div
                data-animate="case-step"
                className="border-t border-white/20 pt-4 ml-6 sm:ml-10 space-y-1.5 opacity-0"
              >
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white font-mono">
                  02 / SYSTEM
                </span>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  Customer website + internal dashboard.
                </p>
              </div>

              {/* 03 / RESULT */}
              <div
                data-animate="case-step"
                className="border-t border-white/20 pt-4 ml-12 sm:ml-20 space-y-1.5 opacity-0"
              >
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white font-mono">
                  03 / RESULT
                </span>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  Course-commerce &amp; operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
