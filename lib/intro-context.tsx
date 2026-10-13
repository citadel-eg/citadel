"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { gsap } from "@/lib/gsap";

export type IntroPhase =
  | "INITIALIZING"
  | "LOADING_MODEL"
  | "PREPARING_VISUALS"
  | "CALIBRATING"
  | "READY"
  | "EXITING"
  | "COMPLETE";

export interface ModelReadinessStatus {
  success: boolean;
  webglAvailable: boolean;
  error?: Error;
}

export interface PhaseMetadata {
  id: string;
  stepNumber: number;
  totalSteps: number;
  label: string;
  technicalDetail: string;
  targetPercent: number;
}

export const INTRO_PHASE_INFO: Record<
  Exclude<IntroPhase, "EXITING" | "COMPLETE">,
  PhaseMetadata
> = {
  INITIALIZING: {
    id: "01",
    stepNumber: 1,
    totalSteps: 5,
    label: "INITIALIZING",
    technicalDetail: "Application runtime",
    targetPercent: 20,
  },
  LOADING_MODEL: {
    id: "02",
    stepNumber: 2,
    totalSteps: 5,
    label: "CONSTRUCTING",
    technicalDetail: "3D Fortress",
    targetPercent: 45,
  },
  PREPARING_VISUALS: {
    id: "03",
    stepNumber: 3,
    totalSteps: 5,
    label: "COMPILING",
    technicalDetail: "Shaders & Framebuffer",
    targetPercent: 70,
  },
  CALIBRATING: {
    id: "04",
    stepNumber: 4,
    totalSteps: 5,
    label: "CALIBRATING",
    technicalDetail: "Typography & Layout",
    targetPercent: 90,
  },
  READY: {
    id: "05",
    stepNumber: 5,
    totalSteps: 5,
    label: "READY",
    technicalDetail: "Launch",
    targetPercent: 100,
  },
};

interface IntroContextValue {
  phase: IntroPhase;
  progress: number;
  phaseInfo: PhaseMetadata;
  isModelReady: boolean;
  webglDegraded: boolean;
  isIntroActive: boolean;
  isExiting: boolean;
  isComplete: boolean;
  reportModelReady: (status: ModelReadinessStatus) => void;
  registerHeroEntrance: (trigger: () => void) => void;
  registerHeaderEntrance: (trigger: () => void) => void;
  startExitTransition: () => void;
  markComplete: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

const STORAGE_KEY = "citadel_intro_viewed_session";

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("INITIALIZING");
  const [progress, setProgress] = useState(0);
  const [isModelReady, setIsModelReady] = useState(false);
  const [webglDegraded, setWebglDegraded] = useState(false);

  const phaseRef = useRef<IntroPhase>("INITIALIZING");
  const progressRef = useRef(0);
  const mountTimeRef = useRef<number>(0);
  const readyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const gatesRef = useRef({
    appHydrated: false,
    modelReady: false,
    fontsReady: false,
  });

  const heroEntranceTriggerRef = useRef<(() => void) | null>(null);
  const headerEntranceTriggerRef = useRef<(() => void) | null>(null);
  const finalizingRef = useRef(false);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);

  // Smoothly interpolate progress number to target percentage
  const animateProgressTo = useCallback(
    (
      target: number,
      duration = 0.4,
      ease = "power1.out",
      onComplete?: () => void
    ) => {
      // If we are already finalizing to 100%, do not allow earlier lower target tweens to cancel it
      if (finalizingRef.current && target < 100) {
        return;
      }

      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
      }
      const currentObj = { val: progressRef.current };
      progressTweenRef.current = gsap.to(currentObj, {
        val: target,
        duration,
        ease,
        onUpdate: () => {
          const rounded = Math.round(currentObj.val);
          setProgress(rounded);
          progressRef.current = rounded;
        },
        onComplete: () => {
          setProgress(target);
          progressRef.current = target;
          if (onComplete) onComplete();
        },
      });
    },
    []
  );

  // Advance to READY phase
  const advanceToReady = useCallback(() => {
    if (
      phaseRef.current === "READY" ||
      phaseRef.current === "EXITING" ||
      phaseRef.current === "COMPLETE"
    ) {
      return;
    }
    setPhase("READY");
    phaseRef.current = "READY";
    setProgress(100);
    progressRef.current = 100;
  }, []);

  // Evaluate readiness gates and advance phase
  const evaluateGates = useCallback(() => {
    const gates = gatesRef.current;

    if (
      phaseRef.current === "READY" ||
      phaseRef.current === "EXITING" ||
      phaseRef.current === "COMPLETE" ||
      finalizingRef.current
    ) {
      return;
    }

    if (!gates.appHydrated) return;

    // Gate 1: Model is still constructing -> progress towards 70%
    if (!gates.modelReady) {
      setPhase("LOADING_MODEL");
      phaseRef.current = "LOADING_MODEL";
      animateProgressTo(70, 1.4, "power1.out");
      return;
    }

    // Gate 2: Model ready, waiting on fonts -> progress towards 85%
    if (!gates.fontsReady) {
      setPhase("PREPARING_VISUALS");
      phaseRef.current = "PREPARING_VISUALS";
      animateProgressTo(85, 0.8, "power1.out");
      return;
    }

    // Gate 3: Both Model & Fonts are READY!
    finalizingRef.current = true;
    setPhase("CALIBRATING");
    phaseRef.current = "CALIBRATING";

    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const elapsed = now - (mountTimeRef.current || now);
    const MIN_INTRO_DURATION_MS = 2200; // 2.2 seconds minimum animation duration
    const remainingForMin = Math.max(0, MIN_INTRO_DURATION_MS - elapsed);

    if (readyTimerRef.current) {
      clearTimeout(readyTimerRef.current);
    }

    const durationSec = remainingForMin > 0 ? remainingForMin / 1000 : 0.45;
    const holdMs = remainingForMin > 0 ? 200 : 150;

    animateProgressTo(100, durationSec, "power1.inOut", () => {
      readyTimerRef.current = setTimeout(() => {
        advanceToReady();
      }, holdMs);
    });

    // Guaranteed safety net: advanceToReady is 100% guaranteed to fire
    const safetyTimeoutMs = remainingForMin + holdMs + 600;
    setTimeout(() => {
      if (
        phaseRef.current !== "READY" &&
        phaseRef.current !== "EXITING" &&
        phaseRef.current !== "COMPLETE"
      ) {
        advanceToReady();
      }
    }, safetyTimeoutMs);
  }, [animateProgressTo, advanceToReady]);

  // Model readiness callback
  const reportModelReady = useCallback(
    (status: ModelReadinessStatus) => {
      gatesRef.current.modelReady = true;
      setIsModelReady(true);
      if (!status.webglAvailable || !status.success) {
        setWebglDegraded(true);
      }

      evaluateGates();
    },
    [evaluateGates]
  );

  // Register entrance trigger functions
  const registerHeroEntrance = useCallback((trigger: () => void) => {
    heroEntranceTriggerRef.current = trigger;
    if (phaseRef.current === "COMPLETE") {
      trigger();
    }
  }, []);

  const registerHeaderEntrance = useCallback((trigger: () => void) => {
    headerEntranceTriggerRef.current = trigger;
    if (phaseRef.current === "COMPLETE") {
      trigger();
    }
  }, []);

  // Called when exit transition starts
  const startExitTransition = useCallback(() => {
    if (phaseRef.current === "EXITING" || phaseRef.current === "COMPLETE") return;
    setPhase("EXITING");
    phaseRef.current = "EXITING";

    if (heroEntranceTriggerRef.current) {
      heroEntranceTriggerRef.current();
    }
    if (headerEntranceTriggerRef.current) {
      headerEntranceTriggerRef.current();
    }
  }, []);

  // Called when exit transition finishes
  const markComplete = useCallback(() => {
    setPhase("COMPLETE");
    phaseRef.current = "COMPLETE";

    // Unlock scrolling
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("intro-active");
    }

    // Resume Lenis smooth scrolling if present
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.start === "function") {
      lenis.start();
      lenis.resize();
    }

    // Refresh GSAP ScrollTrigger to ensure pinned journey calculates accurately
    import("@/lib/gsap").then(({ ScrollTrigger }) => {
      ScrollTrigger.refresh();
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });

    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  // Exit transition safety net: if in EXITING for > 1.2s, force COMPLETE
  useEffect(() => {
    if (phase !== "EXITING") return;
    const timer = setTimeout(() => {
      if (phaseRef.current !== "COMPLETE") {
        markComplete();
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [phase, markComplete]);

  // Client-side initialization
  useEffect(() => {
    mountTimeRef.current =
      typeof performance !== "undefined" ? performance.now() : Date.now();

    // Check if user already saw intro in this session (production only)
    if (process.env.NODE_ENV !== "development") {
      try {
        const alreadyViewed = sessionStorage.getItem(STORAGE_KEY);
        if (alreadyViewed === "true") {
          queueMicrotask(() => {
            setPhase("COMPLETE");
            phaseRef.current = "COMPLETE";
            setProgress(100);
            if (heroEntranceTriggerRef.current) heroEntranceTriggerRef.current();
            if (headerEntranceTriggerRef.current) headerEntranceTriggerRef.current();
          });
          return;
        }
      } catch {
        // Ignore sessionStorage errors
      }
    }

    // Lock page scrolling while intro is running
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("intro-active");
    window.scrollTo(0, 0);

    // Pause Lenis if it initializes early
    const checkLenisPause = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const lenis = (window as any).__lenis;
      if (lenis && typeof lenis.stop === "function") {
        lenis.stop();
        clearInterval(checkLenisPause);
      }
    }, 50);
    const lenisClearTimer = setTimeout(() => clearInterval(checkLenisPause), 2000);

    // Gate 1: Client Hydration
    gatesRef.current.appHydrated = true;
    queueMicrotask(() => {
      animateProgressTo(INTRO_PHASE_INFO.INITIALIZING.targetPercent, 0.3);
      evaluateGates();
    });

    // Gate 2: Web Fonts readiness check
    let fontHandled = false;
    const handleFontReady = () => {
      if (fontHandled) return;
      fontHandled = true;
      gatesRef.current.fontsReady = true;
      evaluateGates();
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleFontReady).catch(handleFontReady);
    } else {
      handleFontReady();
    }
    const fontTimeout = setTimeout(handleFontReady, 1000);

    // Failsafe recovery timer (6s): never allow a stuck loading screen
    const failsafeTimer = setTimeout(() => {
      if (
        phaseRef.current !== "READY" &&
        phaseRef.current !== "EXITING" &&
        phaseRef.current !== "COMPLETE"
      ) {
        console.warn("Citadel intro: Failsafe triggered, activating graceful recovery");
        gatesRef.current.modelReady = true;
        gatesRef.current.fontsReady = true;
        setWebglDegraded(true);
        advanceToReady();
      }
    }, 6000);

    return () => {
      if (readyTimerRef.current) clearTimeout(readyTimerRef.current);
      clearTimeout(fontTimeout);
      clearTimeout(lenisClearTimer);
      clearTimeout(failsafeTimer);
      clearInterval(checkLenisPause);
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
      }
      finalizingRef.current = false;
    };
  }, [animateProgressTo, evaluateGates, advanceToReady]);

  const currentPhaseKey =
    phase === "EXITING" || phase === "COMPLETE" ? "READY" : phase;
  const phaseInfo = INTRO_PHASE_INFO[currentPhaseKey];

  const value: IntroContextValue = {
    phase,
    progress,
    phaseInfo,
    isModelReady,
    webglDegraded,
    isIntroActive: phase !== "COMPLETE",
    isExiting: phase === "EXITING",
    isComplete: phase === "COMPLETE",
    reportModelReady,
    registerHeroEntrance,
    registerHeaderEntrance,
    startExitTransition,
    markComplete,
  };

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const context = useContext(IntroContext);
  if (!context) {
    throw new Error("useIntro must be used within an IntroProvider");
  }
  return context;
}
