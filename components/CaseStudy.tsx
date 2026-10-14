"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import CircularCarousel, { CircularCarouselItem } from "./CircularCarousel";

interface CaseStudyData {
  id: string;
  number: string;
  name: string;
  category: string;
  headline: string;
  src: string;
  alt: string;
  problem: string;
  system: string;
  result: string;
  metrics?: string;
}

const CASE_STUDIES: CaseStudyData[] = [
  {
    id: "galaxy-store",
    number: "01",
    name: "Galaxy Store",
    category: "Dashboard & Website",
    headline: "A Storefront. An Operation. A Human Connection.",
    src: "/galaxy-store.png",
    alt: "Galaxy Store Case Study - Dashboard and website preview",
    problem:
      "Dispatch ran through 14 shared spreadsheets and fragmented phone calls.",
    system:
      "Unified customer storefront paired with a real-time internal operations dashboard.",
    result:
      "Streamlined course-commerce & automated daily fulfillment operations.",
    metrics: "14 → 1 Unified Workflow",
  },
  {
    id: "viggo-vet",
    number: "02",
    name: "Viggo Vet",
    category: "Multi-Tenant SaaS",
    headline: "Modernizing Clinic Operations At Scale.",
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop",
    alt: "Viggo Vet Multi-Tenant Platform Preview",
    problem:
      "Fragmented patient records and manual appointment scheduling across clinics.",
    system:
      "Multi-tenant web architecture with modular UI components and role-based access.",
    result:
      "Centralized veterinary management with zero cross-tenant data friction.",
    metrics: "Multi-Tenant Architecture",
  },
  {
    id: "nexus-ledger",
    number: "03",
    name: "Nexus Ledger",
    category: "Fintech Analytics",
    headline: "High-Frequency Data Turned Into Clarity.",
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop",
    alt: "Nexus Ledger Analytics Interface",
    problem:
      "Delayed financial reporting caused bottlenecks during peak reconciliation hours.",
    system:
      "Real-time streaming telemetry dashboard with automated anomaly detection.",
    result: "Sub-second reporting latency and 60% faster audit sign-offs.",
    metrics: "<1s Telemetry Latency",
  },
  {
    id: "atlas-logistics",
    number: "04",
    name: "Atlas Fleet",
    category: "Supply Chain OS",
    headline: "Predictive Routing For Global Freight.",
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=900&q=80&auto=format&fit=crop",
    alt: "Atlas Fleet Supply Chain Dashboard",
    problem:
      "Blind spots in last-mile transit led to costly SLA penalties and idle fleet time.",
    system:
      "Geospatial tracking portal with automated dispatch and driver telemetry.",
    result:
      "Reduced idle fleet hours by 34% and eliminated manual check-in calls.",
    metrics: "-34% Idle Fleet Time",
  },
  {
    id: "pulse-commerce",
    number: "05",
    name: "Pulse Headless",
    category: "E-Commerce Engine",
    headline: "Sub-Second Storefronts Built For Conversion.",
    src: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=900&q=80&auto=format&fit=crop",
    alt: "Pulse Headless Commerce Storefront",
    problem:
      "Legacy monolithic templates throttled mobile checkout speeds and SEO rankings.",
    system:
      "Edge-cached Next.js storefront coupled with a custom design system.",
    result:
      "99+ Core Web Vitals score and a measurable lift in mobile checkout completion.",
    metrics: "99+ Core Web Vitals",
  },
  {
    id: "aether-ai",
    number: "06",
    name: "Aether Studio",
    category: "AI Video Pipeline",
    headline: "Prompt-To-Render Workflow In The Browser.",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&auto=format&fit=crop",
    alt: "Aether Studio AI Video Interface",
    problem:
      "Content teams juggled disconnected tools to storyboard, generate, and cut clips.",
    system:
      "Timeline-driven web studio with real-time scene queuing and asset versioning.",
    result:
      "Cut production turnaround from days to minutes with consistent visual output.",
    metrics: "10x Faster Render Flow",
  },
  {
    id: "kinetix-cloud",
    number: "07",
    name: "Kinetix Cloud",
    category: "DevOps Control Plane",
    headline: "Zero-Downtime Deployments Visualized.",
    src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&q=80&auto=format&fit=crop",
    alt: "Kinetix Cloud Infrastructure Dashboard",
    problem:
      "Engineers lacked unified visibility across multi-region container clusters.",
    system:
      "Interactive topology graph with instant rollback triggers and live log streaming.",
    result:
      "Cut incident triage time by 48% across distributed engineering teams.",
    metrics: "-48% MTTR",
  },
  {
    id: "verve-health",
    number: "08",
    name: "Verve Portal",
    category: "Patient Telehealth",
    headline: "Seamless Care From Booking To Follow-Up.",
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&auto=format&fit=crop",
    alt: "Verve Telehealth Patient Portal",
    problem:
      "High patient drop-off rates during complex intake forms and video onboarding.",
    system:
      "One-click WebRTC consultation room integrated with automated digital intake.",
    result:
      "Boosted completed virtual consultations by 41% within the first quarter.",
    metrics: "+41% Completion Rate",
  },
];

const CAROUSEL_ITEMS: CircularCarouselItem[] = CASE_STUDIES.map((cs) => ({
  src: cs.src,
  alt: cs.alt,
  title: `${cs.number} — ${cs.name}`,
  subtitle: cs.category,
}));

export interface CaseStudyProps {
  sectionNumber?: string;
  sectionTitle?: string;
  headline?: string;
}

export function CaseStudy({
  sectionNumber = "07",
  sectionTitle = "CASE STUDIES",
  headline = "PROBLEM → SYSTEM → RESULT.",
}: CaseStudyProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const carouselStageRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [ringInView, setRingInView] = useState(false);
  const activeCase = CASE_STUDIES[activeIndex] || CASE_STUDIES[0];

  // 1. Scroll Entrance Animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set("[data-animate='case-hud']", {
          opacity: 0,
          y: 16,
        });
        gsap.set("[data-animate='case-ring']", {
          opacity: 0,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: motion.scrollStart,
            once: true,
            onEnter: () => setRingInView(true),
            onEnterBack: () => setRingInView(true),
            onRefresh: (self) => {
              if (self.progress > 0) {
                setRingInView(true);
              }
            },
          },
        });

        tl.fromTo(
          "[data-animate='header-num']",
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: motion.duration.base,
            ease: motion.ease.out,
          },
          0,
        )
          .fromTo(
            "[data-animate='header-line']",
            { scaleX: 0 },
            { scaleX: 1, duration: 0.3, ease: motion.ease.out },
            0.02,
          )
          .fromTo(
            "[data-animate='header-title']",
            { opacity: 0, x: 10 },
            {
              opacity: 1,
              x: 0,
              duration: motion.duration.base,
              ease: motion.ease.out,
            },
            0.04,
          )
          .fromTo(
            "[data-animate='headline']",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.45, ease: motion.ease.emphasis },
            0.05,
          )
          .to(
            "[data-animate='case-ring']",
            {
              opacity: 1,
              duration: 0.35,
              ease: motion.ease.out,
            },
            0,
          )
          .to(
            "[data-animate='case-hud']",
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: motion.ease.out,
            },
            0.35,
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setRingInView(true);
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
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  // 2. Smooth Crossfade when Active Case Switches
  useGSAP(
    () => {
      if (!detailsRef.current) return;

      const items = detailsRef.current.querySelectorAll("[data-switch-anim]");
      const lines = detailsRef.current.querySelectorAll("[data-switch-line]");

      gsap.killTweensOf([items, lines]);

      gsap.fromTo(
        items,
        {
          opacity: 0,
          y: 8,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.36,
          stagger: 0.04,
          ease: "power3.out",
          clearProps: "filter",
        },
      );

      gsap.fromTo(
        lines,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.45,
          stagger: 0.05,
          ease: "expo.out",
        },
      );
    },
    { dependencies: [activeIndex], scope: detailsRef },
  );

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative w-full py-10 md:py-14 bg-[#05070a] border-b border-white/10 overflow-hidden"
    >
      {/* Ambient Center Spotlight behind the Panorama Ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-105 rounded-full bg-brand/[0.07] blur-[150px]"
      />

      {/* ==================== TOP HEADER ==================== */}
      <div className="px-6 relative z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap flex-col items-start gap-4 sm:gap-6">
            <div
              data-animate="header-marker"
              className="flex items-center gap-3"
            >
              <span
                data-animate="header-num"
                className="text-xs font-semibold tracking-[3px] uppercase text-brand font-mono"
              >
                {sectionNumber}
              </span>
              <span
                data-animate="header-line"
                className="w-8 h-px bg-white/30 origin-left"
              />
              <span
                data-animate="header-title"
                className="text-xs font-semibold tracking-[3px] uppercase text-white/80"
              >
                {sectionTitle}
              </span>
            </div>

            <h2
              data-animate="headline"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-none uppercase"
            >
              {headline}
            </h2>
          </div>
        </div>
      </div>

      {/* ==================== 3D PANORAMA RING STAGE (WITH ACTIVE CASE HUD INSIDE) ==================== */}
      <div
        ref={carouselStageRef}
        data-animate="case-ring"
        className="relative w-full z-10 text-white mt-2 sm:mt-4"
      >
        <div style={{ width: "100%", height: "620px", position: "relative" }}>
          <CircularCarousel
            items={CAROUSEL_ITEMS}
            preset="panorama"
            intro="rise"
            playIntro={ringInView}
            cardWidth={228}
            aspectRatio={1.333}
            speed={14}
            gap={22}
            tilt={2}
            perspective={1800}
            parallax={0}
            fadeColor="#05070a"
            bottomSpace={190}
            className="overflow-visible!"
            onChange={(index) => setActiveIndex(index)}
          >
            {/* ==================== ACTIVE CASE BREAKDOWN HUD (DIRECTLY UNDER ACTIVE IMAGE) ==================== */}
            <div className="max-w-6xl mx-auto absolute inset-x-0 bottom-2 sm:bottom-20 z-20 pointer-events-none">
              <div className=" px-6 pointer-events-auto">
                <div
                  ref={detailsRef}
                  data-animate="case-hud"
                  className="relative rounded-xl bg-[#05070a]/85 border border-white/10 backdrop-blur-md p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">
                    {/* Left 4 Cols: Active Project Title & Badges */}
                    <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-3 lg:pb-0 lg:pr-6">
                      <div
                        data-switch-anim
                        className="flex flex-wrap items-center gap-2"
                      >
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-white/10 border border-white/15 text-[10px] font-mono font-semibold text-white uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                          {activeCase.number} — {activeCase.name}
                        </span>
                      </div>

                      <h3
                        data-switch-anim
                        className="text-lg text-balance font-bold text-white leading-snug tracking-tight"
                      >
                        {activeCase.headline}
                      </h3>
                    </div>

                    {/* Right 8 Cols: 3-Column Problem → System → Result */}
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                      {/* 01 / PROBLEM */}
                      <div className="relative pt-2.5 space-y-1">
                        <div
                          data-switch-line
                          className="absolute top-0 left-0 right-0 h-px bg-white/20 origin-left"
                        />
                        <div data-switch-anim className="space-y-1">
                          <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white/90 font-mono block">
                            01 / PROBLEM
                          </span>
                          <p className="text-xs text-white/70 leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {activeCase.problem}
                          </p>
                        </div>
                      </div>

                      {/* 02 / SYSTEM */}
                      <div className="relative pt-2.5 space-y-1">
                        <div
                          data-switch-line
                          className="absolute top-0 left-0 right-0 h-px bg-white/20 origin-left"
                        />
                        <div data-switch-anim className="space-y-1">
                          <span className="text-[11px] font-semibold tracking-[2px] uppercase text-white/90 font-mono block">
                            02 / SYSTEM
                          </span>
                          <p className="text-xs text-white/70 leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {activeCase.system}
                          </p>
                        </div>
                      </div>

                      {/* 03 / RESULT */}
                      <div className="relative pt-2.5 space-y-1">
                        <div
                          data-switch-line
                          className="absolute top-0 left-0 right-0 h-px bg-brand/70 origin-left"
                        />
                        <div data-switch-anim className="space-y-1">
                          <span className="text-[11px] font-semibold tracking-[2px] uppercase text-brand font-mono block">
                            03 / RESULT
                          </span>
                          <p className="text-xs text-white/90 font-medium leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {activeCase.result}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CircularCarousel>
        </div>
      </div>
    </section>
  );
}
