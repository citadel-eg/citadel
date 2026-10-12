export const motion = {
  duration: { fast: 0.2, base: 0.5, slow: 0.9 },
  ease: { out: "power2.out", inOut: "power2.inOut", emphasis: "power3.out" },
  distance: 24, // px, matches spacing/6
  stagger: 0.08,
  scrollStart: "top 85%",
} as const;
