"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const cards = [
    {
      id: "/ 01",
      title: "MANUAL WORK",
      description:
        "Repeated tasks consume time and create unnecessary dependency.",
      footerNote: "TIME LOST TO REPETITION",
      icon: (
        <svg
          className="w-6 h-6 text-white/70 group-hover:text-brand transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="16" y2="12" />
          <line x1="4" y1="17" x2="18" y2="17" />
        </svg>
      ),
    },
    {
      id: "/ 02",
      title: "FRAGMENTED SYSTEMS",
      description: "Information lives across disconnected tools and processes.",
      footerNote: "INFORMATION WITHOUT CONNECTION",
      icon: (
        <svg
          className="w-6 h-6 text-white/70 group-hover:text-brand transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="3" y="3" width="6" height="6" />
          <rect x="15" y="3" width="6" height="6" />
          <rect x="9" y="15" width="6" height="6" />
          <path d="M6 9v3h12V9" />
          <path d="M12 12v3" />
        </svg>
      ),
    },
    {
      id: "/ 03",
      title: "UNSTRUCTURED GROWTH",
      description: "The business grows faster than the systems supporting it.",
      footerNote: "GROWTH WITHOUT A FOUNDATION",
      icon: (
        <svg
          className="w-6 h-6 text-white/70 group-hover:text-brand transition-colors duration-300"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 20h4v-4h4v-4h4v-4h4" />
        </svg>
      ),
    },
  ];

  useGSAP(
    () => {
      const cardsList = gsap.utils.toArray<HTMLElement>(
        "[data-animate='problem-card']",
      );

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Set initial hidden states immediately to guarantee clean initial load
        gsap.set(cardsList, {
          opacity: 0,
          y: motion.distance,
          scale: 0.98,
        });
        gsap.set("[data-animate='card-icon']", {
          opacity: 0,
          scale: 0.8,
        });
        gsap.set("[data-animate='card-divider']", {
          scaleX: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        // 1. Header marker: crisp reveal
        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: motion.duration.base,
            ease: motion.ease.out,
          },
          0,
        );
        tl.fromTo(
          "[data-animate='header-line']",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.32,
            ease: motion.ease.out,
          },
          0.02,
        );
        tl.fromTo(
          "[data-animate='header-title']",
          { opacity: 0, x: 10 },
          {
            opacity: 1,
            x: 0,
            duration: motion.duration.base,
            ease: motion.ease.out,
          },
          0.04,
        );

        // 2. Section Heading & Quote: immediate punchy lift
        tl.fromTo(
          "[data-animate='headline']",
          { opacity: 0, y: motion.distanceSm },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: motion.ease.emphasis,
          },
          0.04,
        );
        tl.fromTo(
          "[data-animate='quote-box']",
          { opacity: 0, x: 14 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: motion.ease.out,
          },
          0.08,
        );

        // 3. 3 Structured Diagnostic Cards: sequential architectural reveal
        if (cardsList.length) {
          tl.to(
            cardsList,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              ease: motion.ease.emphasis,
              stagger: motion.stagger,
            },
            0.1,
          );
        }

        // 4. Staggered card internal details (icons, dividers)
        tl.to(
          "[data-animate='card-icon']",
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: motion.ease.out,
            stagger: motion.stagger,
          },
          0.16,
        );

        tl.to(
          "[data-animate='card-divider']",
          {
            scaleX: 1,
            duration: 0.35,
            ease: motion.ease.out,
            stagger: motion.stagger,
          },
          0.18,
        );

        // 5. Footer Sub-line
        tl.fromTo(
          "[data-animate='footer-line']",
          { opacity: 0, x: 12 },
          {
            opacity: 1,
            x: 0,
            duration: motion.duration.base,
            ease: motion.ease.out,
          },
          0.24,
        );
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
              trigger: sectionRef.current,
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
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16 relative">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            03
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            The Real Problem
          </span>
        </div>

        {/* Section Heading & Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between">
          <div className="lg:col-span-9">
            <h2
              data-animate="headline"
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white uppercase leading-[1.08] tracking-tight"
            >
              MOST BUSINESS PROBLEMS AREN&apos;T TECHNOLOGY PROBLEMS.
            </h2>
          </div>
          <div
            data-animate="quote-box"
            className="lg:col-span-3 border-l-2 border-white pl-4"
          >
            <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
              They are operational problems that technology has not solved yet.
            </p>
          </div>
        </div>

        {/* 3 Structured Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.id}
              data-animate="problem-card"
              className="group relative flex flex-col justify-between border border-white/20 md:border-r-0 md:last:border-r hover:border-brand/60 p-8 bg-[#080d16] hover:bg-[#0c1422] transition-all duration-300 min-h-85 hover:shadow-[0_0_24px_rgba(196,162,84,0.12)] hover:z-10 cursor-default overflow-hidden opacity-0"
            >
              {/* Top ambient gold indicator hairline that reveals on card hover */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div>
                {/* Top Number & Icon */}
                <div className="flex items-center justify-between pb-8">
                  <span className="text-xs sm:text-sm font-mono text-white/60 group-hover:text-brand tracking-wider transition-colors duration-200">
                    {card.id}
                  </span>
                  <div
                    data-animate="card-icon"
                    className="transition-transform duration-300 group-hover:scale-110"
                  >
                    {card.icon}
                  </div>
                </div>

                {/* Card Title & Description */}
                <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-tight group-hover:text-white transition-colors duration-200">
                  {card.title}
                </h3>
                <p className="text-sm sm:text-base text-white/60 font-normal leading-relaxed mt-4 group-hover:text-white/70 transition-colors duration-200">
                  {card.description}
                </p>
              </div>

              {/* Bottom Divider & Tag */}
              <div
                data-animate="card-divider"
                className="pt-8 border-t border-white/20 group-hover:border-brand/40 transition-colors duration-300 mt-8 origin-left"
              >
                <span className="text-[11px] sm:text-xs font-semibold tracking-[2px] uppercase text-white/50 group-hover:text-white/80 transition-colors duration-200 font-mono">
                  {card.footerNote}
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Footer Sub-line */}
        <div data-animate="footer-line" className="flex justify-end pt-4">
          <span className="text-xs font-semibold tracking-[3px] uppercase text-white/40 font-mono">
            ONE OPERATIONAL SYSTEM, UNSOLVED
          </span>
        </div>
      </div>
    </section>
  );
}
