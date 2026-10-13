"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { CitadelLogo } from "./CitadelLogo";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import { useIntro } from "@/lib/intro-context";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const { isIntroActive, registerHeaderEntrance } = useIntro();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      let handleVisibilityChange: (() => void) | null = null;
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Master Header Entrance Timeline coordinated with preloader exit
        const headerTl = gsap.timeline({
          paused: isIntroActive,
          defaults: { ease: motion.ease.out },
        });

        // 1. Header bar glides in from y: -16
        headerTl.fromTo(
          headerRef.current,
          { opacity: 0, y: -16 },
          {
            opacity: 1,
            y: 0,
            duration: motion.duration.base,
          },
          0,
        );

        // 2. Citadel Logo Mark 8 tiers illuminate in rapid sequence from foundation (1) to crown (8)
        headerTl.fromTo(
          "[data-logo-tier]",
          { opacity: 0, scaleX: 0.25, transformOrigin: "center center" },
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.35,
            stagger: 0.035,
            ease: "power2.out",
          },
          0.08,
        );

        // 3. Citadel Typography reveals with crisp tracking
        headerTl.fromTo(
          "[data-logo-text='title']",
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" },
          0.18,
        );

        headerTl.fromTo(
          "[data-logo-text='sub']",
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
          0.26,
        );

        registerHeaderEntrance(() => {
          headerTl.restart();
        });

        if (!isIntroActive) {
          headerTl.progress(1);
        }

        handleVisibilityChange = () => {
          if (document.visibilityState === "visible") {
            if (!isIntroActive) {
              headerTl.play();
            }
          }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        // Interactive hover micro-animation: cascading gold wave across the 8 Citadel tiers
        const logoLink = document.querySelector("[data-logo-link]");
        const logoTiers = document.querySelectorAll("[data-logo-tier]");
        const logoMark = document.querySelector("[data-logo-mark]");

        let isHovering = false;
        const handleMouseEnter = () => {
          if (isHovering) return;
          isHovering = true;
          if (logoMark) {
            gsap.to(logoMark, { y: -2, duration: 0.2, ease: "power2.out" });
          }
          if (logoTiers.length > 0) {
            gsap.to(logoTiers, {
              fill: "#C4A254",
              duration: 0.15,
              stagger: {
                each: 0.03,
                from: "start",
                yoyo: true,
                repeat: 1,
              },
              ease: "power1.out",
              onComplete: () => {
                isHovering = false;
              },
            });
          }
        };

        const handleMouseLeave = () => {
          if (logoMark) {
            gsap.to(logoMark, { y: 0, duration: 0.25, ease: "power2.out" });
          }
          gsap.to(logoTiers, {
            fill: "#FFFFFF",
            duration: 0.25,
            ease: "power1.out",
            overwrite: "auto",
            onComplete: () => {
              isHovering = false;
            },
          });
        };

        // Periodic ambient shimmer animation: repeats every 6 seconds to keep the logo alive
        let idlePulseTimer: ReturnType<typeof setInterval> | null = null;
        const playPeriodicShimmer = () => {
          if (isHovering || document.hidden) return;
          if (!logoTiers || logoTiers.length === 0) return;

          gsap.to(logoTiers, {
            fill: "#C4A254",
            scaleX: 1.1,
            transformOrigin: "center center",
            duration: 0.16,
            stagger: {
              each: 0.035,
              from: "start",
              yoyo: true,
              repeat: 1,
            },
            ease: "power1.out",
            onComplete: () => {
              if (!isHovering) {
                gsap.set(logoTiers, { fill: "#FFFFFF", scaleX: 1 });
              }
            },
          });
        };

        // Start repeating pulse after initial header entrance
        idlePulseTimer = setInterval(playPeriodicShimmer, 6000);

        if (logoLink) {
          logoLink.addEventListener("mouseenter", handleMouseEnter);
          logoLink.addEventListener("mouseleave", handleMouseLeave);
        }

        // Active section tracking
        const sections: { id: string; target: string }[] = [
          { id: "company", target: "#company" },
          { id: "services", target: "#services" },
          { id: "work", target: "#work" },
        ];

        sections.forEach(({ id, target }) => {
          const el = document.querySelector(target);
          if (el) {
            ScrollTrigger.create({
              trigger: el,
              start: "top 60%",
              end: "bottom 40%",
              onToggle: (self) => {
                if (self.isActive) {
                  setActiveSection(id);
                }
              },
            });
          }
        });

        // Top of page triggers "home"
        ScrollTrigger.create({
          start: 0,
          end: 400,
          onToggle: (self) => {
            if (self.isActive) {
              setActiveSection("home");
            }
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(headerRef.current, { opacity: 1, y: 0 });
        gsap.set("[data-logo-tier]", {
          opacity: 1,
          scaleX: 1,
          fill: "#FFFFFF",
        });
        gsap.set("[data-logo-text]", { opacity: 1, x: 0 });
      });

      return () => {
        if (handleVisibilityChange) {
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );
        }
        const logoLink = document.querySelector("[data-logo-link]");
        if (logoLink) {
          // Remove listener targets during unmount
          logoLink.replaceWith(logoLink.cloneNode(true));
        }
        mm.revert();
      };
    },
    { scope: headerRef },
  );

  const navLinks = [
    { label: "Home", href: "#", key: "home" },
    { label: "Company", href: "#company", key: "company" },
    { label: "Services", href: "#services", key: "services" },
    { label: "Work", href: "#work", key: "work" },
  ];

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-[#05070a]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="max-w-[1440px] mx-auto h-20 px-6 sm:px-10 flex items-center justify-between relative">
        <Link
          href="/"
          data-logo-link
          className="flex items-center gap-2 group transition-opacity hover:opacity-95"
        >
          <CitadelLogo />
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.key;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-[13px] font-medium tracking-tight transition-colors ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-brand rounded-full transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="#schedule"
            className="inline-flex items-center justify-center border border-white/80 hover:border-brand hover:text-brand px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-[2px] text-white uppercase transition-colors"
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </header>
  );
}
