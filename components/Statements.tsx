"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Citadel3DModel } from "./Citadel3DModel";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface StatementSlide {
  id: string;
  phaseNum: number;
  tag: string;
  title: string;
  description: string;
  hasCTA?: boolean;
}

const statements: StatementSlide[] = [
  {
    id: "01",
    phaseNum: 1,
    tag: "01 — FOUNDATION",
    title: "BUSINESS FIRST.",
    description:
      "The foundation of every Citadel solution. We understand how your business operates before writing a single line of code. Technology serves the business model, not the reverse.",
  },
  {
    id: "02",
    phaseNum: 2,
    tag: "02 — UNDERSTANDING",
    title: "UNDERSTAND THE PROBLEM.",
    description:
      "Start with the real operational problem. Distinguish root causes from symptoms. We measure friction in wasted hours, communication breakdowns, and lost margins.",
  },
  {
    id: "03",
    phaseNum: 3,
    tag: "03 — STRUCTURE",
    title: "STRUCTURE THE PROCESS.",
    description:
      "Turn complexity into a clear system. Untangle ad-hoc workflows into resilient, repeatable pipelines that scale cleanly without operational fragility.",
  },
  {
    id: "04",
    phaseNum: 4,
    tag: "04 — SOLUTION",
    title: "DESIGN THE RIGHT SYSTEM.",
    description:
      "Technology follows the business need. Architect custom tools and automation targeted directly at core leverage points, eliminating manual bottlenecks.",
  },
  {
    id: "05",
    phaseNum: 5,
    tag: "05 — EXECUTION",
    title: "BUILD WITH PURPOSE.",
    description:
      "Turn the solution into something that works. Precision execution with clean, secure, maintainable engineering built to carry real mission-critical load.",
  },
  {
    id: "06",
    phaseNum: 6,
    tag: "06 — GROWTH",
    title: "SCALE WHAT WORKS.",
    description:
      "Build systems that can grow with the business. Systems engineered so additional customer volume reinforces efficiency rather than multiplying operational chaos.",
  },
  {
    id: "07",
    phaseNum: 7,
    tag: "07 — IMPACT",
    title: "CREATE LASTING VALUE.",
    description:
      "The goal is sustainable growth, not a temporary fix. Hand over systems your team truly owns with full autonomy, establishing enduring enterprise value.",
  },
  {
    id: "08",
    phaseNum: 8,
    tag: "08 — CITADEL",
    title: "STRONG SYSTEMS.\nSUSTAINABLE GROWTH.",
    description:
      "We solve operational problems with systems built for sustainable growth. We understand operations first. Technology second.",
    hasCTA: true,
  },
];

export function Statements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textCardRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const prevIndexRef = useRef(0);

  // Programmatic slide transition on phase indicator click
  const goToSlide = (targetIndex: number) => {
    const clampedIndex = Math.max(
      0,
      Math.min(statements.length - 1, targetIndex),
    );

    setActiveIndex(clampedIndex);
    activeIndexRef.current = clampedIndex;

    const container = containerRef.current;
    const trigger = triggerRef.current;
    if (!container) return;

    let targetScroll: number;
    if (trigger && trigger.end > trigger.start) {
      const totalDistance = trigger.end - trigger.start;
      targetScroll =
        trigger.start +
        (clampedIndex / (statements.length - 1)) * totalDistance;
    } else {
      const rect = container.getBoundingClientRect();
      const currentScroll = window.scrollY;
      const start = currentScroll + rect.top;
      const totalDistance = container.offsetHeight - window.innerHeight;
      targetScroll =
        start +
        (clampedIndex / (statements.length - 1)) * Math.max(1, totalDistance);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetScroll, {
        duration: 0.75,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  // Synchronize ScrollTrigger across 8 slides naturally
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const totalSlides = statements.length;

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
        fastScrollEnd: true,
        onUpdate: (self) => {
          const clamped = Math.min(0.9999, Math.max(0, self.progress));
          const newIndex = Math.floor(clamped * totalSlides);
          if (newIndex !== activeIndexRef.current) {
            prevIndexRef.current = activeIndexRef.current;
            setActiveIndex(newIndex);
            activeIndexRef.current = newIndex;
          }
        },
      });

      triggerRef.current = trigger;

      return () => {
        trigger.kill();
        triggerRef.current = null;
      };
    },
    { scope: containerRef },
  );

  // Directional, mechanical architectural transition on phase change
  useEffect(() => {
    const direction = activeIndex >= prevIndexRef.current ? 1 : -1;
    prevIndexRef.current = activeIndex;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Mechanical odometer watermark slide
      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { opacity: 0, y: direction * 40 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
          0,
        );
      }

      // Tag reveal
      if (tagRef.current) {
        tl.fromTo(
          tagRef.current,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" },
          0.02,
        );
      }

      // Title reveal
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: direction * 18 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
          0.04,
        );
      }

      // Description reveal
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: direction * 14 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
          0.06,
        );
      }

      // CTA reveal
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          0.08,
        );
      }
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (textCardRef.current) {
        gsap.fromTo(
          textCardRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.2 },
        );
      }
    });

    return () => mm.revert();
  }, [activeIndex]);

  const current = statements[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#05070a] border-b border-white/10"
      style={{ height: `${statements.length * 70}vh` }}
    >
      {/* Sticky Pinned Stage taking full viewport height */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden px-6 sm:px-10 py-8 md:py-12">
        <div className="max-w-[1353px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column Text & Action matching HeroMain */}
          <div className="relative flex flex-col items-start space-y-6 md:space-y-8">
            {/* Ambient Watermark Number */}
            <div
              ref={watermarkRef}
              className="absolute -left-4 sm:-left-8 -top-14 sm:-top-20 text-[120px] sm:text-[180px] font-black font-mono text-white/[0.035] pointer-events-none select-none leading-none -z-10"
              aria-hidden="true"
            >
              {current.id}
            </div>

            {/* 8-Phase Architectural Segment Progress Track & Slide Navigation */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pb-1 select-none">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {statements.map((s, idx) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    aria-label={`Jump to Phase 0${s.phaseNum}`}
                    title={`Phase 0${s.phaseNum}: ${s.title.replace("\n", " ")}`}
                    className={`h-2 transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand ${
                      idx === activeIndex
                        ? "w-8 sm:w-10 bg-brand shadow-[0_0_12px_rgba(196,162,84,0.7)]"
                        : idx < activeIndex
                          ? "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
                          : "w-2.5 sm:w-3 bg-white/10 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[2px] uppercase text-brand/90 font-semibold">
                PHASE 0{activeIndex + 1} / 08
              </span>
            </div>

            <div
              ref={textCardRef}
              className="flex flex-col items-start space-y-5 md:space-y-7"
            >
              <div className="flex items-center gap-3">
                <span
                  ref={tagRef}
                  className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
                >
                  {current.tag}
                </span>
              </div>

              <h2
                ref={titleRef}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-white uppercase leading-[1.05] whitespace-pre-line"
              >
                {current.title}
              </h2>

              <p
                ref={descRef}
                className="text-base sm:text-xl text-white/60 font-normal leading-relaxed max-w-xl"
              >
                {current.description}
              </p>

              {current.hasCTA && (
                <div
                  ref={ctaRef}
                  className="pt-2 animate-in fade-in duration-300"
                >
                  <Link
                    href="#schedule"
                    className="inline-flex items-center gap-3 border border-white/80 hover:border-brand hover:text-brand px-7 py-4 text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white transition-all group"
                  >
                    <span>START A CONVERSATION</span>
                    <span className="text-base leading-none transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column 3D Artwork matching HeroMain */}
          <div className="w-full flex items-center justify-center">
            <Citadel3DModel
              key="pinned-citadel-model"
              phase={current.phaseNum}
              interactive={true}
              lockRotation={false}
              showControls={false}
              borderless={true}
              enablePhaseHover={false}
              enablePhaseClick={false}
              lockRotationX={true}
              lockRotationY={false}
              spinOnPhase8={true}
              heightClass="h-[420px] sm:h-[500px] lg:h-[560px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
