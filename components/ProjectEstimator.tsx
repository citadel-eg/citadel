"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type NeedType =
  | "Business System"
  | "Automation"
  | "Digital Product"
  | "Custom Solution";
type ScopeType = "Small" | "Medium" | "Large";
type HaveType =
  | "Idea Only"
  | "Existing Process"
  | "Existing Design"
  | "Existing System";

interface ScopeSpec {
  baseWeeks: string;
  egp: string;
  deliverables: string[];
  techStack: string;
}

const estimateMatrix: Record<NeedType, Record<ScopeType, ScopeSpec>> = {
  "Business System": {
    Small: {
      baseWeeks: "4–6",
      egp: "75K–130K",
      deliverables: [
        "Single-domain operations dashboard",
        "Role-based authentication & permissions",
        "Centralized relational database (PostgreSQL)",
        "Daily operational reporting & export tools",
      ],
      techStack: "Next.js · Node.js · PostgreSQL · Tailwind",
    },
    Medium: {
      baseWeeks: "7–11",
      egp: "140K–260K",
      deliverables: [
        "Multi-department operational control center",
        "Real-time order, inventory & dispatch workflows",
        "Automated PDF invoicing & receipt generation",
        "Staff activity audit trails & role access tiers",
      ],
      techStack: "Microservices · Next.js · Redis Cache · PostgreSQL",
    },
    Large: {
      baseWeeks: "12–18",
      egp: "270K–480K",
      deliverables: [
        "Full enterprise ERP & operations architecture",
        "Multi-branch inventory & warehouse sync",
        "Real-time operational business intelligence",
        "Legacy system migration & failover protocols",
      ],
      techStack: "Distributed Cloud Architecture · Real-time WebSockets",
    },
  },
  Automation: {
    Small: {
      baseWeeks: "3–5",
      egp: "45K–85K",
      deliverables: [
        "Repetitive task elimination & automated triggers",
        "Document parsing & spreadsheet sync",
        "Automated WhatsApp / Email notification pipelines",
        "Error logging & webhook endpoints",
      ],
      techStack: "Serverless Webhooks · Automated Cron Workers",
    },
    Medium: {
      baseWeeks: "5–8",
      egp: "90K–165K",
      deliverables: [
        "Cross-department automated approval workflows",
        "CRM & accounting bidirectional synchronization",
        "Automated reconciliation & validation reports",
        "Fallback monitoring & alert systems",
      ],
      techStack: "Workflow Queues · Custom API Integrations",
    },
    Large: {
      baseWeeks: "8–12",
      egp: "170K–310K",
      deliverables: [
        "End-to-end enterprise operational orchestration",
        "Multi-system ETL data pipelines",
        "High-volume automated document processing",
        "Automated compliance checks & audit records",
      ],
      techStack: "Distributed Message Brokers · Event Queueing",
    },
  },
  "Digital Product": {
    Small: {
      baseWeeks: "5–8",
      egp: "95K–170K",
      deliverables: [
        "High-converting customer portal / B2B ordering",
        "Customer authentication & profile management",
        "Product catalog with dynamic filtering",
        "Administrative order fulfillment panel",
      ],
      techStack: "Next.js SSR · Stripe/Paymob Gateway · JWT Auth",
    },
    Medium: {
      baseWeeks: "8–14",
      egp: "180K–340K",
      deliverables: [
        "Full commercial web application / marketplace",
        "Online payments, invoicing & subscription billing",
        "Admin control room & customer communications",
        "Analytics dashboard & conversion tracking",
      ],
      techStack: "Headless Commerce · Edge Caching · PostgreSQL",
    },
    Large: {
      baseWeeks: "14–22",
      egp: "350K–620K",
      deliverables: [
        "Scalable multi-tenant SaaS / platform ecosystem",
        "Multi-role user hierarchies & team spaces",
        "Public API documentation & developer webhooks",
        "High-concurrency cloud infrastructure & caching",
      ],
      techStack: "Multi-tenant Cloud Architecture · Kubernetes/Docker",
    },
  },
  "Custom Solution": {
    Small: {
      baseWeeks: "4–7",
      egp: "80K–150K",
      deliverables: [
        "Bespoke algorithmic tool or calculation engine",
        "Custom data import/export pipeline",
        "Tailored user interface & input validation",
        "Secure cloud deployment & documentation",
      ],
      techStack: "Custom TypeScript Engine · Docker · Cloud APIs",
    },
    Medium: {
      baseWeeks: "8–14",
      egp: "155K–300K",
      deliverables: [
        "Proprietary business engine & operational logic",
        "Custom analytics & forecasting models",
        "Bespoke internal communication protocols",
        "Full technical specification & architecture guide",
      ],
      techStack: "Custom Cloud Infrastructure · Scalable Micro-APIs",
    },
    Large: {
      baseWeeks: "14–24",
      egp: "310K–590K",
      deliverables: [
        "Complete enterprise-grade custom platform",
        "Mission-critical failover & redundancy architecture",
        "Dedicated cloud infrastructure & DevOps setup",
        "Comprehensive engineering handover & training",
      ],
      techStack: "Mission-Critical Architecture · High Availability",
    },
  },
};

export function ProjectEstimator() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedNeed, setSelectedNeed] = useState<NeedType>("Business System");
  const [selectedScope, setSelectedScope] = useState<ScopeType>("Medium");
  const [selectedHave, setSelectedHave] = useState<HaveType[]>([
    "Existing Process",
  ]);

  const toggleHave = (item: HaveType) => {
    setSelectedHave((prev) => {
      if (prev.includes(item)) {
        if (prev.length === 1) return prev; // keep at least one selected
        return prev.filter((h) => h !== item);
      }
      return [...prev, item];
    });
  };

  const needsList: NeedType[] = [
    "Business System",
    "Automation",
    "Digital Product",
    "Custom Solution",
  ];

  const scopesList: ScopeType[] = ["Small", "Medium", "Large"];

  const haveList: HaveType[] = [
    "Idea Only",
    "Existing Process",
    "Existing Design",
    "Existing System",
  ];

  const currentSpec = estimateMatrix[selectedNeed][selectedScope];

  // Dynamically calculate timeline based on existing assets
  const getTimelineWeeks = () => {
    const hasDesign = selectedHave.includes("Existing Design");
    const hasIdeaOnly = selectedHave.includes("Idea Only");

    if (hasDesign && !hasIdeaOnly) {
      const parts = currentSpec.baseWeeks.split("–");
      if (parts.length === 2) {
        const start = Math.max(2, parseInt(parts[0], 10) - 1);
        const end = Math.max(3, parseInt(parts[1], 10) - 1);
        return `${start}–${end}`;
      }
    }
    return currentSpec.baseWeeks;
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Initial hidden states
        gsap.set("[data-animate='estimator-box']", {
          opacity: 0,
          y: 24,
          scale: 0.99,
        });
        gsap.set("[data-animate='estimator-step']", {
          opacity: 0,
          x: -12,
        });
        gsap.set("[data-animate='estimator-right-item']", {
          opacity: 0,
          x: 12,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
            fastScrollEnd: true,
          },
        });

        // 1. Header marker: fast snap in
        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          0,
        );
        tl.fromTo(
          "[data-animate='header-line']",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.28, ease: "power2.out" },
          0.02,
        );
        tl.fromTo(
          "[data-animate='header-title']",
          { opacity: 0, x: 10 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
          0.04,
        );

        // 2. Headline
        tl.fromTo(
          "[data-animate='headline']",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
          0.04,
        );

        // 3. Main dual box grid entrance
        tl.to(
          "[data-animate='estimator-box']",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.42,
            ease: "power3.out",
          },
          0.08,
        );

        // 4. Staggered inner choices
        tl.to(
          "[data-animate='estimator-step']",
          {
            opacity: 1,
            x: 0,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.06,
          },
          0.14,
        );

        // 5. Staggered right column items
        tl.to(
          "[data-animate='estimator-right-item']",
          {
            opacity: 1,
            x: 0,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.05,
          },
          0.18,
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
              trigger: sectionRef.current,
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
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="estimator"
      className="relative w-full py-16 md:py-24 px-6 sm:px-10 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      <div className="max-w-[1353px] mx-auto space-y-12 md:space-y-16">
        {/* Section Header Marker */}
        <div data-animate="header-marker" className="flex items-center gap-4">
          <span
            data-animate="header-num"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono"
          >
            06
          </span>
          <span
            data-animate="header-line"
            className="w-10 h-px bg-white/30 origin-left"
          />
          <span
            data-animate="header-title"
            className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80"
          >
            Project Estimator
          </span>
        </div>

        {/* Section Heading */}
        <div>
          <h2
            data-animate="headline"
            className="text-3xl sm:text-5xl lg:text-[62px] font-bold text-white tracking-tight leading-tight uppercase"
          >
            Let&apos;s Estimate Your Project.
          </h2>
        </div>

        {/* Interactive Dual Box Grid */}
        <div
          data-animate="estimator-box"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-white/20 rounded-md overflow-hidden bg-[#070b12] opacity-0 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
        >
          {/* Left Column: Interactive Selector Choices */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-10 border-b lg:border-b-0 lg:border-r border-white/15">
            {/* Step 1: Need */}
            <div data-animate="estimator-step" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-brand font-semibold">
                  01
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white">
                  WHAT DO YOU NEED?
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {needsList.map((need) => {
                  const isSelected = selectedNeed === need;
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => setSelectedNeed(need)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 border cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? "bg-brand text-[#1C2633] border-brand font-semibold shadow-[0_0_15px_rgba(196,162,84,0.25)]"
                          : "bg-[#0a0f18] text-white/80 border-white/15 hover:border-brand/50 hover:text-white"
                      }`}
                    >
                      <span>{need}</span>
                      <span
                        className={`w-2 h-2 rounded-[1px] ${
                          isSelected ? "bg-[#1C2633]" : "border border-white/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Scope */}
            <div data-animate="estimator-step" className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-brand font-semibold">
                  02
                </span>
                <span className="text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white">
                  PROJECT SCOPE
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {scopesList.map((scope) => {
                  const isSelected = selectedScope === scope;
                  return (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setSelectedScope(scope)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 border cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? "bg-brand text-[#1C2633] border-brand font-semibold shadow-[0_0_15px_rgba(196,162,84,0.25)]"
                          : "bg-[#0a0f18] text-white/80 border-white/15 hover:border-brand/50 hover:text-white"
                      }`}
                    >
                      <span>{scope}</span>
                      <span
                        className={`w-2 h-2 rounded-[1px] ${
                          isSelected ? "bg-[#1C2633]" : "border border-white/30"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: What do you already have? */}
            <div data-animate="estimator-step" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-brand font-semibold">
                    03
                  </span>
                  <span className="text-xs sm:text-sm font-semibold tracking-[2px] uppercase text-white">
                    WHAT DO YOU ALREADY HAVE?
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
                  MULTI-SELECT
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {haveList.map((have) => {
                  const isSelected = selectedHave.includes(have);
                  return (
                    <button
                      key={have}
                      type="button"
                      onClick={() => toggleHave(have)}
                      className={`flex items-center justify-between px-5 py-3.5 rounded-sm text-sm font-medium transition-all duration-200 border cursor-pointer active:scale-[0.99] ${
                        isSelected
                          ? "bg-brand text-[#1C2633] border-brand font-semibold shadow-[0_0_15px_rgba(196,162,84,0.25)]"
                          : "bg-[#0a0f18] text-white/80 border-white/15 hover:border-brand/50 hover:text-white"
                      }`}
                    >
                      <span>{have}</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-[2px] flex items-center justify-center text-[10px] font-bold transition-colors ${
                          isSelected
                            ? "bg-[#1C2633] text-brand"
                            : "border border-white/30"
                        }`}
                      >
                        {isSelected && "✓"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-white/40 font-mono tracking-wide">
              Select all that apply. No contact details required.
            </p>
          </div>

          {/* Right Column: Outline Sidebar */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6 bg-[#090e17]/80">
            <div>
              {/* Header */}
              <div
                data-animate="estimator-right-item"
                className="flex items-center justify-between pb-6 border-b border-white/10"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-4 h-4 text-brand"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="6" y1="12" x2="21" y2="12" />
                    <line x1="9" y1="18" x2="21" y2="18" />
                  </svg>
                  <span className="text-xs font-semibold tracking-[2px] uppercase text-white font-mono">
                    YOUR PROJECT OUTLINE
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/40">
                  ILLUSTRATIVE
                </span>
              </div>

              {/* Dynamic Summary Tag */}
              <div
                data-animate="estimator-right-item"
                className="py-5 border-b border-white/10"
              >
                <span className="text-sm font-medium text-white/90">
                  {selectedNeed} / {selectedScope} scope /{" "}
                  {selectedHave.join(", ")}
                </span>
              </div>

              {/* Timeline metric */}
              <div
                data-animate="estimator-right-item"
                className="py-5 border-b border-white/10 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                    ESTIMATED TIMELINE
                  </span>
                  {selectedHave.includes("Existing Design") &&
                    !selectedHave.includes("Idea Only") && (
                      <span className="text-[10px] font-mono text-brand font-semibold">
                        ⚡ DESIGN ACCELERATED
                      </span>
                    )}
                </div>
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-4xl sm:text-5xl font-extrabold text-brand font-mono tracking-tight">
                    {getTimelineWeeks()}
                  </span>
                  <span className="text-lg text-white/60 font-medium">
                    Weeks
                  </span>
                </div>
                {selectedHave.includes("Existing System") && (
                  <span className="text-[11px] font-mono text-white/40 block pt-0.5">
                    ↳ Includes legacy system integration &amp; data sync
                  </span>
                )}
              </div>

              {/* Scope Deliverables */}
              <div
                data-animate="estimator-right-item"
                className="py-5 border-b border-white/10 space-y-2.5"
              >
                <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                  INCLUDED IN SCOPE
                </span>
                <ul className="space-y-1.5 pt-1">
                  {currentSpec.deliverables.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-white/80"
                    >
                      <span className="text-brand font-mono font-bold leading-none mt-0.5">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Investment metric: Blurred for direct consultation */}
              <div
                data-animate="estimator-right-item"
                className="py-5 border-b border-white/10 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold tracking-[2px] uppercase text-white/50 font-mono">
                    ESTIMATED INVESTMENT
                  </span>
                  <span className="text-[10px] font-mono tracking-wider uppercase text-brand flex items-center gap-1.5 bg-brand/10 px-2 py-0.5 rounded-xs border border-brand/20">
                    <svg
                      className="w-2.5 h-2.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    CONFIDENTIAL
                  </span>
                </div>

                <div className="relative py-1">
                  {/* Blurred price value underneath */}
                  <div
                    aria-hidden="true"
                    className="flex items-baseline gap-3 filter blur-[9px] select-none pointer-events-none opacity-50"
                  >
                    <span className="text-4xl sm:text-5xl font-extrabold text-brand font-mono tracking-tight">
                      {currentSpec.egp}
                    </span>
                    <span className="text-lg text-white/60 font-medium font-mono">
                      EGP
                    </span>
                  </div>

                  {/* High-end Overlay pill inviting client to talk directly */}
                  <div className="absolute inset-0 flex items-center justify-start">
                    <Link
                      href="#schedule"
                      className="group/blur inline-flex items-center gap-2.5 px-4 py-2 rounded-sm bg-[#070b12]/90 border border-brand/50 hover:border-brand hover:bg-[#0c1422] transition-all duration-300 shadow-[0_0_20px_rgba(196,162,84,0.12)] cursor-pointer"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-brand transition-transform duration-200 group-hover/blur:scale-110"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-xs font-mono font-semibold tracking-[2px] uppercase text-white group-hover/blur:text-brand transition-colors duration-200">
                        SCHEDULE CALL FOR EXACT QUOTE
                      </span>
                      <span className="text-xs text-brand transition-transform duration-200 group-hover/blur:translate-x-0.5 font-mono">
                        →
                      </span>
                    </Link>
                  </div>
                </div>

                <p className="text-[11px] text-white/50 font-normal leading-relaxed pt-1">
                  Every business operates differently. We discuss scope directly
                  on a call to provide fixed, fair pricing with zero surprises.
                </p>
              </div>

              {/* Disclaimer */}
              <p
                data-animate="estimator-right-item"
                className="text-[11px] text-white/40 font-normal leading-relaxed pt-4"
              >
                Initial estimate only. Final scope, timeline and investment are
                confirmed after a discovery conversation.
              </p>
            </div>

            {/* CTA Button */}
            <div data-animate="estimator-right-item" className="pt-2">
              <Link
                href="#schedule"
                className="group/cta w-full flex items-center justify-center gap-3 bg-brand hover:bg-brand/90 text-[#1C2633] font-semibold text-xs sm:text-sm tracking-[2px] uppercase py-4 rounded-sm transition-all duration-200 shadow-sm hover:shadow-[0_0_24px_rgba(196,162,84,0.3)]"
              >
                <span>SCHEDULE CONVERSATION</span>
                <span className="text-base leading-none transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5">
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
