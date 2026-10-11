# Components (Tailwind recipes)

All classes come from the tokens in `DESIGN.md`. Copy these patterns; do not invent new values. Examples use React/JSX (`className`); adapt for Vue with `class`.

## Page shell

```jsx
<main className="bg-surface text-fg font-sans font-normal">
  <section className="px-6 py-24">
    <div className="mx-auto max-w-6xl space-y-8">{/* content */}</div>
  </section>
</main>
```

## Section

- Light: `bg-surface px-6 py-24`
- Dark: `bg-surface-dark text-fg-inverse px-6 py-24`
- Gap between sections: `space-y-24` / `gap-24`; between content blocks: `space-y-8` / `gap-8`

## Button

Shared base:

```
inline-flex items-center justify-center rounded-sm px-6 py-3 font-semibold
transition-colors duration-200
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand
disabled:opacity-48 disabled:cursor-not-allowed
```

- **Primary:** base + `bg-brand border border-brand text-fg hover:bg-brand/90`
- **Secondary:** base + `bg-surface-inverse border border-line-dark text-fg hover:bg-surface`

```jsx
export function Button({ variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center justify-center rounded-sm px-6 py-3 font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-48 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-brand border border-brand text-fg hover:bg-brand/90",
    secondary: "bg-surface-inverse border border-line-dark text-fg hover:bg-surface",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
```

## Card

`bg-surface-inverse border border-line rounded-md p-8`

```jsx
<article className="bg-surface-inverse border border-line rounded-md p-8">
  <h3 className="font-semibold text-fg">Title</h3>
  <p className="mt-3 font-normal text-fg-muted">Description</p>
</article>
```

## Navigation

`bg-surface-dark text-fg-inverse border-b border-line-dark px-6`. Links: `font-semibold hover:text-brand transition-colors`.

## Step

```jsx
<li className="bg-surface-inverse border border-line rounded-md p-8">
  <span className="font-semibold text-brand">01</span>
  <h3 className="mt-3 font-semibold text-fg">Step title</h3>
  <p className="mt-2 font-normal text-fg-muted">Step description</p>
</li>
```

## Metadata

`text-fg-muted` by default, `text-fg-accent` for emphasis. Typically small, label weight (`font-semibold`).

## Form fields (derived, not in source)

Not defined in the design system. Proposed: `bg-surface-inverse border border-line rounded-sm px-4 py-3 text-fg placeholder:text-fg-muted focus-visible:outline-2 focus-visible:outline-brand`. Confirm before shipping.

## Animation hooks

Add `data-animate` attributes (see `MOTION.md`) instead of animation classes:
`data-animate="fade-up"`, `data-animate="stagger"` on a parent whose children animate in sequence.
