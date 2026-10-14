"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

interface PageTransitionContextValue {
  transitionTo: (href: string) => void;
  isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextValue>({
  transitionTo: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(PageTransitionContext);

// SVG 8 Tiers (tier 0 = bottom foundation, tier 7 = top crown)
const CITADEL_TIERS = [
  { id: "tier-0", d: "M23.8125 27.771H-1.19209e-07V31.9923H23.8125V27.771Z" },
  { id: "tier-1", d: "M22.4054 23.9826H1.4071V26.8509H22.4054V23.9826Z" },
  { id: "tier-2", d: "M21.0524 20.3025H2.76009V23.1167H21.0524V20.3025Z" },
  { id: "tier-3", d: "M20.0241 16.6221H3.78833V19.4021H20.0241V16.6221Z" },
  { id: "tier-4", d: "M18.9959 12.9961H4.81665V15.7361H18.9959V12.9961Z" },
  { id: "tier-5", d: "M17.9134 9.37012H5.89893V12.0701H17.9134V9.37012Z" },
  { id: "tier-6", d: "M16.8852 5.79883H6.92725V8.39883H16.8852V5.79883Z" },
  {
    id: "tier-7",
    d: "M5.89901 0.00774132H9.84972V2.22663H13.9628V0.00774132H17.9135V4.87848H5.89901V0.00774132Z",
  },
];

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const targetHrefRef = useRef<string | null>(null);

  const overlayRef = useRef<HTMLDivElement>(null);
  const shuttersRef = useRef<HTMLDivElement[]>([]);
  const tiersRef = useRef<SVGPathElement[]>([]);
  const labelRef = useRef<HTMLSpanElement>(null);
  const crownGlowRef = useRef<SVGPathElement | null>(null);


  // Execute Enter Animation (Shutters scale up, Emblem builds bottom-up)
  const runEnterAnimation = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const overlay = overlayRef.current;
      const shutters = shuttersRef.current;
      const tiers = tiersRef.current;
      const label = labelRef.current;

      if (!overlay) {
        resolve();
        return;
      }

      gsap.set(overlay, { display: "flex", pointerEvents: "all" });

      if (prefersReducedMotion) {
        gsap.fromTo(
          overlay,
          { opacity: 0 },
          { opacity: 1, duration: 0.25, onComplete: () => resolve() }
        );
        return;
      }

      // Prepare starting states
      gsap.set(shutters, {
        scaleY: 0,
        transformOrigin: "bottom center",
      });
      gsap.set(tiers, {
        opacity: 0,
        y: 18,
        scaleX: 0.75,
        transformOrigin: "center center",
      });
      if (label) {
        gsap.set(label, { opacity: 0, y: 8 });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => resolve(),
      });

      // 1. 4 Architectural Shutters scale up with column stagger
      tl.to(
        shutters,
        {
          scaleY: 1,
          duration: 0.55,
          stagger: 0.045,
          ease: "expo.out",
        },
        0
      );

      // 2. Citadel 8 Tiers assemble sequentially bottom to top
      tl.to(
        tiers,
        {
          opacity: 1,
          y: 0,
          scaleX: 1,
          duration: 0.38,
          stagger: 0.04,
          ease: "expo.out",
        },
        0.18
      );

      // 3. Label reveals
      if (label) {
        tl.to(
          label,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0.38
        );
      }

      // 4. Crown Tier 7 gold flare pulse
      if (tiers[7]) {
        crownGlowRef.current = tiers[7];
        tl.to(
          tiers[7],
          {
            filter:
              "drop-shadow(0 0 16px rgba(196,162,84,0.95)) drop-shadow(0 0 4px #FFFFFF)",
            duration: 0.25,
            ease: "power2.out",
          },
          0.48
        );
      }
    });
  }, []);

  // Execute Exit Animation (Citadel deconstructs top-down, Shutters open upward)
  const runExitAnimation = useCallback((): Promise<void> => {
    return new Promise((resolve) => {
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const overlay = overlayRef.current;
      const shutters = shuttersRef.current;
      const tiers = tiersRef.current;
      const label = labelRef.current;

      if (!overlay) {
        resolve();
        return;
      }

      if (prefersReducedMotion) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          onComplete: () => {
            gsap.set(overlay, { display: "none", pointerEvents: "none" });
            resolve();
          },
        });
        return;
      }

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(overlay, { display: "none", pointerEvents: "none" });
          resolve();
        },
      });

      // 1. Label dissolves immediately
      if (label) {
        tl.to(
          label,
          {
            opacity: 0,
            y: -6,
            duration: 0.2,
            ease: "power2.in",
          },
          0
        );
      }

      // 2. Crown glow clears
      if (tiers[7]) {
        tl.to(
          tiers[7],
          {
            filter: "none",
            duration: 0.15,
          },
          0
        );
      }

      // 3. Citadel tiers deconstruct from top down (reversed: tier 7 to tier 0)
      const reversedTiers = [...tiers].reverse();
      tl.to(
        reversedTiers,
        {
          opacity: 0,
          y: -16,
          scaleX: 0.85,
          duration: 0.32,
          stagger: 0.025,
          ease: "power2.in",
        },
        0.04
      );

      // 4. Shutters scale down upward (transformOrigin: top)
      gsap.set(shutters, { transformOrigin: "top center" });
      tl.to(
        shutters,
        {
          scaleY: 0,
          duration: 0.55,
          stagger: 0.045,
          ease: "expo.inOut",
        },
        0.18
      );
    });
  }, []);

  // Trigger page transition to destination
  const transitionTo = useCallback(
    async (href: string) => {
      if (isTransitioningRef.current) return;

      const currentPath = window.location.pathname;
      const targetPath = href.split("?")[0].split("#")[0];

      // Ignore if already on the requested page
      if (targetPath === currentPath) {
        return;
      }

      isTransitioningRef.current = true;
      setIsTransitioning(true);
      targetHrefRef.current = href;

      // 1. Close shutters & build Citadel mark
      await runEnterAnimation();

      // 2. Push route
      router.push(href);
    },
    [router, runEnterAnimation]
  );

  // When pathname changes after router.push, execute the Exit animation
  useEffect(() => {
    if (!isTransitioningRef.current) return;

    // Small delay to allow new page to mount in DOM
    const timer = setTimeout(async () => {
      await runExitAnimation();
      isTransitioningRef.current = false;
      setIsTransitioning(false);
      targetHrefRef.current = null;
    }, 60);

    return () => clearTimeout(timer);
  }, [pathname, runExitAnimation]);

  // Global click hijacker on <a href> links
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Don't intercept if modifier keys are pressed (e.g. Cmd/Ctrl + click for new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) {
        return;
      }

      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore anchor jumps, protocols, external links, or downloads
      if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        target.hasAttribute("download")
      ) {
        return;
      }

      // Check if it's an internal application link
      const isInternal =
        href.startsWith("/") ||
        href.startsWith(window.location.origin) ||
        !href.includes("://");

      if (isInternal) {
        e.preventDefault();
        transitionTo(href);
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, {
        capture: true,
      });
    };
  }, [transitionTo]);

  return (
    <PageTransitionContext.Provider value={{ transitionTo, isTransitioning }}>
      {/* 4-Column Architectural Shutters + Citadel Emblem Overlay */}
      <div
        ref={overlayRef}
        id="citadel-transition-overlay"
        aria-hidden="true"
        style={{ display: "none" }}
        className="fixed inset-0 z-9998 pointer-events-none flex items-center justify-center overflow-hidden select-none"
      >
        {/* 4 Architectural Vertical Columns */}
        <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
          {[0, 1, 2, 3].map((col) => (
            <div
              key={col}
              ref={(el) => {
                if (el) shuttersRef.current[col] = el;
              }}
              className="bg-[#05070a] border-r border-white/4 h-full w-full will-change-transform"
            />
          ))}
        </div>

        {/* Central Assembling Citadel Mark & Label */}
        <div className="relative z-10 flex flex-col items-center gap-5">
          <svg
            className="w-17 h-23 overflow-visible drop-shadow-[0_0_24px_rgba(255,255,255,0.18)]"
            preserveAspectRatio="none"
            viewBox="0 0 23.8125 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Citadel-Transition-Mark">
              {CITADEL_TIERS.map((tier, idx) => (
                <path
                  key={tier.id}
                  id={tier.id}
                  ref={(el) => {
                    if (el) tiersRef.current[idx] = el;
                  }}
                  d={tier.d}
                  fill="white"
                  className="will-change-transform"
                />
              ))}
            </g>
          </svg>

          <span
            ref={labelRef}
            className="text-[11px] font-mono font-semibold tracking-[0.35em] uppercase text-white/70"
          >
            CITADEL
          </span>
        </div>
      </div>

      {children}
    </PageTransitionContext.Provider>
  );
}
