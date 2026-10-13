"use client";

import React, { useRef } from "react";
import { Citadel3DModel } from "./Citadel3DModel";
import Particles from "./Particles";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export function HeroBillboard() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Initial entrance timeline
        const tl = gsap.timeline({ defaults: { ease: motion.ease.emphasis } });

        tl.fromTo(
          "[data-animate='hero-tag']",
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: motion.duration.base,
            ease: motion.ease.out,
          },
        );

        tl.fromTo(
          "[data-animate='hero-line']",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: motion.ease.emphasis,
          },
          "-=0.2",
        );

        tl.fromTo(
          "[data-animate='hero-model']",
          { opacity: 0, scale: 0.94, y: 16 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: motion.duration.slow,
            ease: motion.ease.out,
          },
          "-=0.5",
        );

        // Smooth scroll-driven departure as the pinned journey approaches
        if (contentRef.current && sectionRef.current) {
          gsap.to(contentRef.current, {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            yPercent: -12,
            opacity: 0.25,
            scale: 0.97,
            ease: "none",
          });
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0 },
          { opacity: 1, duration: motion.duration.base },
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
      className="relative w-full h-[calc(100dvh-5rem)] min-h-130 max-h-[calc(100dvh-5rem)] px-6 sm:px-10 border-b border-white/10 bg-[#05070a] overflow-hidden flex flex-col items-center justify-between py-6 sm:py-8 lg:py-10"
    >
      {/* Background Particles from React Bits (first section only) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <Particles
          particleColors={["#ffffff", "#d8e4ff", "#94a3b8"]}
          particleCount={230}
          particleSpread={7.5}
          speed={0.1}
          particleBaseSize={120}
          glow={0.9}
          twinkle={1}
          moveParticlesOnHover={false}
          hoverEffect="parallax"
          sizeRandomness={0.5}
          shape="sparkle"
          cameraDistance={36}
          opacity={0.9}
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 max-w-[1353px] mx-auto w-full h-full flex flex-col items-center justify-between gap-4 sm:gap-6"
      >
        {/* Billboard Header with Line-Masked Split Reveal */}
        <div className="shrink-0 text-center pt-2 sm:pt-4">
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

        {/* Complete 3D Citadel Fortress dynamically filling screen height */}
        <div
          data-animate="hero-model"
          className="flex-1 w-full min-h-0 flex items-center justify-center will-change-transform"
        >
          <Citadel3DModel
            phase="all"
            disableGround={false}
            snapBackOnRelease={false}
            interactive={true}
            lockRotation={false}
            lockRotationX={true}
            lockRotationY={false}
            showControls={false}
            borderless={true}
            enablePhaseHover={false}
            enablePhaseClick={false}
            heightClass="h-full w-full max-h-[460px] lg:max-h-[520px]"
          />
        </div>
      </div>
    </section>
  );
}
