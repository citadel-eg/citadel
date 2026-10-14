"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { usePageTransition } from "@/components/PageTransition";

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

export interface WhatWeBuildProps {
  id?: string;
  badge?: string;
  sectionNumber?: string;
  title?: string;
  linkHref?: string;
  className?: string;
}

export function WhatWeBuild({
  id = "services",
  badge,
  sectionNumber = "04",
  title = "WHAT WE BUILD",
  linkHref = "/contact",
  className = "py-16 md:py-24",
}: WhatWeBuildProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const { isTransitioning } = usePageTransition();
  const isHero = Boolean(badge);

  useGSAP(
    () => {
      const q = gsap.utils.selector(sectionRef);
      const rows = q("[data-animate='service-row']");
      const titles = q("[data-animate='service-title']");
      const descs = q("[data-animate='service-desc']");
      const arrows = q("[data-animate='service-arrow']");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: isHero
            ? undefined
            : {
                trigger: sectionRef.current,
                start: "top 85%",
                toggleActions: "play reverse play reverse",
              },
          defaults: { ease: "power2.out" },
          delay: isHero ? 0.05 : 0,
        });

        // 1. Header marker or badge
        tl.fromTo(
          q("[data-animate='header-num']"),
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            clearProps: "opacity,transform",
          },
          0,
        );

        if (!badge) {
          tl.fromTo(
            q("[data-animate='header-line']"),
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.28,
              ease: "power2.out",
              clearProps: "transform",
            },
            0.02,
          );
          tl.fromTo(
            q("[data-animate='header-title']"),
            { opacity: 0, x: 10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.25,
              ease: "power2.out",
              clearProps: "opacity,transform",
            },
            0.04,
          );
        }

        // 2. Service rows reveal: fade container, slide masked title, reveal description and arrow
        tl.fromTo(
          rows,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.45,
            stagger: 0.1,
            clearProps: "opacity",
          },
          0.06,
        );

        tl.fromTo(
          titles,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.65,
            ease: "power3.out",
            stagger: 0.1,
            clearProps: "transform",
          },
          0.08,
        );

        tl.fromTo(
          descs,
          { opacity: 0, x: 16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "opacity,transform",
          },
          0.16,
        );

        tl.fromTo(
          arrows,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.1,
            clearProps: "opacity,transform",
          },
          0.2,
        );

        tl.eventCallback("onComplete", () => {
          gsap.set(titles, { yPercent: 0, clearProps: "transform" });
          gsap.set(rows, { opacity: 1, clearProps: "opacity" });
          gsap.set(descs, {
            opacity: 1,
            x: 0,
            clearProps: "opacity,transform",
          });
          gsap.set(arrows, {
            opacity: 1,
            scale: 1,
            clearProps: "opacity,transform",
          });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(q("[data-animate]"), {
          opacity: 1,
          x: 0,
          y: 0,
          clearProps: "all",
        });
        gsap.set(titles, { yPercent: 0, clearProps: "transform" });
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  // Guard for page transitions: when arriving on /services, ensure titles are revealed when transition ends
  useEffect(() => {
    if (isHero && !isTransitioning) {
      const q = gsap.utils.selector(sectionRef);
      const titles = q("[data-animate='service-title']");
      if (titles.length > 0) {
        gsap.to(titles, {
          yPercent: 0,
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "transform",
          overwrite: "auto",
        });
      }
    }
  }, [isHero, isTransitioning]);

  // Tab visibility / focus failsafe
  useEffect(() => {
    const handleVis = () => {
      if (document.visibilityState === "visible" && isHero) {
        const q = gsap.utils.selector(sectionRef);
        const titles = q("[data-animate='service-title']");
        if (titles.length > 0) {
          gsap.set(titles, { yPercent: 0, clearProps: "transform" });
        }
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, [isHero]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative w-full px-6 sm:px-10 md:px-20 bg-[#05070a] border-b border-white/10 overflow-hidden ${className}`}
    >
      <div className="space-y-12">
        {/* Section Header Marker or Badge */}
        {badge ? (
          <span
            data-animate="header-num"
            className="text-xs font-semibold tracking-[3px] uppercase text-brand font-mono block"
          >
            {badge}
          </span>
        ) : (
          <div data-animate="header-marker" className="flex items-center gap-4">
            <span
              data-animate="header-num"
              className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
            >
              {sectionNumber}
            </span>
            <span
              data-animate="header-line"
              className="w-10 h-px bg-white/30 origin-left"
            />
            <span
              data-animate="header-title"
              className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
            >
              {title}
            </span>
          </div>
        )}

        {/* Big Rows List */}
        <div className="divide-y divide-white/15 border-y border-white/15">
          {services.map((item, i) => (
            <Link
              key={item.id}
              href={linkHref}
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
