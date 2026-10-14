"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CitadelLogo } from "./CitadelLogo";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";
import { useIntro } from "@/lib/intro-context";

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const headerTlRef = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const { isIntroActive, registerHeaderEntrance } = useIntro();

  // Watch isIntroActive and visibility changes to ensure header is revealed
  useEffect(() => {
    if (!isIntroActive && headerTlRef.current) {
      if (headerTlRef.current.progress() === 0) {
        headerTlRef.current.play();
      }
    }
  }, [isIntroActive]);

  useEffect(() => {
    const handleVis = () => {
      if (
        document.visibilityState === "visible" &&
        !isIntroActive &&
        headerTlRef.current
      ) {
        if (
          headerTlRef.current.paused() ||
          headerTlRef.current.progress() < 1
        ) {
          headerTlRef.current.play();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVis);
    return () => document.removeEventListener("visibilitychange", handleVis);
  }, [isIntroActive]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(headerRef);
      const mm = gsap.matchMedia();
      let idlePulseTimer: ReturnType<typeof setInterval> | null = null;

      const logoLink = q("[data-logo-link]")[0] as HTMLElement | undefined;
      const logoTiers = q("[data-logo-tier]") as unknown as SVGPathElement[];
      const logoMark = q("[data-logo-mark]")[0] as unknown as SVGSVGElement | undefined;
      const logoTitle = q("[data-logo-text='title']");
      const logoSub = q("[data-logo-text='sub']");
      const logoText = q("[data-logo-text]");

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Master Header Entrance Timeline coordinated with preloader exit
        const headerTl = gsap.timeline({
          paused: isIntroActive,
          defaults: { ease: motion.ease.out },
        });
        headerTlRef.current = headerTl;

        // 1. Header bar glides in from y: -16
        headerTl.fromTo(
          headerRef.current,
          { opacity: 0, y: -16 },
          {
            opacity: 1,
            y: 0,
            duration: motion.duration.base,
            clearProps: "transform",
          },
          0,
        );

        // 2. Citadel Logo Mark 8 tiers illuminate in sequence from foundation (1) to crown (8)
        // Illuminating via gold-to-white fill cleanly preserves vector geometry without scaling SVG paths
        headerTl.fromTo(
          logoTiers,
          { opacity: 0, fill: "#C4A254" },
          {
            opacity: 1,
            fill: "#FFFFFF",
            duration: 0.35,
            stagger: 0.035,
            ease: "power2.out",
            clearProps: "all",
          },
          0.08,
        );

        // 3. Citadel Typography reveals with crisp tracking
        headerTl.fromTo(
          logoTitle,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.4, ease: "power2.out", clearProps: "transform" },
          0.18,
        );

        headerTl.fromTo(
          logoSub,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out", clearProps: "transform" },
          0.26,
        );

        registerHeaderEntrance(() => {
          if (headerTl.progress() === 0) {
            headerTl.play();
          } else if (headerTl.paused()) {
            headerTl.play();
          }
        });

        if (!isIntroActive && headerTl.progress() === 0) {
          headerTl.progress(1);
        }

        // Interactive hover micro-animation: cascading gold wave across the 8 Citadel tiers
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
                gsap.set(logoTiers, { fill: "#FFFFFF", clearProps: "transform" });
              },
            });
          }
        };

        const handleMouseLeave = () => {
          if (logoMark) {
            gsap.to(logoMark, { y: 0, duration: 0.25, ease: "power2.out", clearProps: "transform" });
          }
          if (logoTiers.length > 0) {
            gsap.to(logoTiers, {
              fill: "#FFFFFF",
              duration: 0.25,
              ease: "power1.out",
              overwrite: "auto",
              clearProps: "transform",
              onComplete: () => {
                isHovering = false;
              },
            });
          }
        };

        // Periodic ambient shimmer animation: repeats every 6 seconds to keep the logo alive
        const playPeriodicShimmer = () => {
          if (isHovering || document.hidden) return;
          if (!logoTiers || logoTiers.length === 0) return;

          gsap.to(logoTiers, {
            fill: "#C4A254",
            duration: 0.18,
            stagger: {
              each: 0.035,
              from: "start",
              yoyo: true,
              repeat: 1,
            },
            ease: "power1.out",
            onComplete: () => {
              if (!isHovering) {
                gsap.set(logoTiers, { fill: "#FFFFFF", clearProps: "transform" });
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

        return () => {
          if (idlePulseTimer) {
            clearInterval(idlePulseTimer);
            idlePulseTimer = null;
          }
          if (logoLink) {
            logoLink.removeEventListener("mouseenter", handleMouseEnter);
            logoLink.removeEventListener("mouseleave", handleMouseLeave);
          }
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(headerRef.current, { opacity: 1, y: 0, clearProps: "transform" });
        gsap.set(logoTiers, {
          opacity: 1,
          fill: "#FFFFFF",
          clearProps: "all",
        });
        gsap.set(logoText, { opacity: 1, x: 0, clearProps: "all" });
      });

      return () => {
        if (idlePulseTimer) {
          clearInterval(idlePulseTimer);
          idlePulseTimer = null;
        }
        mm.revert();
      };
    },
    { scope: headerRef },
  );

  const navLinks = [
    { label: "Home", href: "/", key: "home" },
    { label: "Company", href: "/company", key: "company" },
    { label: "Services", href: "/services", key: "services" },
    { label: "Work", href: "/work", key: "work" },
  ];

  const currentActive =
    pathname === "/"
      ? "home"
      : pathname?.startsWith("/company")
        ? "company"
        : pathname?.startsWith("/services")
          ? "services"
          : pathname?.startsWith("/work")
            ? "work"
            : "";

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-[#05070a]/90 backdrop-blur-md border-b border-white/10"
    >
      <div className="h-20 px-6 sm:px-10 md:px-20 flex items-center justify-between relative">
        <Link
          href="/"
          data-logo-link
          onClick={(e) => {
            if (
              typeof window !== "undefined" &&
              (window.location.pathname === "/" ||
                window.location.pathname === "")
            ) {
              e.preventDefault();
              if (window.location.hash) {
                window.history.pushState(null, "", "/");
              }
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const lenis = (window as any).__lenis;
              if (lenis && typeof lenis.scrollTo === "function") {
                lenis.scrollTo(0, { duration: 1.0 });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }
          }}
          className="flex items-center gap-2 group transition-opacity hover:opacity-95"
        >
          <CitadelLogo />
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = currentActive === link.key;
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
                  <span className="absolute -bottom-4.5 left-0 right-0 h-0.5 bg-brand rounded-full transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-white/80 hover:border-brand hover:text-brand px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-[2px] text-white uppercase transition-colors"
          >
            GET STARTED
          </Link>
        </div>
      </div>
    </header>
  );
}
