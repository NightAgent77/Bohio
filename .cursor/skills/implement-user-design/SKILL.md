---
name: implement-user-design
description: Faithfully translate a user-provided mockup, screenshot, Figma file, or written design into production UI. Use when the user shares a design, asks to implement a layout they made, match a visual, or recreate a reference. The provided design is the source of truth — do not invent a competing aesthetic.
---

# Implement User Design

The user's design wins. Treat attached images, Figma frames, and written specs as the brief. Do not "improve" palette, type, spacing, or composition unless they ask.

## Workflow

1. Inventory the design before coding: pages/screens, breakpoints, typefaces, colors, spacing, imagery, motion, and interactive states (hover, focus, active, empty, error, playing).
2. Extract tokens first: color, type scale, spacing, radii, shadows, z-index. Put them in CSS variables (or the project's existing token file).
3. Recreate structure with semantic HTML and the project's stack. Match hierarchy: header, hero, catalog, player, footer, overlays.
4. Implement spacing and type from the design, not from generic Tailwind defaults. Prefer exact values from the mock (px/rem as shown) over rounding to a scale that drifts.
5. Verify in the browser against the reference: desktop and mobile if both exist. Fix visual deltas before adding extra polish.

## Rules

- If a detail is visible in the design, implement it. If it is absent, ask or keep it absent — do not fill the page with invented sections.
- Do not swap fonts, colors, or layout grids to look "more cinematic" or "more AI-distinctive."
- Generic AI aesthetics (Inter/Roboto, purple gradients, identical rounded cards, tracked ALL-CAPS eyebrows) are forbidden unless they appear in the user's design.
- Motion only where the design implies it. Respect `prefers-reduced-motion`.
- Keep real content in the DOM. Decorative media must not replace headings, nav, or controls.
- Assets: use files the user provides. Generate placeholders only when they say so, and label them as temporary.

## When design and code conflict

- Ambiguous measurement → pick the closest value, note the assumption in the reply.
- Missing breakpoint → scale the given layout down without inventing a second design system.
- Missing hover/focus → add accessible focus rings that fit the existing palette; keep hover subtle and on-brand.

## Pairing

After a faithful first pass, use `frontend-design` only for gaps the mock does not cover, and `web-design-guidelines` for accessibility/UX review — never to restyle the brief.
