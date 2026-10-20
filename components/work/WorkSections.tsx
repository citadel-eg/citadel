"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import { CaseStudy } from "@/components/CaseStudy";
import type { CaseStudyData } from "@/lib/sanity";

// ==========================================
// 01 / WORK HERO
// ==========================================
export function WorkHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: motion.ease.out },
          delay: 0.1,
        });

        tl.fromTo(
          "[data-animate='work-badge']",
          { opacity: 0, y: -10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "opacity,transform",
          },
          0,
        );

        tl.fromTo(
          "[data-animate='work-title']",
          { opacity: 0, yPercent: 100 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            ease: "power3.out",
            clearProps: "opacity,transform",
          },
          0.06,
        );

        tl.fromTo(
          "[data-animate='work-copy']",
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "opacity,transform",
          },
          0.16,
        );

        tl.eventCallback("onComplete", () => {
          gsap.set("[data-animate]", { clearProps: "opacity,transform" });
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-animate]", { opacity: 1, y: 0, yPercent: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 px-6 sm:px-10 md:px-20 border-b border-white/10"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        <div className="lg:col-span-8 space-y-6">
          <span
            data-animate="work-badge"
            className="text-xs font-semibold tracking-[3px] uppercase text-brand font-mono block opacity-0"
          >
            CITADEL / SELECTED WORK
          </span>

          <div className="overflow-hidden py-1">
            <h1
              data-animate="work-title"
              className="text-3xl sm:text-5xl lg:text-[60px] font-bold text-white tracking-tight uppercase leading-[1.1] opacity-0"
            >
              UNDERSTANDING THE CHALLENGE CHANGES THE SOLUTION.
            </h1>
          </div>
        </div>

        <div className="lg:col-span-4 lg:pt-14">
          <p
            data-animate="work-copy"
            className="text-base sm:text-lg text-white/70 font-normal leading-relaxed opacity-0"
          >
            Explore our work through the problems, decisions, and outcomes
            behind each project—not just the final interface.
          </p>
        </div>
      </div>
    </section>
  );
}

// ==========================================
// 02 / PROJECT GALLERY (Case Study 3D Panorama)
// ==========================================

export function WorkProjectGallery({
  projects,
}: {
  projects?: CaseStudyData[];
} = {}) {
  return (
    <CaseStudy
      sectionNumber="02"
      sectionTitle="Project Gallery"
      headline="Understanding the challenge changes the solution."
      projects={projects}
    />
  );
}

// ==========================================
// 03 / CONNECTED AREAS OF WORK
// ==========================================
export function WorkConnectedAreas() {
  const sectionRef = useRef<HTMLElement>(null);

  const areas = [
    {
      id: "/01",
      title: "AUTOMATION",
      desc: "Reduce repeated work and unnecessary handoffs.",
    },
    {
      id: "/02",
      title: "OPERATIONS",
      desc: "Connect workflows, people, and information.",
    },
    {
      id: "/03",
      title: "DIGITAL PRODUCTS",
      desc: "Build products around needs proven in real work.",
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
            once: true,
          },
          onComplete: () => {
            if (sectionRef.current) {
              gsap.set(sectionRef.current.querySelectorAll("[data-animate]"), {
                clearProps: "all",
              });
            }
          },
        });

        tl.fromTo(
          "[data-animate='caw-marker']",
          { opacity: 0, x: -12 },
          { opacity: 1, x: 0, duration: motion.duration.fast },
          0,
        );

        tl.fromTo(
          "[data-animate='caw-sub']",
          { opacity: 0, y: motion.distanceSm },
          { opacity: 1, y: 0, duration: motion.duration.base },
          0.05,
        );

        tl.fromTo(
          "[data-animate='caw-card']",
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
        gsap.set("[data-animate]", { opacity: 1, y: 0 });
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
        <div className="space-y-4">
          <div data-animate="caw-marker" className="flex items-center gap-4">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-brand font-mono">
              03
            </span>
            <span className="w-10 h-px bg-white/30" />
            <span className="text-xs sm:text-[13px] font-semibold tracking-[3px] uppercase text-white/80">
              CONNECTED AREAS OF WORK
            </span>
          </div>

          <p
            data-animate="caw-sub"
            className="text-base sm:text-lg text-white/70 font-normal leading-relaxed"
          >
            The strongest projects connect business operations, the people doing
            the work, and the systems they rely on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {areas.map((a) => (
            <article
              key={a.id}
              data-animate="caw-card"
              className="border border-white/20 hover:border-brand/60 rounded-md p-8 gap-3 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_24px_rgba(196,162,84,0.12)] "
            >
              <div className="space-y-3">
                <span className="text-xs font-semibold tracking-[2px] text-brand font-mono">
                  {a.id}
                </span>
                <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                  {a.title}
                </h3>
              </div>
              <p className="text-sm sm:text-base text-white/70 font-normal leading-relaxed">
                {a.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
