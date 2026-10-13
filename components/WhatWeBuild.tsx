"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";

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

const ROW_INDENT_CLASSES = ["lg:ml-1", "lg:ml-4 xl:ml-7", "lg:ml-8 xl:ml-14"];

export function WhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(
        "[data-animate='service-row']",
      );
      const titles = gsap.utils.toArray<HTMLElement>(
        "[data-animate='service-title']",
      );
      const descs = gsap.utils.toArray<HTMLElement>(
        "[data-animate='service-desc']",
      );
      const arrows = gsap.utils.toArray<HTMLElement>(
        "[data-animate='service-arrow']",
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(rows, { opacity: 0 });
        gsap.set(titles, { yPercent: 110 });
        gsap.set(descs, { opacity: 0, x: 16 });
        gsap.set(arrows, { opacity: 0, scale: 0.8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
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

        // 2. Service rows reveal: fade container, slide masked title, reveal description and arrow
        tl.to(
          rows,
          {
            opacity: 1,
            duration: 0.35,
            stagger: 0.1,
          },
          0.08,
        );

        tl.to(
          titles,
          {
            yPercent: 0,
            duration: 0.55,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.1,
        );

        tl.to(
          descs,
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.16,
        );

        tl.to(
          arrows,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.1,
          },
          0.2,
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
          {services.map((item, i) => (
            <Link
              key={item.id}
              href="#schedule"
              data-animate="service-row"
              className="group block py-10 md:py-14 transition-colors duration-300 hover:bg-white/2 pr-4"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center justify-between ${ROW_INDENT_CLASSES[i] ?? ""}`}
              >
                {/* Big Title with overflow mask */}
                <div className="lg:col-span-6 overflow-hidden py-1">
                  <h3
                    data-animate="service-title"
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-[78px] font-bold text-white tracking-tight leading-none group-hover:text-brand transition-colors duration-300 will-change-transform"
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Description & Tags */}
                <div
                  data-animate="service-desc"
                  className="lg:col-span-5 flex flex-col space-y-4"
                >
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
                <div
                  data-animate="service-arrow"
                  className="lg:col-span-1 flex justify-end"
                >
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
