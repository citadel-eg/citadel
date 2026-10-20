"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import {
  type CaseStudyData,
  getProjects,
  mapSanityToCaseStudy,
} from "@/lib/sanity";
import CircularCarousel, {
  CircularCarouselItem,
  CircularCarouselRef,
} from "./CircularCarousel";

export type { CaseStudyData };

export interface CaseStudyProps {
  sectionNumber?: string;
  sectionTitle?: string;
  headline?: string;
  projects?: CaseStudyData[];
}

export function CaseStudy({
  sectionNumber = "07",
  sectionTitle = "CASE STUDIES",
  headline = "PROBLEM → SYSTEM → RESULT.",
  projects,
}: CaseStudyProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const carouselStageRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<CircularCarouselRef>(null);

  const [clientCases, setClientCases] = useState<CaseStudyData[] | null>(null);
  const [clientLoading, setClientLoading] = useState<boolean>(!projects);
  const [activeIndex, setActiveIndex] = useState(0);
  const [ringInView, setRingInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const cases = useMemo(
    () => projects ?? clientCases ?? [],
    [projects, clientCases],
  );
  const loading = projects ? false : clientLoading;

  useEffect(() => {
    if (projects) return;
    let isMounted = true;
    getProjects()
      .then((sanityProjects) => {
        if (!isMounted) return;
        setClientCases(sanityProjects.map(mapSanityToCaseStudy));
        setClientLoading(false);
      })
      .catch((err) => {
        console.error("Error loading case studies:", err);
        if (!isMounted) return;
        setClientCases([]);
        setClientLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [projects]);

  const activeCase = cases[activeIndex] || cases[0];

  const carouselItems: CircularCarouselItem[] = useMemo(
    () =>
      cases.map((cs) => ({
        src: cs.src,
        alt: cs.alt,
        title: `${cs.number} — ${cs.name}`,
        subtitle: cs.category,
        mediaType: cs.mediaType,
        videoSrc: cs.videoSrc,
      })),
    [cases],
  );

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const handlePrev = useCallback(() => {
    carouselRef.current?.stepBy(-1);
  }, []);

  const handleNext = useCallback(() => {
    carouselRef.current?.stepBy(1);
  }, []);

  const handleSelect = useCallback((index: number) => {
    carouselRef.current?.focusIndex(index);
  }, []);

  // 1. Scroll Entrance Animation
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const hasHud = Boolean(
          sectionRef.current?.querySelector("[data-animate='case-hud']"),
        );
        const hasRing = Boolean(
          sectionRef.current?.querySelector("[data-animate='case-ring']"),
        );

        if (hasHud) {
          gsap.set("[data-animate='case-hud']", {
            opacity: 0,
            y: 16,
          });
        }
        if (hasRing) {
          gsap.set("[data-animate='case-ring']", {
            opacity: 0,
          });
        }

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
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.base,
              ease: motion.ease.out,
            },
            0.08,
          )
          .fromTo(
            "[data-animate='sub-copy']",
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.base,
              ease: motion.ease.out,
            },
            0.12,
          );

        if (hasRing) {
          tl.to(
            "[data-animate='case-ring']",
            {
              opacity: 1,
              duration: motion.duration.base,
              ease: motion.ease.out,
            },
            0.16,
          );
        }

        if (hasHud) {
          tl.to(
            "[data-animate='case-hud']",
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.base,
              ease: motion.ease.out,
            },
            0.2,
          );
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [cases.length] },
  );

  // 2. Active Case Change Animation
  useGSAP(
    () => {
      if (!detailsRef.current || !activeCase) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const textElements =
          detailsRef.current?.querySelectorAll("[data-switch-anim]");
        const lineElements =
          detailsRef.current?.querySelectorAll("[data-switch-line]");

        if (textElements && textElements.length > 0) {
          gsap.fromTo(
            textElements,
            { opacity: 0, y: 6 },
            {
              opacity: 1,
              y: 0,
              duration: motion.duration.fast,
              stagger: 0.02,
              ease: motion.ease.out,
            },
          );
        }

        if (lineElements && lineElements.length > 0) {
          gsap.fromTo(
            lineElements,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: motion.duration.base,
              stagger: 0.03,
              ease: motion.ease.out,
            },
          );
        }
      });

      return () => {
        mm.revert();
      };
    },
    { scope: detailsRef, dependencies: [activeIndex, activeCase?.id] },
  );

  const hasCases = cases.length > 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#05070a] text-white py-16 sm:py-20 lg:py-24 border-t border-white/15 overflow-hidden"
    >
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header Block */}
        <div className="space-y-4 mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center gap-3">
            <span
              data-animate="header-num"
              className="text-xs font-mono font-bold tracking-[2px] text-brand uppercase"
            >
              {sectionNumber}
            </span>
            <div
              data-animate="header-line"
              className="w-8 h-px bg-white/20 origin-left"
            />
            <span
              data-animate="header-title"
              className="text-xs font-mono font-medium tracking-[2px] text-white/50 uppercase"
            >
              {sectionTitle}
            </span>
          </div>

          <h2
            data-animate="headline"
            className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white uppercase max-w-4xl"
          >
            {headline}
          </h2>

          <p
            data-animate="sub-copy"
            className="text-xs sm:text-sm text-white/60 max-w-2xl leading-relaxed"
          >
            A selective look at systems engineered for high-consequence
            operations. Drag to rotate the panorama or select any case study
            below.
          </p>
        </div>

        {/* Dynamic Content: Sanity CMS Projects or Clean Empty State (NO HARDCODED FALLBACK) */}
        {!hasCases ? (
          <div className="py-20 sm:py-28 px-6 max-w-2xl mx-auto text-center border border-white/10 rounded-md bg-white/2 backdrop-blur-xs">
            {loading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-[2px] font-mono text-white/50">
                  Connecting to Citadel CMS...
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-[11px] font-mono tracking-[2px] uppercase text-brand">
                  PORTFOLIO / SANITY CMS
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  No Published Case Studies Yet
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                  Projects published in Sanity Studio will appear here live. Open{" "}
                  <code className="text-brand font-mono text-xs px-1.5 py-0.5 rounded-sm bg-white/5 border border-white/10">
                    studio-citadel-portfolio
                  </code>{" "}
                  to publish your first case study.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* 3D Circular Carousel Showcase */
          <div
            ref={carouselStageRef}
            data-animate="case-ring"
            className="relative w-full overflow-visible pb-2 sm:pb-4 md:pb-6"
          >
            {/* Top gradient vignette to blend into dark bg */}
            <div className="absolute top-0 left-0 right-0 h-16 sm:h-24 bg-linear-to-b from-[#05070a] to-transparent z-10 pointer-events-none" />

            {/* Carousel Core */}
            <div className="relative w-full flex items-center justify-center">
              <CircularCarousel
                ref={carouselRef}
                items={carouselItems}
                preset="panorama"
                intro="assemble"
                playIntro={ringInView}
                autoplay="off"
                draggable={true}
                snap={true}
                momentum={0.88}
                speed={0.7}
                curve={isDesktop ? 0.35 : 0.45}
                tilt={isDesktop ? 0 : 0.02}
                perspective={isDesktop ? 2200 : 1600}
                cardWidth={isDesktop ? 440 : 280}
                aspectRatio={16 / 10}
                gap={isDesktop ? 36 : 18}
                bottomSpace={isDesktop ? 180 : 0}
                onChange={setActiveIndex}
                className="w-full"
              />
            </div>

            {/* Bottom gradient vignette for smooth transition to footer */}
            <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-linear-to-t from-[#05070a] to-transparent z-10 pointer-events-none" />

            {/* Active Case Breakdown HUD */}
            <div
              ref={detailsRef}
              data-animate="case-hud"
              className={`w-full z-20 pointer-events-auto transition-all duration-300 ${
                isDesktop
                  ? "absolute bottom-4 left-0 right-0 px-4 sm:px-6 md:px-8 lg:px-12"
                  : "relative mt-4 px-2 sm:px-0"
              }`}
            >
              <div className="max-w-6xl mx-auto rounded-md bg-[#05070a]/92 backdrop-blur-md border border-white/15 p-4 sm:p-6 md:p-7 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
                  {/* Left 4 Cols: Active Project Identity & Navigation */}
                  <div className="lg:col-span-4 space-y-2 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          data-switch-anim
                          className="text-xs font-mono font-bold tracking-[2px] text-brand uppercase"
                        >
                          {activeCase.number} / {activeCase.category}
                        </span>
                        {activeCase.metrics && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-brand/10 border border-brand/25 text-[10px] font-mono font-semibold text-brand uppercase tracking-wider">
                            {activeCase.metrics}
                          </span>
                        )}
                      </div>

                      {/* Step Controls (Prev / Next & Counter) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handlePrev}
                          aria-label="Previous project"
                          className="p-1.5 rounded-sm bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <span className="text-[10px] font-mono text-white/50 px-0.5">
                          {activeCase.number} /{" "}
                          {String(cases.length).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={handleNext}
                          aria-label="Next project"
                          className="p-1.5 rounded-sm bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <h3
                      data-switch-anim
                      className="text-base sm:text-lg text-balance font-bold text-white leading-snug tracking-tight"
                    >
                      {activeCase.headline}
                    </h3>

                    {/* Dot Indicators */}
                    <div className="flex items-center gap-1.5 pt-0.5">
                      {cases.map((cs, idx) => (
                        <button
                          key={cs.id}
                          type="button"
                          onClick={() => handleSelect(idx)}
                          aria-label={`Jump to ${cs.name}`}
                          className={`h-1 transition-all duration-300 rounded-full cursor-pointer ${
                            idx === activeIndex
                              ? "w-5 bg-brand"
                              : "w-1.5 bg-white/20 hover:bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right 8 Cols: 3-Column Problem → System → Result */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-6">
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
                        <p className="text-xs text-white/70 leading-relaxed">
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
                        <p className="text-xs text-white/70 leading-relaxed">
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
                        <p className="text-xs text-white/90 font-medium leading-relaxed">
                          {activeCase.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
