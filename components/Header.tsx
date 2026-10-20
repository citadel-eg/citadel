"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll and pause Lenis when mobile menu is open
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (lenis) lenis.start();
    };
  }, [isMenuOpen]);

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
      const logoMark = q("[data-logo-mark]")[0] as unknown as
        | SVGSVGElement
        | undefined;
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
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "transform",
          },
          0.18,
        );

        headerTl.fromTo(
          logoSub,
          { opacity: 0, x: -8 },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: "power2.out",
            clearProps: "transform",
          },
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
                gsap.set(logoTiers, {
                  fill: "#FFFFFF",
                  clearProps: "transform",
                });
              },
            });
          }
        };

        const handleMouseLeave = () => {
          if (logoMark) {
            gsap.to(logoMark, {
              y: 0,
              duration: 0.25,
              ease: "power2.out",
              clearProps: "transform",
            });
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
                gsap.set(logoTiers, {
                  fill: "#FFFFFF",
                  clearProps: "transform",
                });
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
        gsap.set(headerRef.current, {
          opacity: 1,
          y: 0,
          clearProps: "transform",
        });
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
        <div className="h-20 px-6 sm:px-8 md:px-10 lg:px-14 xl:px-20 flex items-center justify-between relative">
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

        {/* Center Desktop Navigation: Visible on laptops & desktops (lg:), clean spacing */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navLinks.map((link) => {
            const isActive = currentActive === link.key;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 text-xs xl:text-[13px] font-medium tracking-tight transition-colors ${
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

        {/* Right: CTA + Tablet/Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center justify-center border border-white/80 hover:border-brand hover:text-brand px-4 lg:px-6 py-2 sm:py-2.5 text-xs lg:text-sm font-semibold tracking-[2px] text-white uppercase transition-colors"
          >
            GET STARTED
          </Link>

          {/* Mobile & Tablet Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 relative z-40 rounded-sm border border-white/15 hover:border-brand/60 transition-colors p-2 group cursor-pointer"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
          >
            <span className="block w-5 h-0.5 bg-white transition-all duration-200 group-hover:bg-brand" />
            <span className="block w-3.5 h-0.5 bg-brand self-start transition-all duration-200 group-hover:w-5" />
            <span className="block w-5 h-0.5 bg-white transition-all duration-200 group-hover:bg-brand" />
          </button>
        </div>
      </div>

      {/* Full-viewport architectural mobile menu via React Portal */}
      <MobileMenuOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
        currentActive={currentActive}
      />
    </header>
  );
}

function MobileMenuOverlay({
  isOpen,
  onClose,
  navLinks,
  currentActive,
}: {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { label: string; href: string; key: string }[];
  currentActive: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => {
    if (!containerRef.current) {
      onClose();
      return;
    }

    const mm = gsap.matchMedia();
    let isReduced = false;
    mm.add("(prefers-reduced-motion: reduce)", () => {
      isReduced = true;
    });

    if (isReduced) {
      onClose();
      return;
    }

    gsap.to(containerRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.22,
      ease: "power2.in",
      onComplete: onClose,
    });
  }, [onClose]);

  useGSAP(
    () => {
      if (!isOpen || !containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline();

        tl.fromTo(
          containerRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" },
        )
          .fromTo(
            ".mobile-nav-panel",
            { y: -24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
            "-=0.15",
          )
          .fromTo(
            ".mobile-nav-item",
            { opacity: 0, x: -24 },
            {
              opacity: 1,
              x: 0,
              duration: 0.35,
              stagger: 0.06,
              ease: "power3.out",
            },
            "-=0.25",
          )
          .fromTo(
            ".mobile-nav-cta",
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
            "-=0.15",
          )
          .fromTo(
            ".mobile-nav-footer",
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power2.out" },
            "-=0.1",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(containerRef.current, { opacity: 1 });
      });
    },
    { scope: containerRef, dependencies: [isOpen] },
  );

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 w-screen h-screen flex flex-col bg-[#05070a] text-white overflow-hidden"
    >
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Subtle Ambient Radial Gold Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl bg-brand" />

      {/* Top Bar with Citadel Logo & Close Button */}
      <div className="h-20 border-b border-white/10 shrink-0 relative z-10 bg-[#05070a]/90 backdrop-blur-md">
        <div className="max-w-3xl mx-auto w-full h-full px-6 sm:px-10 md:px-12 flex items-center justify-between">
          <Link
            href="/"
            onClick={handleClose}
            className="flex items-center gap-2"
          >
            <CitadelLogo />
          </Link>
          <button
            type="button"
            onClick={handleClose}
            className="flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:border-brand text-xs font-mono uppercase tracking-[2px] text-white/80 hover:text-brand transition-colors rounded-sm group cursor-pointer"
            aria-label="Close menu"
          >
            <span>CLOSE</span>
            <span className="text-sm font-bold group-hover:rotate-90 transition-transform duration-200">
              ✕
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Body with Tablet-Optimized Layout */}
      <div className="mobile-nav-panel flex-1 flex flex-col justify-between py-8 overflow-y-auto relative z-10">
        <div className="max-w-3xl mx-auto w-full px-6 sm:px-10 md:px-12 flex-1 flex flex-col justify-between">
          <nav className="flex flex-col">
            {navLinks.map((link, idx) => {
              const isActive = currentActive === link.key;
              return (
                <div key={link.label} className="border-b border-white/10">
                  <Link
                    href={link.href}
                    onClick={handleClose}
                    className="mobile-nav-item flex items-center justify-between py-5 sm:py-6 group transition-colors"
                  >
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="font-mono text-xs sm:text-sm text-brand font-semibold tracking-wider">
                        0{idx + 1}
                      </span>
                      <span
                        className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-[2px] uppercase transition-colors ${
                          isActive
                            ? "text-brand"
                            : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>
                    <span
                      className={`font-mono text-sm sm:text-base transition-transform duration-200 ${
                        isActive
                          ? "text-brand translate-x-1"
                          : "text-white/30 group-hover:text-brand group-hover:translate-x-1"
                      }`}
                    >
                      →
                    </span>
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Bottom CTA & Status Info */}
          <div className="pt-8 sm:pt-12 space-y-6">
            <Link
              href="/contact"
              onClick={handleClose}
              className="mobile-nav-cta w-full flex items-center justify-center gap-3 border border-brand bg-brand text-[#1C2633] px-6 py-4 text-sm font-semibold tracking-[2px] uppercase transition-all hover:bg-brand/90 rounded-sm active:scale-[0.99]"
            >
              <span>GET STARTED</span>
              <span className="text-base leading-none">↗</span>
            </Link>

            <div className="mobile-nav-footer flex items-center justify-between text-[11px] font-mono text-white/40 tracking-[1px] uppercase pt-4 border-t border-white/5">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                SYSTEM OPERATIONAL
              </span>
              <span>CITADEL // CAIRO</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
