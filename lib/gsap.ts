import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  ScrollTrigger.clearScrollMemory("manual");
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

export { gsap, ScrollTrigger, useGSAP };
