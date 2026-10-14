/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Reset scroll and refresh ScrollTrigger on route change
  useEffect(() => {
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(0, { immediate: true });
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    ScrollTrigger.refresh();
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    // Add lenis classes to html element
    document.documentElement.classList.add("lenis", "lenis-smooth");

    const initialHash = typeof window !== "undefined" ? window.location.hash : "";

    // Prevent browser and ScrollTrigger from auto-scrolling to past arbitrary positions on reload (when no hash is targeted)
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      ScrollTrigger.clearScrollMemory("manual");
      if (!initialHash || initialHash === "#") {
        window.scrollTo(0, 0);
      }
    }

    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      autoResize: true,
    });

    let userHasScrolled = false;
    const markUserScrolled = () => {
      userHasScrolled = true;
    };
    window.addEventListener("wheel", markUserScrolled, { passive: true });
    window.addEventListener("touchmove", markUserScrolled, { passive: true });
    window.addEventListener("pointerdown", markUserScrolled, { passive: true });

    const scrollToHash = (immediate = true) => {
      const hash = window.location.hash;
      if (hash && hash !== "#") {
        try {
          const target = document.querySelector(hash);
          if (target) {
            lenis.scrollTo(target as HTMLElement, { offset: -80, immediate });
            return true;
          }
        } catch {
          // ignore invalid query selector
        }
      }
      return false;
    };

    if (initialHash && initialHash !== "#") {
      if (!scrollToHash(true)) {
        requestAnimationFrame(() => scrollToHash(true));
      }
    } else {
      lenis.scrollTo(0, { immediate: true });
    }

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Keep Lenis scroll limit in sync whenever ScrollTrigger recalculates
    const onScrollTriggerRefresh = () => {
      lenis.resize();
      if (!userHasScrolled && window.location.hash) {
        scrollToHash(true);
      }
    };
    ScrollTrigger.addEventListener("refresh", onScrollTriggerRefresh);

    // Drive Lenis from the GSAP ticker for frame-perfect sync
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    (window as any).__lenis = lenis;

    // Observe document body size changes so Lenis always knows the full height
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(document.body);
    }

    // Refresh on font load
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        lenis.resize();
        ScrollTrigger.refresh();
        if (!userHasScrolled && window.location.hash) {
          scrollToHash(true);
        }
      });
    }

    // Staggered layout refreshes as async assets & Three.js canvases stabilize
    const refreshTimers = [100, 300, 800, 1500, 3000].map((delay) =>
      setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
        if (!userHasScrolled && window.location.hash) {
          scrollToHash(true);
        }
      }, delay),
    );

    // Smoothly scroll to in-page anchor links with header offset
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (href && href.startsWith("#")) {
        if (href === "#") {
          e.preventDefault();
          window.history.pushState(null, "", window.location.pathname);
          lenis.scrollTo(0, { duration: 1.0 });
          return;
        }
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          window.history.pushState(null, "", href);
          lenis.scrollTo(element as HTMLElement, { offset: -80, duration: 1.0 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    const handleHashChange = () => {
      if (window.location.hash) {
        scrollToHash(false);
      } else {
        lenis.scrollTo(0, { duration: 1.0 });
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    const handleVisibility = () => {
      if (!document.hidden) {
        lenis.resize();
        ScrollTrigger.refresh();
        if (!userHasScrolled && window.location.hash) {
          scrollToHash(true);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("wheel", markUserScrolled);
      window.removeEventListener("touchmove", markUserScrolled);
      window.removeEventListener("pointerdown", markUserScrolled);
      window.removeEventListener("hashchange", handleHashChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      refreshTimers.forEach(clearTimeout);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      ScrollTrigger.removeEventListener("refresh", onScrollTriggerRefresh);
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(updateTicker);
      delete (window as any).__lenis;
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
