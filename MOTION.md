# Motion (GSAP)

Motion should feel as restrained as the brand: structural, confident, never playful. The motion values below are **proposed defaults**, not part of the original Citadel design system. Adjust and record changes here.

## 1. Principles

1. Animate `opacity` and `transform` (`x`, `y`, `scale`, `rotate`) only. Never animate `width`, `height`, `top`, `left`, or `margin`.
2. Short and quiet: rises of 24px (`spacing/6`), no bounces, no elastic eases.
3. Motion explains structure: reveal sections, sequence steps and cards, then get out of the way.
4. Respect `prefers-reduced-motion` on every animation.
5. Always clean up (`useGSAP` / `gsap.context`) so React and Next.js route changes do not leak triggers.

## 2. Motion tokens

```ts
// lib/motion.ts
export const motion = {
  duration: { fast: 0.2, base: 0.5, slow: 0.9 },
  ease: { out: "power2.out", inOut: "power2.inOut", emphasis: "power3.out" },
  distance: 24,      // px, matches spacing/6
  stagger: 0.08,
  scrollStart: "top 85%",
} as const;
```

## 3. Setup (React / Next.js)

```bash
npm i gsap @gsap/react
```

```tsx
// lib/gsap.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);
export { gsap, ScrollTrigger, useGSAP };
```

Next.js: any component using GSAP must be a client component (`"use client"`). Never touch `window` or `document` during server render.

## 4. Reusable reveal pattern

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { motion } from "@/lib/motion";

export function Reveal({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-animate='fade-up']", {
        opacity: 0,
        y: motion.distance,
        duration: motion.duration.base,
        ease: motion.ease.out,
        stagger: motion.stagger,
        scrollTrigger: { trigger: root.current, start: motion.scrollStart, once: true },
      });
    });
  }, { scope: root });

  return <div ref={root}>{children}</div>;
}
```

## 5. Patterns

| Pattern | Use | Settings |
|---|---|---|
| Fade-up | Headings, paragraphs, cards | `opacity 0 → 1`, `y 24 → 0`, `duration.base`, `ease.out` |
| Stagger group | Step lists, card grids | Same as fade-up with `stagger: 0.08` |
| Dark section reveal | Navy sections | Fade only, `duration.slow` |
| Nav on scroll | Sticky navigation | Fade/translate `y: -8 → 0`, `duration.fast` |
| Gold accent line | Dividers, step numbers | `scaleX 0 → 1`, `transform-origin: left`, `duration.base` |
| Hover (buttons/cards) | Interaction | Prefer Tailwind `transition-colors duration-200`; use GSAP only for complex hover |

## 6. Rules

- Use `once: true` on ScrollTrigger reveals unless scrubbing is required.
- Avoid `scrub` and pinning on mobile unless tested; keep it for one hero or showcase at most.
- Set initial hidden state with `gsap.from`/`gsap.set` inside `useGSAP`, not in CSS, to avoid permanently hidden content if JS fails. If flash of content is a problem, hide with `opacity-0` only on elements that animate and guarantee they are revealed.
- Call `ScrollTrigger.refresh()` after images or fonts change layout (Next.js: after `next/image` loads or on `document.fonts.ready`).
- No animation longer than `duration.slow` (0.9s) for UI elements.
- Reduced motion: users with `prefers-reduced-motion: reduce` see content immediately, with no transforms.
- Do not mix Framer Motion and GSAP on the same element.

## 7. Performance

- Animate few elements at once; batch with `stagger` and `ScrollTrigger.batch`.
- Add `will-change-transform` only on elements animating continuously.
- Kill triggers on unmount (handled by `useGSAP` scope).
