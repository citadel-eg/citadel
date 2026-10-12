/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Add lenis classes to html element
    document.documentElement.classList.add("lenis", "lenis-smooth");

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

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Keep Lenis scroll limit in sync whenever ScrollTrigger recalculates
    const onScrollTriggerRefresh = () => {
      lenis.resize();
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
      });
    }

    // Staggered layout refreshes as async assets & Three.js canvases stabilize
    const refreshTimers = [100, 300, 800, 1500, 3000].map((delay) =>
      setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
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
          lenis.scrollTo(0, { duration: 1.0 });
          return;
        }
        const element = document.querySelector(href);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, { offset: -80, duration: 1.0 });
        }
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
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
