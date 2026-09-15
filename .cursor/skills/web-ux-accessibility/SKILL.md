---
name: web-ux-accessibility
description: Apply UX, accessibility, and interaction quality when building or reviewing websites. Use when implementing UI, forms, navigation, focus, keyboard support, responsive layout, or when the user mentions a11y, WCAG, usability, or UX.
---

# Web UX and Accessibility

Ship interfaces people can actually use. Pair with `web-design-guidelines` for a full audit against Vercel's interface rules.

## Quality floor (every page)

- Semantic HTML: `header`, `nav`, `main`, `footer`; one `h1`; heading levels in order.
- Keyboard: all actions reachable; visible `:focus-visible`; no keyboard traps in dialogs/players.
- Pointer: primary controls ≥ 24px (44px for player/mobile).
- Motion: wrap non-essential animation in `prefers-reduced-motion: reduce`.
- Contrast: body text ≥ 4.5:1, large text ≥ 3:1, against the actual background.
- Images: meaningful `alt`; decorative images `alt=""`.
- Forms: label every control; errors next to the field, in text, not color alone.

## Layout

- Mobile first if the design includes a small breakpoint; otherwise start from the given frame and test 375 / 768 / 1280.
- Don't clip text or controls at 320–400px.
- Prefer CSS grid/flex over magic numbers that break when copy wraps.

## Feedback

- Loading, empty, and error are first-class states with a next action.
- Buttons say what they do ("Play film", "Retry") in sentence case unless the design specifies otherwise.

## Review output

When auditing, list issues as `path:line — problem — fix`. Separate must-fix (blocks use) from polish.
