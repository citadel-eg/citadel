"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface ServiceRow {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const services: ServiceRow[] = [
  {
    id: "01",
    title: "AUTOMATION",
    description: "Business systems that reduce repetitive operational work.",
    tags: ["WORKFLOW AUTOMATION", "INTEGRATIONS", "DOCUMENT FLOWS"],
  },
  {
    id: "02",
    title: "OPERATIONS",
    description:
      "Systems that bring structure, visibility and control to business processes.",
    tags: ["INTERNAL PLATFORMS", "DASHBOARDS", "PROCESS CONTROL"],
  },
  {
    id: "03",
    title: "PRODUCTS",
    description:
      "Digital products that emerge from real, repeated business needs.",
    tags: ["PRODUCT STRATEGY", "PLATFORM BUILD", "RECURRING VALUE"],
  },
];

export function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-animate='service-row']");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(rows, { opacity: 0, y: 20 });

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

        // 2. Service rows stagger in
        if (rows.length) {
          tl.to(
            rows,
            {
              opacity: 1,
              y: 0,
              duration: 0.42,
              ease: "power3.out",
              stagger: 0.08,
            },
            0.08,
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
      id="services"
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1353px] mx-auto space-y-12">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            04
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            WHAT WE BUILD
          </span>
        </div>

        {/* Big Rows List */}
        <div className="divide-y divide-white/15 border-y border-white/15">
          {services.map((item) => (
            <Link
              key={item.id}
              href="#schedule"
              data-animate="service-row"
              className="group block py-10 md:py-14 transition-colors duration-300 hover:bg-white/2 opacity-0"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center justify-between">
                {/* Big Title */}
                <div className="lg:col-span-6">
                  <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-bold text-white tracking-tight leading-none group-hover:text-brand transition-colors duration-300">
                    {item.title}
                  </h3>
                </div>

                {/* Description & Tags */}
                <div className="lg:col-span-5 flex flex-col space-y-4">
                  <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] sm:text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="hover:text-white/80 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="lg:col-span-1 flex justify-end">
                  <span className="text-2xl text-white/40 group-hover:text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300">
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
