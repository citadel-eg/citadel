"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Citadel3DModel } from "./Citadel3DModel";
import Particles from "./Particles";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import { useIntro } from "@/lib/intro-context";

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

export function HeroStatements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerContainerRef = useRef<HTMLDivElement>(null);
  const heroHeaderRef = useRef<HTMLDivElement>(null);
  const statementsTextRef = useRef<HTMLDivElement>(null);
  const textCardRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const modelTransitionRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeModelPhase, setActiveModelPhase] = useState<number | "all">(
    "all",
  );
  const [isHero, setIsHero] = useState(true);

  const { isIntroActive, reportModelReady, registerHeroEntrance } = useIntro();

  // Watch isIntroActive and tab visibility so hero entrance is guaranteed to play
  useEffect(() => {
    if (!isIntroActive && entranceTlRef.current) {
      entranceTlRef.current.progress(1);
    }
  }, [isIntroActive]);

  useEffect(() => {
    const handleVis = () => {
      if (
        document.visibilityState === "visible" &&
        !isIntroActive &&
        entranceTlRef.current
      ) {
        if (
          entranceTlRef.current.progress() < 1 &&
          entranceTlRef.current.paused()
        ) {
          entranceTlRef.current.play();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, [isIntroActive]);

  const activeSlideIndexRef = useRef(0);
  const prevSlideIndexRef = useRef(0);
  const activePhaseRef = useRef<number | "all">("all");

  // Programmatic slide transition on phase indicator click
  const goToSlide = (targetIndex: number) => {
    const clampedIndex = Math.max(
      0,
      Math.min(statements.length - 1, targetIndex),
    );
    const container = containerRef.current;
    const trigger = triggerRef.current;
    if (!container || !trigger) return;

    const totalDistance = trigger.end - trigger.start;
    // Statements zone starts at progress 0.12 and spans across 0.88
    const progress = 0.12 + ((clampedIndex + 0.5) / statements.length) * 0.88;
    const targetScroll = trigger.start + progress * totalDistance;

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

  // Synchronize ScrollTrigger and scrubbed timeline across Hero + 8 Statements
  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const mm = gsap.matchMedia();
      let onRefreshHandler: (() => void) | null = null;

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Initial Hero Entrance Animation
        const entranceTl = gsap.timeline({
          paused: isIntroActive,
          defaults: { ease: motion.ease.emphasis },
        });
        entranceTlRef.current = entranceTl;

        // Background starry particles fade in
        if (particlesRef.current) {
          entranceTl.fromTo(
            particlesRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 1.2, ease: "power2.out" },
            0,
          );
        }

        // Subtitle tag ("CITADEL / SMART SOLUTIONS")
        entranceTl.fromTo(
          "[data-animate='hero-tag']",
          { opacity: 0, y: -14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          0.05,
        );

        // Headline lines slide up boldly through their overflow masks
        entranceTl.fromTo(
          "[data-animate='hero-line']",
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
          },
          0.12,
        );

        // 3D Citadel Model reveals in the hero center
        entranceTl.fromTo(
          "[data-animate='hero-model']",
          { opacity: 0, scale: 0.88, y: 35 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
          },
          0.22,
        );

        registerHeroEntrance(() => {
          if (entranceTl.progress() === 0) {
            entranceTl.play();
          } else if (entranceTl.paused()) {
            entranceTl.play();
          }
        });

        if (!isIntroActive) {
          entranceTl.progress(1);
          gsap.set("[data-animate='hero-line']", {
            yPercent: 0,
            opacity: 1,
            clearProps: "opacity,transform",
          });
          gsap.set("[data-animate='hero-tag']", {
            y: 0,
            opacity: 1,
            clearProps: "opacity,transform",
          });
          gsap.set("[data-animate='hero-model']", {
            opacity: 1,
            scale: 1,
            y: 0,
            clearProps: "opacity",
          });
          if (heroHeaderRef.current) {
            gsap.set(heroHeaderRef.current, {
              opacity: 1,
              y: 0,
              clearProps: "opacity",
            });
          }
        }

        // Helper to compute exact pixel offset to center the 3D model and position it below the hero headline
        const getHeroOffset = () => {
          if (typeof window === "undefined") return { x: 0, y: 100 };
          const modelEl = modelTransitionRef.current;
          const containerEl = innerContainerRef.current;
          const headerEl = heroHeaderRef.current;
          if (!modelEl || !containerEl) return { x: 0, y: 100 };

          const containerRect = containerEl.getBoundingClientRect();
          const modelRect = modelEl.getBoundingClientRect();

          const currentX = Number(gsap.getProperty(modelEl, "x")) || 0;
          const currentY = Number(gsap.getProperty(modelEl, "y")) || 0;

          // 1. Center horizontally in Hero view
          const isDesktop = window.innerWidth >= 1024;
          let targetX = 0;
          if (isDesktop) {
            const naturalModelCenterX =
              modelRect.left + modelRect.width / 2 - currentX;
            const containerCenterX =
              containerRect.left + containerRect.width / 2;
            targetX = containerCenterX - naturalModelCenterX;
          }

          // 2. Position vertically centered in the space below the hero headline
          let targetY = 70;
          if (headerEl) {
            const headerRect = headerEl.getBoundingClientRect();
            const naturalModelCenterY =
              modelRect.top + modelRect.height / 2 - currentY;
            const containerBottom = containerRect.bottom;
            // Center the model in the available vertical space below the headline
            const availableSpaceCenterY =
              (headerRect.bottom + containerBottom) / 2;
            targetY = availableSpaceCenterY - naturalModelCenterY;
          }

          return { x: targetX, y: targetY };
        };

        // Initialize model at hero offset and full scale immediately
        const initialOffset = getHeroOffset();
        gsap.set(modelTransitionRef.current, {
          x: initialOffset.x,
          y: initialOffset.y,
          scale: 0.8,
          transformOrigin: "center center",
        });

        onRefreshHandler = () => {
          if (activePhaseRef.current === "all" && modelTransitionRef.current) {
            const offset = getHeroOffset();
            gsap.set(modelTransitionRef.current, { x: offset.x, y: offset.y });
          }
        };
        ScrollTrigger.addEventListener("refresh", onRefreshHandler);

        const heroDuration = 0.12;

        // 2. Master Scrub Timeline: Drives seamless transition from Hero into Statements
        const masterTl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.15,
            fastScrollEnd: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;

              if (p < 0.06) {
                // Return to Hero view
                if (activePhaseRef.current !== "all") {
                  activePhaseRef.current = "all";
                  setActiveModelPhase("all");
                  setIsHero(true);
                }
                if (heroHeaderRef.current) {
                  gsap.set(heroHeaderRef.current, { opacity: 1, y: 0 });
                }
              } else {
                // Inside Statements view
                const pStm = Math.min(
                  0.9999,
                  Math.max(0, (p - heroDuration) / (1 - heroDuration)),
                );
                const newSlideIdx = Math.floor(pStm * statements.length);
                const newPhase = (newSlideIdx + 1) as
                  | 1
                  | 2
                  | 3
                  | 4
                  | 5
                  | 6
                  | 7
                  | 8;

                if (activePhaseRef.current !== newPhase) {
                  prevSlideIndexRef.current = activeSlideIndexRef.current;
                  activeSlideIndexRef.current = newSlideIdx;
                  activePhaseRef.current = newPhase;
                  setActiveModelPhase(newPhase);
                  setActiveSlideIndex(newSlideIdx);
                  setIsHero(false);
                }
              }
            },
          },
        });

        triggerRef.current = masterTl.scrollTrigger || null;

        // Scrub Hero header out
        if (heroHeaderRef.current) {
          masterTl.fromTo(
            heroHeaderRef.current,
            { opacity: 1, y: 0 },
            {
              opacity: 0,
              y: -45,
              ease: "power2.inOut",
              duration: heroDuration,
            },
            0,
          );
        }

        // Scrub single 3D model: starts proud in Hero (0.88), glides & expands to full old statement size (1.05)
        if (modelTransitionRef.current) {
          masterTl.fromTo(
            modelTransitionRef.current,
            {
              x: () => getHeroOffset().x,
              y: () => getHeroOffset().y,
              scale: 0.8,
            },
            {
              x: 0,
              y: 0,
              scale: 1.1,
              ease: "power2.inOut",
              duration: heroDuration,
            },
            0,
          );
        }

        // Scrub Statements left column in
        if (statementsTextRef.current) {
          masterTl.fromTo(
            statementsTextRef.current,
            { opacity: 0, x: -28 },
            { opacity: 1, x: 0, ease: "power2.inOut", duration: heroDuration },
            0,
          );
        }

        // Subtly dim background particles during statements to spotlight architectural model
        if (particlesRef.current) {
          masterTl.fromTo(
            particlesRef.current,
            { opacity: 1 },
            { opacity: 0.22, ease: "power2.inOut", duration: heroDuration },
            0,
          );
        }

        // Watermark reveal
        if (watermarkRef.current) {
          masterTl.fromTo(
            watermarkRef.current,
            { opacity: 0 },
            { opacity: 1, ease: "power2.inOut", duration: heroDuration },
            0,
          );
        }

        // Extend timeline across statement scroll zone
        masterTl.to({}, { duration: 1 - heroDuration });

        return () => {
          if (onRefreshHandler) {
            ScrollTrigger.removeEventListener("refresh", onRefreshHandler);
          }
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Simplified non-transform fallback for users who prefer reduced motion
        const trigger = ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.12) {
              setActiveModelPhase("all");
              setIsHero(true);
            } else {
              const pStm = Math.min(0.9999, Math.max(0, (p - 0.12) / 0.88));
              const newSlideIdx = Math.floor(pStm * statements.length);
              setActiveSlideIndex(newSlideIdx);
              setActiveModelPhase(newSlideIdx + 1);
              setIsHero(false);
            }
          },
        });
        triggerRef.current = trigger;
      });

      return () => {
        if (onRefreshHandler) {
          ScrollTrigger.removeEventListener("refresh", onRefreshHandler);
          onRefreshHandler = null;
        }
        mm.revert();
        triggerRef.current = null;
      };
    },
    { scope: containerRef },
  );

  // Directional text reveal when navigating between statement slides
  useEffect(() => {
    if (isHero) return;

    const direction = activeSlideIndex >= prevSlideIndexRef.current ? 1 : -1;
    prevSlideIndexRef.current = activeSlideIndex;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (watermarkRef.current) {
        tl.fromTo(
          watermarkRef.current,
          { opacity: 0, y: direction * 40 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
          0,
        );
      }

      if (tagRef.current) {
        tl.fromTo(
          tagRef.current,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.28, ease: "power2.out" },
          0.02,
        );
      }

      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: direction * 18 },
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
          0.04,
        );
      }

      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: direction * 14 },
          { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" },
          0.06,
        );
      }

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
  }, [activeSlideIndex, isHero]);

  const currentStatement = statements[activeSlideIndex];

  return (
    <section
      ref={containerRef}
      id="hero-journey"
      className="relative w-full bg-[#05070a] border-b border-white/10"
      style={{ height: `${100 + statements.length * 70}vh` }}
    >
      {/* Sticky Stage pinned across entire Hero + 8-Phase Architectural Journey */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden px-6 sm:px-10 md:px-20 pt-20 pb-6 sm:pb-8">
        {/* Background Particles: full starry ambience in Hero, gently dimmed in Statements */}
        <div
          ref={particlesRef}
          className="absolute inset-0 pointer-events-none z-0 overflow-hidden will-change-transform"
          aria-hidden="true"
        >
          <Particles
            particleColors={["#ffffff", "#d8e4ff", "#94a3b8"]}
            particleCount={420}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={120}
            glow={0.9}
            twinkle={0.7}
            moveParticlesOnHover={false}
            hoverEffect="parallax"
            shape="sparkle"
          />
        </div>
        <div
          ref={innerContainerRef}
          className="w-full h-full relative flex items-center justify-center"
        >
          {/* Hero Billboard Header Layer (Active at scroll 0, smoothly scrubs away as user scrolls) */}
          <div
            ref={heroHeaderRef}
            className={`absolute top-0  inset-x-0 mx-auto max-w-5xl text-center px-4 z-20 will-change-transform ${
              isHero ? "pointer-events-auto" : "pointer-events-none"
            }`}
          >
            <div
              data-animate="hero-tag"
              className="flex items-center justify-center gap-3 mb-2 sm:mb-3"
            >
              <span className="w-6 h-px bg-brand/60" />
              <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
                CITADEL / SMART SOLUTIONS
              </span>
              <span className="w-6 h-px bg-brand/60" />
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[54px] xl:text-[62px] font-bold text-white uppercase tracking-[1.5px] sm:tracking-[2px] leading-[1.08] max-w-5xl mx-auto">
              <span className="block overflow-hidden py-0.5">
                <span data-animate="hero-line" className="block">
                  SYSTEMS THAT MAKE
                </span>
              </span>
              <span className="block overflow-hidden py-0.5">
                <span data-animate="hero-line" className="block text-white">
                  YOUR BUSINESS STRONGER.
                </span>
              </span>
            </h1>
          </div>

          {/* Unified Two-Column Layout (Statements on left, Single 3D Model on right) */}
          <div className="w-full max-w-7xl 2xl:max-w-384 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center z-10">
            {/* Left Column: Statements UI & Controls */}
            <div
              ref={statementsTextRef}
              style={{ opacity: 0 }}
              className={`relative flex flex-col items-start space-y-6 md:space-y-8 will-change-transform opacity-0 ${
                isHero
                  ? "pointer-events-none select-none"
                  : "pointer-events-auto"
              }`}
            >
              {/* Ambient Watermark Number */}
              <div
                ref={watermarkRef}
                style={{ opacity: 0 }}
                className="absolute -left-4 sm:-left-8 -top-14 sm:-top-20 text-[120px] sm:text-[180px] font-black font-mono text-white/[0.035] pointer-events-none select-none leading-none -z-10 opacity-0"
                aria-hidden="true"
              >
                {currentStatement.id}
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
                        idx === activeSlideIndex
                          ? "w-8 sm:w-10 bg-brand shadow-[0_0_12px_rgba(196,162,84,0.7)]"
                          : idx < activeSlideIndex
                            ? "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
                            : "w-2.5 sm:w-3 bg-white/10 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[2px] uppercase text-brand/90 font-semibold">
                  PHASE 0{activeSlideIndex + 1} / 08
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
                    {currentStatement.tag}
                  </span>
                </div>

                <h2
                  ref={titleRef}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-white uppercase leading-[1.05] whitespace-pre-line"
                >
                  {currentStatement.title}
                </h2>

                <p
                  ref={descRef}
                  className="text-base sm:text-xl text-white/60 font-normal leading-relaxed max-w-xl"
                >
                  {currentStatement.description}
                </p>

                {currentStatement.hasCTA && (
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

            {/* Right Column: The Single Persistent 3D Model */}
            <div className="w-full flex items-center justify-center relative">
              <div
                ref={modelTransitionRef}
                className="w-full flex items-center justify-center will-change-transform"
              >
                <div
                  data-animate="hero-model"
                  className="w-full flex items-center justify-center will-change-transform"
                >
                  <Citadel3DModel
                    phase={activeModelPhase}
                    interactive={true}
                    lockRotation={false}
                    lockRotationX={true}
                    lockRotationY={false}
                    showControls={false}
                    borderless={true}
                    enablePhaseHover={false}
                    enablePhaseClick={false}
                    spinOnPhase8={true}
                    heightClass="h-[440px] sm:h-[520px] lg:h-[580px] xl:h-[620px]"
                    onReady={reportModelReady}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
