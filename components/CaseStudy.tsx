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
  const [activeIndex, setActiveIndex] = useState(0);
  const [ringInView, setRingInView] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const cases = useMemo(() => {
    if (projects && projects.length > 0) return projects;
    if (clientCases && clientCases.length > 0) return clientCases;
    return [];
  }, [projects, clientCases]);

  useEffect(() => {
    if (projects && projects.length > 0) return;
    let isMounted = true;
    getProjects()
      .then((sanityProjects) => {
        if (!isMounted) return;
        if (sanityProjects && sanityProjects.length > 0) {
          setClientCases(sanityProjects.map(mapSanityToCaseStudy));
        }
      })
      .catch((err) => {
        console.error("Error loading case studies:", err);
      });
    return () => {
      isMounted = false;
    };
  }, [projects]);

  const activeCase = cases[activeIndex] || cases[0];

  // Ensure at least 6 carousel items so the 3D panorama ring has visible curved side-cards
  const carouselItems: CircularCarouselItem[] = useMemo(() => {
    if (!cases || cases.length === 0) return [];
    let list = cases;
    while (list.length > 0 && list.length < 6) {
      list = [...list, ...cases];
    }
    return list.map((cs) => ({
      src: cs.src,
      alt: cs.alt,
      title: `${cs.number} — ${cs.name}`,
      subtitle: cs.category,
      mediaType: cs.mediaType,
      videoSrc: cs.videoSrc,
    }));
  }, [cases]);

  // Activate ring intro immediately if section is already in viewport on mount
  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setRingInView(true);
      }
    }
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

  const handleCarouselChange = useCallback(
    (index: number) => {
      const actual = cases.length > 0 ? index % cases.length : 0;
      setActiveIndex(actual);
    },
    [cases.length],
  );

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

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#05070a] text-white py-8 sm:py-10 lg:py-12 border-t border-white/15 overflow-hidden"
    >
      {/* Ambient Center Spotlight behind the Panorama Ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-225 h-105 rounded-full bg-brand/[0.07] blur-[150px]"
      />

      {/* Container */}
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        {/* Header Block */}
        <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 lg:mb-6">
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
            className="text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white uppercase max-w-3xl"
          >
            {headline}
          </h2>

          <p
            data-animate="sub-copy"
            className="text-xs sm:text-sm text-white/60 max-w-xl leading-relaxed"
          >
            A selective look at systems engineered for high-consequence
            operations. Drag to rotate the panorama or select any case study
            below.
          </p>
        </div>

        {/* 3D Panorama Ring Stage */}
        <div
          ref={carouselStageRef}
          className="relative w-full text-white overflow-visible"
        >
          {/* Carousel Viewport Container */}
          <div
            data-animate="case-ring"
            className="relative w-full h-72.5 sm:h-[87.5] lg:h-140"
          >
            {/* Top gradient vignette to blend into dark bg */}
            <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 bg-linear-to-b from-[#05070a] to-transparent z-10 pointer-events-none" />

            <CircularCarousel
              ref={carouselRef}
              items={carouselItems}
              preset="panorama"
              intro="rise"
              playIntro={ringInView}
              cardWidth={isDesktop ? 440 : 230}
              aspectRatio={16 / 10}
              speed={10}
              gap={isDesktop ? 20 : 18}
              curve={0}
              tilt={0}
              perspective={1800}
              parallax={0}
              cornerRadius={8}
              fadeColor="#05070a"
              bottomSpace={isDesktop ? 200 : 0}
              className="overflow-visible!"
              onChange={handleCarouselChange}
            />

            {/* Bottom gradient vignette for carousel stage */}
            <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-14 bg-linear-to-t from-[#05070a] to-transparent z-10 pointer-events-none" />
          </div>

          {/* Active Case Breakdown HUD */}
          <div className="max-w-7xl mx-auto relative mt-3 sm:mt-4 lg:absolute lg:inset-x-0 lg:bottom-1 lg:mt-0 z-20 pointer-events-none">
            <div className="w-full pointer-events-auto">
              <div
                ref={detailsRef}
                data-animate="case-hud"
                className="w-full rounded-md bg-[#05070a]/92 backdrop-blur-md border border-white/15 p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
                  {/* Left 4 Cols: 4 distinct rows (Badges, Title, Metric Badge, Controls) */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-2 sm:space-y-3 border-b lg:border-b-0 lg:border-r border-white/10 pb-4 lg:pb-0 lg:pr-6">
                    {/* Row 1: Badges & Live Site */}
                    <div
                      data-switch-anim
                      className="flex flex-wrap items-center justify-between gap-2"
                    >
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-white/10 border border-white/15 text-[10px] font-mono font-semibold text-white uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                          {activeCase.number} — {activeCase.name}
                        </span>
                        {activeCase.category && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-brand/10 border border-brand/25 text-[10px] font-mono font-semibold text-brand uppercase tracking-wider">
                            {activeCase.category}
                          </span>
                        )}
                      </div>

                      {activeCase.link && (
                        <a
                          href={activeCase.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-white/5 hover:bg-brand/15 border border-white/10 hover:border-brand/40 text-[10px] font-mono text-white/70 hover:text-brand transition-colors cursor-pointer"
                        >
                          <span>LIVE SITE</span>
                          <svg
                            className="w-2.5 h-2.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 17L17 7M17 7H7M17 7V17"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    {/* Row 2: Headline / Title */}
                    <h3
                      data-switch-anim
                      className="text-sm sm:text-base md:text-lg text-balance font-bold text-white leading-snug tracking-tight"
                    >
                      {activeCase.headline}
                    </h3>

                    {/* Row 3: Key Metric Badge on dedicated row */}
                    {activeCase.metrics ? (
                      <div data-switch-anim className="flex items-center">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-brand/10 border border-brand/25 text-[10px] sm:text-[11px] font-mono font-medium text-brand tracking-wider max-w-full truncate"
                          title={activeCase.metrics}
                        >
                          <span>★</span>
                          <span className="truncate">{activeCase.metrics}</span>
                        </span>
                      </div>
                    ) : (
                      <div className="h-0" />
                    )}

                    {/* Row 4: Controls (Prev/Next & Dot Indicators) */}
                    <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
                      <div className="flex items-center gap-1">
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
                        <span className="text-[10px] font-mono text-white/50 px-1.5">
                          {String(activeIndex + 1).padStart(2, "0")} /{" "}
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

                      {/* Jump dots */}
                      <div className="flex items-center gap-1.5">
                        {cases.map((cs, idx) => (
                          <button
                            key={cs.id}
                            type="button"
                            onClick={() => handleSelect(idx)}
                            aria-label={`Jump to ${cs.name}`}
                            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                              idx === activeIndex
                                ? "w-5 sm:w-6 bg-brand"
                                : "w-1.5 bg-white/20 hover:bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right 8 Cols: 3-Column Problem → System → Result */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
                    {/* 01 / PROBLEM */}
                    <div className="relative pt-2 space-y-1">
                      <div
                        data-switch-line
                        className="absolute top-0 left-0 right-0 h-px bg-white/20 origin-left"
                      />
                      <div data-switch-anim className="space-y-1">
                        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[2px] uppercase text-white/90 font-mono block">
                          01 / PROBLEM
                        </span>
                        <p className="text-xs text-white/70 leading-relaxed line-clamp-4 sm:line-clamp-none">
                          {activeCase.problem}
                        </p>
                      </div>
                    </div>

                    {/* 02 / SYSTEM */}
                    <div className="relative pt-2 space-y-1">
                      <div
                        data-switch-line
                        className="absolute top-0 left-0 right-0 h-px bg-white/20 origin-left"
                      />
                      <div data-switch-anim className="space-y-1">
                        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[2px] uppercase text-white/90 font-mono block">
                          02 / SYSTEM
                        </span>
                        <p className="text-xs text-white/70 leading-relaxed line-clamp-4 sm:line-clamp-none">
                          {activeCase.system}
                        </p>
                      </div>
                    </div>

                    {/* 03 / RESULT */}
                    <div className="relative pt-2 space-y-1">
                      <div
                        data-switch-line
                        className="absolute top-0 left-0 right-0 h-px bg-brand/70 origin-left"
                      />
                      <div data-switch-anim className="space-y-1">
                        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[2px] uppercase text-brand font-mono block">
                          03 / RESULT
                        </span>
                        <p className="text-xs text-white/90 font-medium leading-relaxed line-clamp-4 sm:line-clamp-none">
                          {activeCase.result}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
