"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { CitadelLogo, CitadelMark } from "./CitadelLogo";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function FooterCTA() {
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-animate='footer-headline']", { opacity: 0, y: 24 });
        gsap.set("[data-animate='footer-button']", { opacity: 0, y: 16 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        });

        tl.to(
          "[data-animate='footer-headline']",
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          0,
        );

        tl.to(
          "[data-animate='footer-button']",
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0.1,
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
              trigger: footerRef.current,
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
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-[#05070a] pt-20 pb-12 border-t border-white/15"
    >
      {/* Giant Watermark Silhouette of Citadel Tower in bottom right */}
      <div className="absolute -right-15 md:right-10 bottom-16 pointer-events-none opacity-[0.035] select-none">
        <CitadelMark className="w-[380px] h-[480px] sm:w-[500px] sm:h-[640px] text-white" />
      </div>

      <div className="max-w-[1353px] mx-auto px-6 sm:px-10 relative z-10 flex flex-col justify-between space-y-24">
        {/* Big Centered Headline & Action */}
        <div className="flex flex-col items-center justify-center text-center space-y-8 py-12 md:py-20">
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
              href="#schedule"
              className="inline-flex items-center gap-4 bg-brand hover:bg-brand/90 text-[#1C2633] px-8 py-4 rounded-sm font-semibold text-xs sm:text-sm tracking-[2px] uppercase transition-colors shadow-sm"
            >
              <span>START A CONVERSATION</span>
              <span className="text-base leading-none">→</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="pt-8 px-20 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
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
