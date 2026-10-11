# AGENTS.md: Citadel Smart Solutions

Read `DESIGN.md`, `COMPONENTS.md`, `MOTION.md` and `app/globals.css` before writing UI code.

## Stack

- Tailwind CSS for all styling. GSAP (`gsap`, `@gsap/react`) for animation.
- React / Next.js. Components using GSAP or browser APIs are client components.

## Styling rules

- Use only the tokens from `DESIGN.md`. No arbitrary values (`bg-[#...]`, `p-[13px]`, `text-[17px]`) and no default Tailwind palettes (`blue-500`, `gray-200`).
- Use semantic classes in components: `bg-surface`, `bg-surface-dark`, `text-fg`, `text-fg-muted`, `border-line`, `bg-brand`.
- Spacing only from the allowed units: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32.
- Radius: `rounded-sm` (4px) buttons, `rounded-md` (8px) cards. No `rounded-xl` or heavy shadows.
- Font: Inter (`font-sans`). Headings and labels `font-semibold`, body `font-normal`.
- Gold (`brand`) is an accent. Never use it as a large background fill.
- Build components from `COMPONENTS.md` recipes. If a component is missing, propose a recipe there first.
- Mobile-first with Tailwind breakpoints. Page padding `px-6`, sections `py-24`.

## Animation rules (GSAP)

- Follow `MOTION.md`. Animate only `opacity` and `transform`.
- Use `useGSAP` with a `scope` ref, plus `gsap.matchMedia()` for `prefers-reduced-motion`.
- Take durations, eases and distances from `lib/motion.ts`. No magic numbers.
- Register plugins once in `lib/gsap.ts`.

## Code quality

- Typed props (TypeScript), small components, no inline `style` values for design tokens.
- Accessibility: semantic HTML, visible focus states, alt text, keyboard support, sufficient contrast.
- When adding or changing a token, update `DESIGN.md` and `app/globals.css` together.
- Ask before introducing new colors, fonts, spacing or animation styles.
