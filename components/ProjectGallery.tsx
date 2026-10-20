"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export interface ProjectItem {
  id: string;
  num: string;
  name: string;
  headline: string;
  category: string;
  img: string;
  problem: string;
  system: string;
  result: string;
  badge?: string;
  link?: string;
}

export const FEATURED_PROJECTS: ProjectItem[] = [
  {
    id: "galaxy-store",
    num: "01 / GALAXY STORE",
    name: "Galaxy Store",
    headline: "A storefront. An operation. A human connection.",
    category: "CUSTOMER WEBSITE + INTERNAL DASHBOARD",
    img: "/galaxy-store.png",
    problem: "Dispatch ran through 14 shared spreadsheets and phone calls.",
    system: "Customer website + internal dashboard.",
    result: "Course-commerce & operations.",
    badge: "The Work Continues Beyond The Screen.",
  },
  {
    id: "viggo-vet",
    num: "02 / VIGGO VET",
    name: "Viggo Vet",
    headline: "Multi-tenant veterinary operations at scale.",
    category: "CLINIC OS + MULTI-TENANT ARCHITECTURE",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
    problem:
      "Fragmented patient records across clinics delayed diagnosis by hours.",
    system:
      "Multi-tenant unified scheduling with telemetry and role-based permissions.",
    result:
      "Instant cross-clinic record access with 40% reduction in appointment churn.",
    badge: "Multi-Tenant Clinic Architecture.",
  },
  {
    id: "nexus-ledger",
    num: "03 / NEXUS LEDGER",
    name: "Nexus Ledger",
    headline: "High-frequency streaming financial reconciliation.",
    category: "FINTECH TELEMETRY + REPORTING",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop",
    problem:
      "End-of-day batch processing left compliance teams blind during peak hours.",
    system:
      "Real-time stream processing with automated balance integrity audits.",
    result: "Sub-second ledger verification and 60% faster sign-offs.",
    badge: "<1s Telemetry Latency.",
  },
  {
    id: "atlas-fleet",
    num: "04 / ATLAS FLEET",
    name: "Atlas Fleet",
    headline: "Predictive routing and dispatch for global freight.",
    category: "SUPPLY CHAIN OS + TELEMETRY",
    img: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80&auto=format&fit=crop",
    problem:
      "Blind spots in last-mile transit caused costly SLA penalties and idle fleet time.",
    system:
      "Geospatial tracking portal with automated dispatch and driver telemetry.",
    result:
      "Reduced idle fleet hours by 34% and eliminated manual check-in calls.",
    badge: "-34% Idle Fleet Time.",
  },
  {
    id: "pulse-commerce",
    num: "05 / PULSE COMMERCE",
    name: "Pulse Headless",
    headline: "Sub-second storefronts built for conversion.",
    category: "E-COMMERCE ENGINE + DESIGN SYSTEM",
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&q=80&auto=format&fit=crop",
    problem:
      "Legacy monolithic templates throttled mobile checkout speeds and SEO rankings.",
    system:
      "Edge-cached Next.js storefront coupled with a custom modular design system.",
    result:
      "99+ Core Web Vitals score and a measurable lift in checkout completion.",
    badge: "99+ Core Web Vitals.",
  },
];

interface ProjectGalleryProps {
  sectionNumber?: string;
  sectionTitle?: string;
  headline?: string;
  showExploreAll?: boolean;
}

export function ProjectGallery({
  sectionNumber = "07",
  sectionTitle = "Project Gallery",
  headline = "Understanding the challenge changes the solution.",
  showExploreAll = true,
}: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const currentProject = FEATURED_PROJECTS[activeIdx] || FEATURED_PROJECTS[0];

  // 1. Scroll entrance reveal
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
          "[data-animate='pg-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='pg-headline']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: motion.ease.out },
          0.05,
        );

        tl.fromTo(
          "[data-animate='pg-visual']",
          { opacity: 0, scale: 0.97 },
          { opacity: 1, scale: 1, duration: 0.6, ease: motion.ease.out },
          0.1,
        );

        tl.fromTo(
          "[data-animate='pg-content']",
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.5, ease: motion.ease.out },
          0.15,
        );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, scale: 1, x: 0, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // 2. Smooth Crossfade & Staggered Reveal on Active Tab Switch
  useGSAP(
    () => {
      if (!detailsRef.current || !visualRef.current) return;

      const visualImage = visualRef.current.querySelector("[data-switch-img]");
      const contentItems =
        detailsRef.current.querySelectorAll("[data-switch-item]");
      const dividerLines =
        detailsRef.current.querySelectorAll("[data-switch-line]");

      gsap.killTweensOf([visualImage, contentItems, dividerLines]);

      if (visualImage) {
        gsap.fromTo(
          visualImage,
          { opacity: 0.35, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "power2.out" },
        );
      }

      gsap.fromTo(
        contentItems,
        { opacity: 0, y: 8, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.35,
          stagger: 0.04,
          ease: "power3.out",
          clearProps: "filter",
        },
      );

      gsap.fromTo(
        dividerLines,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.4, stagger: 0.05, ease: "expo.out" },
      );
    },
    { dependencies: [activeIdx], scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full py-16 md:py-24 px-6 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b border-white/10"
    >
      <div className="space-y-10 md:space-y-12">
        {/* ==================== SECTION HEADER & TABS ==================== */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-3">
            <div data-animate="pg-marker" className="flex items-center gap-4">
              <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
                {sectionNumber}
              </span>
              <span className="w-10 h-px bg-white/30" />
              <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
                {sectionTitle}
              </span>
            </div>

            {headline && (
              <h2
                data-animate="pg-headline"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight uppercase leading-snug"
              >
                {headline}
              </h2>
            )}
          </div>

          {/* Project Switcher Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            {FEATURED_PROJECTS.map((p, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`group relative px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/15 text-brand border border-brand/60 shadow-[0_0_12px_rgba(196,162,84,0.2)]"
                      : "text-white/60 hover:text-white hover:bg-white/5 border border-white/10"
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                    )}
                    0{idx + 1}
                    <span className="hidden md:inline text-white/40 group-hover:text-white/70">
                      / {p.name}
                    </span>
                  </span>
                </button>
              );
            })}

            {showExploreAll && (
              <Link
                href="/work"
                className="ml-2 px-3 py-1.5 rounded-sm text-xs font-mono tracking-wider text-brand hover:text-white border border-brand/30 hover:border-brand/70 hover:bg-brand/10 transition-colors inline-flex items-center gap-1.5"
              >
                VIEW ALL WORK →
              </Link>
            )}
          </div>
        </div>

        {/* ==================== FEATURED SHOWCASE STAGE ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left 6 Cols: Project Image Display with Stylized Container */}
          <div
            ref={visualRef}
            data-animate="pg-visual"
            className="lg:col-span-6 relative border border-white/20 rounded-md overflow-hidden  group aspect-16/10 flex items-center justify-center p-4 sm:p-8 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
          >
            {/* Ambient Background Glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-linear-to-tr from-[#05070a]/90 via-transparent to-brand/5 z-10"
            />

            {/* In-Frame Brand Watermark Title */}
            <div
              data-switch-item
              className="absolute top-4 left-6 z-20 pointer-events-none select-none"
            >
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white/20 font-sans block">
                {currentProject.name}
              </span>
            </div>

            {/* Main Visual Image */}
            <div
              data-switch-img
              className="relative w-full h-full flex items-center justify-center z-15"
            >
              <Image
                src={currentProject.img}
                alt={currentProject.name}
                fill
                className="object-contain p-2 group-hover:scale-[1.02] transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Bottom-Right Handwritten Style Badge Tag */}
            {currentProject.badge && (
              <div
                data-switch-item
                className="absolute bottom-4 right-4 z-20 px-3 py-1.5 rounded bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white/80 shadow-md"
              >
                {currentProject.badge}
              </div>
            )}
          </div>

          {/* Right 6 Cols: Structured Problem → System → Result Details */}
          <div
            ref={detailsRef}
            data-animate="pg-content"
            className="lg:col-span-6 flex flex-col space-y-6"
          >
            <div data-switch-item className="space-y-2">
              <span className="text-xs font-semibold tracking-[2px] uppercase text-brand font-mono block">
                {currentProject.num}
              </span>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                {currentProject.headline}
              </h3>

              <span className="text-xs font-semibold tracking-[2px] uppercase text-white/60 font-mono block">
                {currentProject.category}
              </span>
            </div>

            <div
              data-switch-line
              className="w-full h-px bg-white/20 origin-left"
            />

            {/* Problem, System, Result 3-Part Architecture Breakdown */}
            <div className="space-y-5">
              <div data-switch-item className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-brand font-mono block">
                  01 / PROBLEM
                </span>
                <p className="text-base text-white/80 font-normal leading-relaxed">
                  {currentProject.problem}
                </p>
              </div>

              <div data-switch-item className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-brand font-mono block">
                  02 / SYSTEM
                </span>
                <p className="text-base text-white/80 font-normal leading-relaxed">
                  {currentProject.system}
                </p>
              </div>

              <div data-switch-item className="space-y-1">
                <span className="text-xs font-semibold tracking-wider text-brand font-mono block">
                  03 / RESULT
                </span>
                <p className="text-base text-white/80 font-normal leading-relaxed">
                  {currentProject.result}
                </p>
              </div>
            </div>

            {/* Bottom Action Row */}
            <div
              data-switch-item
              className="pt-2 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-sm bg-brand text-[#1C2633] text-xs font-semibold font-mono tracking-wider hover:bg-brand/90 transition-colors inline-flex items-center gap-2"
              >
                DISCUSS A SIMILAR PROJECT →
              </Link>
              <Link
                href="/work"
                className="px-4 py-2.5 rounded-sm border border-white/15 text-white/80 hover:text-white hover:bg-white/5 text-xs font-mono tracking-wider transition-colors"
              >
                EXPLORE ALL CASE STUDIES
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
