"use client";

import React, { useRef, useEffect } from "react";
import { useIntro } from "@/lib/intro-context";
import { gsap, useGSAP } from "@/lib/gsap";

// SVG tier paths defined from public/citadel-mark.svg (Tier 1 is base foundation at bottom, Tier 8 is crown at top)
const TIER_PATHS = [
  { id: "tier-1", d: "M23.8125 27.771H0V31.9923H23.8125V27.771Z", phaseThreshold: 15 },
  { id: "tier-2", d: "M22.4054 23.9826H1.4071V26.8509H22.4054V23.9826Z", phaseThreshold: 30 },
  { id: "tier-3", d: "M21.0524 20.3025H2.76009V23.1167H21.0524V20.3025Z", phaseThreshold: 45 },
  { id: "tier-4", d: "M20.0241 16.6221H3.78833V19.4021H20.0241V16.6221Z", phaseThreshold: 60 },
  { id: "tier-5", d: "M18.9959 12.9961H4.81665V15.7361H18.9959V12.9961Z", phaseThreshold: 72 },
  { id: "tier-6", d: "M17.9134 9.37012H5.89893V12.0701H17.9134V9.37012Z", phaseThreshold: 82 },
  { id: "tier-7", d: "M16.8852 5.79883H6.92725V8.39883H16.8852V5.79883Z", phaseThreshold: 92 },
  {
    id: "tier-8",
    d: "M5.89901 0.00774132H9.84972V2.22663H13.9628V0.00774132H17.9135V4.87848H5.89901V0.00774132Z",
    phaseThreshold: 100,
  },
];

export function CitadelPreloader() {
  const {
    phase,
    progress,
    isComplete,
    startExitTransition,
    markComplete,
  } = useIntro();

  const containerRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const scanLineRef = useRef<SVGLineElement>(null);
  const sonarRingRef = useRef<HTMLDivElement>(null);
  const hasExitedRef = useRef(false);

  // Scanning laser animation while waiting
  useGSAP(
    () => {
      if (hasExitedRef.current) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (scanLineRef.current) {
          gsap.fromTo(
            scanLineRef.current,
            { attr: { y1: 0, y2: 0 }, opacity: 0.2 },
            {
              attr: { y1: 32, y2: 32 },
              opacity: 0.85,
              duration: 2.0,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            }
          );
        }
      });
    },
    { scope: containerRef }
  );

  // Trigger ready-to-hero cinematic exit timeline when READY
  useEffect(() => {
    if (phase !== "READY" || hasExitedRef.current) return;
    hasExitedRef.current = true;

    const container = containerRef.current;
    const mark = markRef.current;
    const sonar = sonarRingRef.current;
    if (!container) {
      startExitTransition();
      markComplete();
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      startExitTransition();
      gsap.to(container, {
        opacity: 0,
        duration: 0.25,
        ease: "none",
        onComplete: markComplete,
      });
      return;
    }

    const tl = gsap.timeline({
      delay: 0.08,
      onComplete: () => {
        markComplete();
      },
    });

    // 1. Sonar pulse ring flaring outward from mark
    if (sonar) {
      tl.fromTo(
        sonar,
        { scale: 0.8, opacity: 0.85 },
        {
          scale: 3.2,
          opacity: 0,
          duration: 0.75,
          ease: "power2.out",
        },
        0
      );
    }

    // 2. Mark illuminates with warm gold flare
    if (mark) {
      tl.to(
        mark,
        {
          filter: "drop-shadow(0 0 36px rgba(196,162,84,1)) drop-shadow(0 0 12px rgba(255,255,255,0.8))",
          duration: 0.35,
          ease: "power2.out",
        },
        0
      );
    }

    // 3. Mark scales forward into view and dissolves
    if (mark) {
      tl.to(
        mark,
        {
          scale: 1.25,
          opacity: 0,
          duration: 0.45,
          ease: "power2.inOut",
        },
        0.22
      );
    }

    // 4. Preloader curtain glides upward with sleek gold baseline
    tl.to(
      container,
      {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
      },
      0.35
    );

    // 5. Trigger live hero entrance right as the curtain sweeps upward
    tl.add(() => {
      startExitTransition();
    }, 0.42);

    // Safety fallback timer: ensures preloader completes even if animation is interrupted
    const fallbackTimer = setTimeout(() => {
      startExitTransition();
      markComplete();
    }, 1500);

    const onVisibility = () => {
      if (!document.hidden) {
        startExitTransition();
        markComplete();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase, startExitTransition, markComplete]);

  if (isComplete) {
    return null;
  }

  return (
    <aside
      ref={containerRef}
      id="citadel-preloader"
      role="status"
      aria-live="polite"
      aria-label="Citadel Loading Animation"
      onClick={() => {
        if (phase === "READY" || phase === "EXITING") {
          startExitTransition();
          markComplete();
        }
      }}
      className={`fixed inset-0 z-[9999] bg-[#05070a] border-b border-brand/50 shadow-[0_12px_40px_rgba(196,162,84,0.18)] flex items-center justify-center select-none overflow-hidden will-change-transform ${
        phase === "READY" ? "cursor-pointer" : ""
      }`}
    >
      {/* Background Architectural Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Subtle Central Navy Ambient Glow */}
      <div
        className="absolute w-[500px] h-[500px] bg-[#0f2a52]/25 rounded-full blur-[100px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Pure Central Citadel Mark SVG Animation */}
      <div className="relative z-10 flex items-center justify-center">
        {/* Holographic Sonar Ripple Ring (fires on READY exit) */}
        <div
          ref={sonarRingRef}
          className="absolute w-36 h-36 rounded-full border border-brand/60 pointer-events-none opacity-0"
          aria-hidden="true"
        />

        {/* Precision Architectural Citadel SVG Mark */}
        <svg
          ref={markRef}
          viewBox="0 0 23.8125 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-24 h-32 sm:w-28 sm:h-36 md:w-32 md:h-40 transition-all duration-300 drop-shadow-[0_4px_32px_rgba(0,0,0,0.85)]"
          aria-hidden="true"
        >
          {/* Underlying Architectural Blueprint Wireframe */}
          {TIER_PATHS.map((tier) => (
            <path
              key={`wireframe-${tier.id}`}
              d={tier.d}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.4"
              fill="rgba(28,38,51,0.3)"
            />
          ))}

          {/* Dynamically Illuminated Tiers Driven by Real Progress Gates */}
          {TIER_PATHS.map((tier) => {
            const isIlluminated = progress >= tier.phaseThreshold;
            const isCurrentTier =
              progress >= tier.phaseThreshold - 15 && progress < tier.phaseThreshold;

            return (
              <path
                key={`active-${tier.id}`}
                d={tier.d}
                fill={isIlluminated ? "#FFFFFF" : isCurrentTier ? "rgba(196,162,84,0.4)" : "none"}
                stroke={isIlluminated ? "#C4A254" : isCurrentTier ? "#C4A254" : "none"}
                strokeWidth="0.3"
                className="transition-all duration-300 ease-out"
                style={{
                  opacity: isIlluminated ? 1 : isCurrentTier ? 0.7 : 0,
                }}
              />
            );
          })}

          {/* Subtle Scanning Laser Line (sweeps vertically while active) */}
          <line
            ref={scanLineRef}
            x1="0"
            y1="0"
            x2="23.8125"
            y2="0"
            stroke="#C4A254"
            strokeWidth="0.6"
            strokeLinecap="round"
            className="opacity-70 pointer-events-none"
          />
        </svg>
      </div>
    </aside>
  );
}
