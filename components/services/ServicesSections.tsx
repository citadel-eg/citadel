"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import { WhatWeBuild } from "@/components/WhatWeBuild";

// ==========================================
// 01 / SERVICES HERO (Reusing components/WhatWeBuild.tsx)
// ==========================================
export function ServicesHero() {
  return (
    <WhatWeBuild
      id="services-hero"
      badge="Services"
      className="pt-12 pb-20 md:pt-16 md:pb-24"
      linkHref="/contact"
    />
  );
}

// ==========================================
// 02 / WHAT WE BUILD (Connected Ways)
// ==========================================
export function ServicesWhatWeBuild() {
  const sectionRef = useRef<HTMLElement>(null);

  const offerings = [
    {
      id: "/ 01",
      title: "AUTOMATION",
      headline: "Make repetitive work disappear.",
      tags: "Workflow automation · Connected tools · Fewer manual handoffs",
    },
    {
      id: "/ 02",
      title: "OPERATIONS",
      headline: "Connect people, processes, and information.",
      tags: "Operational systems · Shared visibility · Clearer decisions",
    },
    {
      id: "/ 03",
      title: "DIGITAL PRODUCTS",
      headline: "Turn real business needs into scalable products.",
      tags: "Product experiences · Business platforms · Systems built to grow",
    },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.fromTo(
          "[data-animate='wwb-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='wwb-sub']",
          { opacity: 0, y: motion.distanceSm },
          { opacity: 1, y: 0, duration: motion.duration.base },
          0.05,
        );

        tl.fromTo(
          "[data-animate='wwb-card']",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: motion.ease.out,
          },
          0.12,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, x: 0, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20  border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        <div className="space-y-4">
          <div data-animate="wwb-marker" className="flex items-center gap-4">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
              02
            </span>
            <span className="w-10 h-px bg-white/30" />
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
              WHAT WE BUILD
            </span>
          </div>

          <p
            data-animate="wwb-sub"
            className="text-base sm:text-lg text-white/70 font-normal leading-relaxed"
          >
            Three connected ways to strengthen a business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offerings.map((card) => (
            <article
              key={card.id}
              data-animate="wwb-card"
              className="border border-white/20 hover:border-brand/60 rounded-md p-8  flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_24px_rgba(196,162,84,0.12)] min-h-60"
            >
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-[2px] text-brand font-mono">
                  {card.id}
                </span>
                <h3 className="text-2xl font-bold text-white tracking-wide uppercase">
                  {card.title}
                </h3>
                <p className="text-base text-white/80 font-normal">
                  {card.headline}
                </p>
              </div>

              <div className="pt-4 border-t border-white/15">
                <p className="text-xs text-white/50 font-mono tracking-wide leading-relaxed">
                  {card.tags}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 03 / HOW WE WORK (5 Clear Delivery Steps)
// ==========================================
export function ServicesHowWeWork() {
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      id: "01",
      title: "DISCOVER",
      desc: "Understand operations.",
    },
    {
      id: "02",
      title: "ARCHITECT",
      desc: "Define the system.",
    },
    {
      id: "03",
      title: "BUILD",
      desc: "Create what teams need.",
    },
    {
      id: "04",
      title: "DEPLOY",
      desc: "Bring it into daily work.",
    },
    {
      id: "05",
      title: "SUPPORT",
      desc: "Improve over time.",
    },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.fromTo(
          "[data-animate='hww-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='hww-step']",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: motion.ease.out,
          },
          0.1,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, x: 0, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20  border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        <div className="space-y-4">
          <div data-animate="hww-marker" className="flex items-center gap-4">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
              03
            </span>
            <span className="w-10 h-px bg-white/30" />
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
              HOW WE WORK
            </span>
          </div>

          <p className="text-base sm:text-lg text-white/70 font-normal leading-relaxed">
            A clear path from the real problem to a system people can use.
          </p>
        </div>

        {/* 5 Delivery Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((st) => (
            <div
              key={st.id}
              data-animate="hww-step"
              className="border border-white/20 hover:border-brand/60 rounded-md p-6  flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(196,162,84,0.12)] min-h-40"
            >
              <span className="text-xs font-semibold text-brand font-mono tracking-widest">
                {st.id}
              </span>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white tracking-wider uppercase">
                  {st.title}
                </h4>
                <p className="text-sm text-white/60 font-normal">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 04 / A BUSINESS-FIRST GROWTH MODEL
// ==========================================
export function ServicesGrowthModel() {
  const sectionRef = useRef<HTMLElement>(null);

  const growthSteps = [
    { id: "01", name: "UNDERSTAND" },
    { id: "02", name: "SERVE" },
    { id: "03", name: "SYSTEMIZE" },
    { id: "04", name: "SCALE" },
    { id: "05", name: "PRODUCTIZE" },
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            toggleActions: "play reverse play reverse",
          },
        });

        tl.fromTo(
          "[data-animate='gm-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='gm-headline']",
          { opacity: 0, y: motion.distance },
          { opacity: 1, y: 0, duration: 0.55, ease: motion.ease.emphasis },
          0.05,
        );

        tl.fromTo(
          "[data-animate='gm-step']",
          { opacity: 0, x: 16 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.06,
            ease: motion.ease.out,
          },
          0.12,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, x: 0, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20  border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        <div data-animate="gm-marker" className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
            04
          </span>
          <span className="w-10 h-px bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            A BUSINESS-FIRST GROWTH MODEL
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div data-animate="gm-headline" className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight leading-[1.15] uppercase">
              SERVICES FUND EACH STAGE.
              <br />
              PRODUCTS COME FROM REAL NEEDS.
            </h2>
            <p className="text-base sm:text-lg text-white/70 font-normal leading-relaxed">
              Start with a business need. Build a dependable system. Let proven
              needs shape what comes next.
            </p>
          </div>

          <div className="lg:col-span-6 border-t border-white/20 divide-y divide-white/20">
            {growthSteps.map((st) => (
              <div
                key={st.id}
                data-animate="gm-step"
                className="py-4.5 flex items-center gap-6 group hover:pl-2 transition-all duration-200"
              >
                <span className="text-xs font-semibold text-brand font-mono tracking-widest">
                  {st.id}
                </span>
                <span className="text-base sm:text-lg font-bold text-white group-hover:text-brand transition-colors tracking-wider uppercase">
                  {st.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
