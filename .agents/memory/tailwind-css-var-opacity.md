---
name: Tailwind @apply opacity on CSS vars
description: Why /40 opacity modifiers fail in @apply with CSS-variable colors and how to fix it
---

## The Problem
In Tailwind v3, using `@apply focus:ring-primary/40` fails if `primary` is defined as `var(--primary)` (a CSS variable), because Tailwind can't inject an alpha channel into a CSS variable string.

**Error:** `The 'focus:ring-primary/40' class does not exist.`

## Solution
Two options:

**Option A (used here):** Define the color using `rgb(var(--primary-rgb) / <alpha-value>)` in tailwind.config.js, where `--primary-rgb` holds the RGB channel values (e.g. `59, 130, 246`). This lets Tailwind inject the alpha. BUT — opacity modifiers still don't work inside `@apply` even then (Tailwind limitation).

**Option B (actually used):** Write focus styles as plain CSS alongside `@apply`:
```css
.app-input { @apply ...; }
.app-input:focus {
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.35);
  border-color: rgba(var(--primary-rgb), 0.6);
}
```

**Why:** Tailwind's `@apply` cannot resolve opacity modifiers at build time when the color value is a CSS variable — it only works for static colors defined directly in the theme.
