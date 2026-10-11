# Citadel Design System

Source of truth for **Citadel Smart Solutions** UI. Stack: **Tailwind CSS + GSAP**. Brand personality: restrained, structural, trustworthy. Navy and stone carry the interface; gold is a sparing accent.

> Hex values are estimates sampled from the design-system screenshot. Verify against the source variables, then update `app/globals.css` (Tailwind v4) in one place.

Related files: `COMPONENTS.md` (component recipes), `MOTION.md` (GSAP), `AGENTS.md` (rules for AI tools).

## 1. Principles

1. **Restraint.** Gold is an accent (CTAs, numbers, highlights), never a large fill.
2. **Structure.** Hairline borders, small radii, generous spacing.
3. **Tokens first.** Use the Tailwind classes below. No arbitrary values like `bg-[#0F2A52]` or `p-[13px]`.
4. **One typeface.** Inter only. Hierarchy comes from size and weight.
5. **Quiet motion.** Subtle fades and short rises only (see `MOTION.md`).

## 2. Color

### 2.1 Primitives

| Token | Hex (approx.) | Tailwind | Role |
|---|---|---|---|
| `color/navy` | `#0F2A52` | `navy` | Primary brand navy |
| `color/graphite` | `#1C2633` | `graphite` | Secondary dark brand color |
| `color/white` | `#FFFFFF` | `white` | Primary light color |
| `color/stone` | `#F3F1EC` | `stone` | Warm neutral background |
| `color/steel` | `#D5DBE4` | `steel` | Borders, dividers |
| `color/slate` | `#8A99AD` | `slate` | Subdued text |
| `color/gold` | `#C4A254` | `gold` | Restrained brand accent |

> `stone` and `slate` override Tailwind's default palettes of the same name. Do not use numbered shades (`slate-500`).

### 2.2 Semantic colors (use these in components)

| Design token | Alias | Tailwind name | Example classes |
|---|---|---|---|
| `color/background/primary` | stone | `surface` | `bg-surface` |
| `color/background/dark` | navy | `surface-dark` | `bg-surface-dark` |
| `color/background/darkSecondary` | graphite | `surface-darker` | `bg-surface-darker` |
| `color/background/inverse` | white | `surface-inverse` | `bg-surface-inverse` |
| `color/text/primary` | graphite | `fg` | `text-fg` |
| `color/text/secondary` | slate | `fg-muted` | `text-fg-muted` |
| `color/text/inverse` | white | `fg-inverse` | `text-fg-inverse` |
| `color/text/accent` | gold | `fg-accent` | `text-fg-accent` |
| `color/border/default` | steel | `line` | `border-line` |
| `color/border/dark` | navy | `line-dark` | `border-line-dark` |
| `color/brand/primary` | gold | `brand` | `bg-brand`, `border-brand` |
| `color/brand/accent` | gold | `brand` | `text-brand` |

### 2.3 Component colors

| Token | Resolves to |
|---|---|
| `button/primary/background`, `/border` | `brand` |
| `button/primary/text` | `fg` (dark on gold) |
| `button/secondary/background` | `surface-inverse` |
| `button/secondary/text` | `fg` |
| `button/secondary/border` | `line-dark` |
| `card/background` | `surface-inverse` |
| `card/border` | `line` |
| `section/background` | `surface` |
| `section/darkBackground` | `surface-dark` |
| `navigation/background` | `surface-dark` |
| `navigation/text` | `fg-inverse` |
| `navigation/border` | `line-dark` |
| `step/background` | `surface-inverse` |
| `step/border` | `line` |
| `step/number` | `brand` |
| `step/title` | `fg` |
| `step/description` | `fg-muted` |
| `metadata/text` | `fg-muted` |
| `metadata/accent` | `fg-accent` |

## 3. Typography

- **Font:** Inter via `font-sans`. Fallback: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- The system defines **weights only**. Font sizes are not tokenized in the source; use Tailwind's default type scale consistently and record choices here once decided.

| Token | Value | Tailwind |
|---|---|---|
| `fontWeight/regular` | 400 | `font-normal` |
| `fontWeight/medium` | 500 | `font-medium` |
| `fontWeight/semibold` | 600 | `font-semibold` |
| `fontWeight/bold` | 700 | `font-bold` |
| `fontWeight/extrabold` | 800 | `font-extrabold` |
| `typography/display` | 600 | `font-semibold` |
| `typography/body` | 400 | `font-normal` |
| `typography/label` | 600 | `font-semibold` |

Next.js: load Inter with `next/font/google` and expose it as `--font-inter`.

## 4. Spacing and layout

The Citadel scale maps one-to-one onto Tailwind's default spacing (token number = Tailwind unit; 1 unit = 4px). No custom spacing config is needed.

| Token | px | Tailwind unit |
|---|---|---|
| `spacing/1` … `/6` | 4, 8, 12, 16, 20, 24 | `1` … `6` |
| `spacing/8` | 32 | `8` |
| `spacing/10` | 40 | `10` |
| `spacing/12` | 48 | `12` |
| `spacing/16` | 64 | `16` |
| `spacing/20` | 80 | `20` |
| `spacing/24` | 96 | `24` |
| `spacing/32` | 128 | `32` |

Only these units are allowed (no `p-7`, `p-9`, `p-14`, etc.).

| Layout alias | px | Classes |
|---|---|---|
| `layout/pagePadding` | 24 | `px-6` |
| `layout/sectionGap` | 96 | `gap-24`, `space-y-24` |
| `layout/contentGap` | 32 | `gap-8`, `space-y-8` |

## 5. Shape

Tailwind's default radius names differ from Citadel values, so they are **overridden** in the theme.

| Token | px | Tailwind |
|---|---|---|
| `radius/none` | 0 | `rounded-none` |
| `radius/sm` (`shape/defaultRadius`) | 4 | `rounded-sm` |
| `radius/md` (`shape/cardRadius`) | 8 | `rounded-md` |
| `radius/lg` | 12 | `rounded-lg` |
| `stroke/hairline` | 1 | `border` |
| `stroke/regular` | 2 | `border-2` |
| `opacity/disabled` | 48% | `opacity-48` |
| `opacity/subtle` | 72% | `opacity-72` |

Do not use `rounded-xl`, `rounded-full` (except avatars) or heavy shadows.

## 6. Component sizing

| Token | Value | Tailwind |
|---|---|---|
| `button/*/radius` | 4 | `rounded-sm` |
| `button/*/paddingX` | 24 | `px-6` |
| `button/*/paddingY` | 12 | `py-3` |
| `card/radius` | 8 | `rounded-md` |
| `card/padding` | 32 | `p-8` |
| `section/paddingY` | 96 | `py-24` |

## 7. Logo

Stacked rook/citadel tower mark. Variants: navy, slate, gold, inverse (white on black), plus horizontal lockups with **CITADEL / SMART SOLUTIONS** (dark and gold). Clear space around the mark = `spacing/4` (`16px`). Do not recolor outside these variants. Use SVG.

## 8. Rules and open questions

- Dark sections: `bg-surface-dark text-fg-inverse`.
- Disabled: `opacity-48 cursor-not-allowed`. De-emphasized: `opacity-72`.
- Always provide visible focus states: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`.
- Contrast: gold text on white or stone is low contrast. Use gold for fills and large accents, and dark text on gold.
- Open question: the source says gold is "never a primary color" yet maps `button/primary/background` to gold. Implemented as mapped; confirm intent.
