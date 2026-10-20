"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { CitadelLogo, CitadelMark } from "./CitadelLogo";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export function FooterCTA() {
  const footerRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-animate='footer-headline']", {
          opacity: 0,
          y: motion.distance,
        });
        gsap.set("[data-animate='footer-button']", {
          opacity: 0,
          y: motion.distanceSm,
        });
        gsap.set("[data-animate='footer-bar']", {
          opacity: 0,
          y: 10,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.to(
          "[data-animate='footer-headline']",
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: motion.ease.emphasis,
          },
          0,
        );

        tl.to(
          "[data-animate='footer-button']",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: motion.ease.out,
          },
          0.12,
        );

        tl.to(
          "[data-animate='footer-bar']",
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: motion.ease.out,
          },
          0.2,
        );

        // Architectural watermark subtle parallax depth
        if (watermarkRef.current && footerRef.current) {
          gsap.to(watermarkRef.current, {
            scrollTrigger: {
              trigger: footerRef.current,
              start: "top bottom",
              end: "bottom bottom",
              scrub: true,
            },
            y: -32,
            ease: "none",
          });
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
              trigger: footerRef.current,
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
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#05070a] border-t border-white/15"
    >
      {/* 1. First Footer Section (CTA Hero with Watermark Silhouette) */}
      <div className="relative overflow-hidden pt-20 pb-16 md:pb-24 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        {/* Giant Watermark Silhouette of Citadel Tower confined strictly to the first section */}
        <div
          ref={watermarkRef}
          className="absolute -right-8 sm:right-4 md:right-10 lg:right-16 inset-y-0 flex items-center justify-end pointer-events-none opacity-[0.035] select-none will-change-transform"
        >
          <CitadelMark className="h-full w-auto aspect-3/4 text-white" />
        </div>

        {/* Big Centered Headline & Action */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 py-10 md:py-16">
          <h2
            data-animate="footer-headline"
            className="text-3xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight uppercase leading-[1.05]"
          >
            BUILD STRONG
            <br />
            SYSTEMS, GROW SUSTAINABLY.
          </h2>

          <div data-animate="footer-button" className="pt-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-4 bg-brand hover:bg-brand/90 text-[#1C2633] px-8 py-4 rounded-sm font-semibold text-xs sm:text-sm tracking-[2px] uppercase transition-colors shadow-sm"
            >
              <span>START A CONVERSATION</span>
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Bottom Bar (Clean, no watermark overlap) */}
      <div
        data-animate="footer-bar"
        className="py-8 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 bg-[#05070a]"
      >
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <CitadelLogo />
        </Link>

        <p className="text-xs text-white/50 font-normal tracking-wide text-center sm:text-right">
          © 2026 Citadel Smart Solutions. Strong Systems. Sustainable Growth.
        </p>
      </div>
    </footer>
  );
}
