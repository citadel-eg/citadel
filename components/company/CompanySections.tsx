"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

// ==========================================
// 02 / WHO WE ARE
// ==========================================
export function CompanyWhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);

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
          "[data-animate='who-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='who-title']",
          { opacity: 0, y: motion.distance },
          { opacity: 1, y: 0, duration: 0.55, ease: motion.ease.emphasis },
          0.05,
        );

        tl.fromTo(
          "[data-animate='who-copy']",
          { opacity: 0, y: motion.distanceSm },
          { opacity: 1, y: 0, duration: motion.duration.base },
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
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        {/* Header marker */}
        <div data-animate="who-marker" className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
            02
          </span>
          <span className="w-10 h-px bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            WHO WE ARE
          </span>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <h2
              data-animate="who-title"
              className="text-3xl sm:text-5xl font-semibold leading-[1.15] text-white tracking-tight uppercase"
            >
              WE START BY UNDERSTANDING
              <br />
              THE BUSINESS.
            </h2>
          </div>

          <div
            data-animate="who-copy"
            className="lg:col-span-6 flex flex-col space-y-6 pt-1"
          >
            <p className="text-base sm:text-lg text-white/70 font-normal leading-relaxed">
              Citadel is a technology partner focused on understanding how
              businesses operate, identifying what holds them back, and building
              systems that make them stronger.
            </p>
            <p className="text-lg sm:text-xl font-semibold text-white tracking-wide uppercase">
              BUSINESS FIRST. TECHNOLOGY SECOND.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 03 / MISSION & VISION
// ==========================================
export function CompanyMissionVision() {
  const sectionRef = useRef<HTMLElement>(null);

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
          "[data-animate='mv-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='mv-card']",
          { opacity: 0, y: motion.distance },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: motion.ease.out,
          },
          0.08,
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
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        {/* Header marker */}
        <div data-animate="mv-marker" className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
            03
          </span>
          <span className="w-10 h-px bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            MISSION & VISION
          </span>
        </div>

        {/* 2 Wide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Our Mission */}
          <article
            data-animate="mv-card"
            className="group relative border border-white/20 hover:border-brand/60 rounded-md p-8 sm:p-10  backdrop-blur-xs flex flex-col space-y-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,162,84,0.12)]"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-lg border border-white/20 group-hover:border-brand flex items-center justify-center transition-colors">
                <svg
                  className="w-8 h-8 text-white group-hover:text-brand transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" />
                  <circle cx="12" cy="12" r="5" stroke="currentColor" />
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                  <path
                    d="M12 12L18.5 5.5"
                    stroke="currentColor"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-wide uppercase">
                OUR MISSION
              </h3>
            </div>
            <p className="text-base text-white/70 font-normal leading-relaxed">
              Our mission is to help businesses understand their challenges,
              structure better ways of working, and implement practical
              solutions that create lasting value.
            </p>
          </article>

          {/* Card 2: Our Vision */}
          <article
            data-animate="mv-card"
            className="group relative border border-white/20 hover:border-brand/60 rounded-md p-8 sm:p-10  backdrop-blur-xs flex flex-col space-y-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(196,162,84,0.12)]"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-lg border border-white/20 group-hover:border-brand flex items-center justify-center transition-colors">
                <svg
                  className="w-8 h-8 text-white group-hover:text-brand transition-colors"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M3 7V5a2 2 0 0 1 2-2h2" strokeLinecap="round" />
                  <path d="M17 3h2a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                  <path d="M21 17v2a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
                  <path d="M7 21H5a2 2 0 0 1-2-2v-2" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" />
                  <path d="M12 9v1" strokeLinecap="round" />
                  <path d="M12 14v1" strokeLinecap="round" />
                  <path d="M9 12h1" strokeLinecap="round" />
                  <path d="M14 12h1" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white tracking-wide uppercase">
                OUR VISION
              </h3>
            </div>
            <p className="text-base text-white/70 font-normal leading-relaxed">
              We aim to become a trusted partner for businesses seeking to
              operate more effectively, adapt with confidence, and grow through
              thoughtful decisions and well-designed systems.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 04 / OUR VALUES
// ==========================================
export function CompanyValues() {
  const sectionRef = useRef<HTMLElement>(null);

  const values = [
    {
      id: "/ 01",
      title: "SCIENCE INTO ACTION",
      description:
        "Use evidence, analysis, and structured thinking to make ideas practical.",
    },
    {
      id: "/ 02",
      title: "COURAGEOUS LEADERSHIP",
      description:
        "Question assumptions, take responsibility, and make considered decisions.",
    },
    {
      id: "/ 03",
      title: "LONG-TERM IMPACT",
      description:
        "Look beyond immediate deliverables toward lasting value and sustainable growth.",
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
          "[data-animate='values-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='value-card']",
          { opacity: 0, y: motion.distance },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: motion.ease.out,
          },
          0.08,
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
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        {/* Header marker */}
        <div data-animate="values-marker" className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
            04
          </span>
          <span className="w-10 h-px bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            OUR VALUES
          </span>
        </div>

        {/* 3 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {values.map((val) => (
            <article
              key={val.id}
              data-animate="value-card"
              className="group relative border border-white/20 hover:border-brand/60 rounded-md p-8  flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-[0_0_24px_rgba(196,162,84,0.12)] min-h-50"
            >
              <div className="space-y-3">
                <span className="text-xs font-semibold tracking-[2px] text-brand font-mono">
                  {val.id}
                </span>
                <h3 className="text-xl font-semibold text-white tracking-tight uppercase">
                  {val.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                {val.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 05 / WHY CITADEL (Six Rules Grid)
// ==========================================
export function CompanyWhyCitadel() {
  const sectionRef = useRef<HTMLElement>(null);

  const rules = [
    {
      id: "01",
      bars: 1,
      title: "Knowledge → Action",
      description:
        "Understanding is only valuable when it becomes a working system.",
    },
    {
      id: "02",
      bars: 2,
      title: "Fearless Leadership",
      description:
        "We say what the business needs to hear — clearly and early.",
    },
    {
      id: "03",
      bars: 3,
      title: "Long Term Impact",
      description:
        "We build for the organization five years from now, not the demo.",
    },
    {
      id: "04",
      bars: 4,
      title: "IP as a Trust",
      description:
        "Client knowledge and intellectual property are held with discipline.",
    },
    {
      id: "05",
      bars: 5,
      title: "Sustainability First",
      description:
        "Systems that can be owned, maintained and extended without us.",
    },
    {
      id: "06",
      bars: 6,
      title: "Building Talent",
      description: "Strong systems are built and sustained by strong people.",
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
          "[data-animate='why-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='why-title']",
          { opacity: 0, y: motion.distance },
          { opacity: 1, y: 0, duration: 0.55, ease: motion.ease.emphasis },
          0.05,
        );

        tl.fromTo(
          "[data-animate='why-grid-cell']",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
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
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Column: Heading */}
        <div className="lg:col-span-5 flex flex-col space-y-10">
          <div data-animate="why-marker" className="flex items-center gap-4">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
              05
            </span>
            <span className="w-10 h-px bg-white/30" />
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
              WHY CITADEL
            </span>
          </div>

          <h2
            data-animate="why-title"
            className="text-4xl sm:text-6xl font-bold lg:text-nowrap text-white tracking-tight leading-[1.05] uppercase"
          >
            SIX RULES
            <br />
            HOLD
            <br />
            THE STRUCTURE.
          </h2>
        </div>

        {/* Right Column: 2x3 Grid */}
        <div className="lg:col-span-7 border-t border-l border-white/20 grid grid-cols-1 sm:grid-cols-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              data-animate="why-grid-cell"
              className="group border-b border-r border-white/20 p-8 sm:p-10 flex flex-col justify-between space-y-8 /60 hover:bg-[#0c1422] transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-brand font-mono tracking-wider transition-colors">
                  {rule.id}
                </span>

                {/* Vertical bars indicator */}
                <div className="flex items-end gap-1 h-3.5">
                  {[1, 2, 3, 4, 5, 6].map((barNum) => (
                    <span
                      key={barNum}
                      style={{ height: `${barNum * 2.2}px` }}
                      className={`w-1 transition-colors duration-200 ${
                        barNum <= rule.bars
                          ? "bg-white group-hover:bg-brand"
                          : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {rule.title}
                </h3>
                <p className="text-sm text-white/70 font-normal leading-relaxed">
                  {rule.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 06 / THE CITADEL MODEL
// ==========================================
export function CompanyModel() {
  const sectionRef = useRef<HTMLElement>(null);

  const modelColumns = [
    {
      id: "01",
      badge: "FUNDS NEXT →",
      title: "BUILD",
      subtitle: "Establish credibility.",
      items: ["First clients", "Case studies", "Referrals", "Credibility"],
      heightClass: "lg:min-h-[420px] lg:self-end",
    },
    {
      id: "02",
      badge: "FUNDS NEXT →",
      title: "SCALE",
      subtitle: "Structured growth.",
      items: [
        "Recurring clients",
        "Retainers",
        "Lead system",
        "Predictable revenue",
      ],
      heightClass: "lg:min-h-[520px] lg:self-end",
    },
    {
      id: "03",
      badge: "",
      title: "PRODUCT",
      subtitle: "Products from real needs.",
      items: [
        "Client problems",
        "Product development",
        "Recurring revenue",
        "Scalable company",
      ],
      heightClass: "lg:min-h-[620px] lg:self-end",
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
          "[data-animate='model-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='model-title']",
          { opacity: 0, y: motion.distance },
          { opacity: 1, y: 0, duration: 0.55, ease: motion.ease.emphasis },
          0.05,
        );

        tl.fromTo(
          "[data-animate='model-col']",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
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
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="space-y-12">
        {/* Header marker */}
        <div data-animate="model-marker" className="flex items-center gap-4">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
            06
          </span>
          <span className="w-10 h-px bg-white/30" />
          <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
            THE CITADEL MODEL
          </span>
        </div>

        {/* Heading */}
        <h2
          data-animate="model-title"
          className="text-3xl sm:text-5xl lg:text-[56px] font-semibold text-white tracking-tight uppercase leading-[1.1] max-w-5xl"
        >
          SERVICES FUND EVERY STAGE.
          <br />
          PRODUCTS EMERGE FROM REAL CLIENT PROBLEMS.
        </h2>

        {/* 3 Tiered Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 pt-6 items-end">
          {modelColumns.map((col) => (
            <div
              key={col.id}
              data-animate="model-col"
              className={`border-x border-b border-white/15 border-t-2 border-t-white/80 p-8 sm:p-10 flex flex-col justify-between space-y-8 rounded-t-sm hover:border-t-brand transition-colors duration-300 ${col.heightClass}`}
            >
              <div>
                <div className="flex items-center justify-between text-white font-mono mb-8">
                  <span className="text-sm font-bold tracking-wider">
                    {col.id}
                  </span>
                  {col.badge && (
                    <span className="text-[10px] font-semibold tracking-[3px] text-white/80">
                      {col.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-2">
                  {col.title}
                </h3>
                <p className="text-base text-white/70 font-normal">
                  {col.subtitle}
                </p>
              </div>

              {/* Items List */}
              <div className="divide-y divide-white/15 border-t border-white/15 pt-2">
                {col.items.map((item) => (
                  <div
                    key={item}
                    className="py-3 flex items-center gap-3 text-sm text-white/80 font-normal"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
