export const motion = {
  duration: { fast: 0.2, base: 0.5, slow: 0.9, scrub: 0.1 },
  ease: {
    out: "power2.out",
    inOut: "power2.inOut",
    emphasis: "power3.out",
    cinematic: "power4.out",
  },
  distance: 24, // px, matches spacing/6
  distanceSm: 12,
  distanceLg: 32,
  stagger: 0.08,
  staggerFast: 0.04,
  scrollStart: "top 85%",
} as const;

