---
name: cine-bohio-streaming
description: Architecture and UX for Cine Bohio, a short-film streaming website. Use when building catalog pages, film detail, the video player, routing, media loading, or site information architecture for this project.
---

# Cine Bohio Streaming

Cine Bohio is a short-film streaming site. The landing page is already implemented from the Canva **Bohio** mock (`DAHUET3exrU`), including the glass masthead that shrinks on scroll to an evenly inset About / Contact / Location pill (`18.25rem` compact cluster; wordmark `max-width: 0`). Visual direction stays that design (`implement-user-design`), not a generic streaming-app look. Read `PROJECT.md` for current state. Keep `justify-content: end` on the nav pill so expand does not jump.

## Product shape

Typical surfaces (add only when the design or user asks):

- Landing / catalog of shorts
- Film detail (title, still, runtime, credits)
- Player (watch)
- Optional: about, contact, festival/press

Do not add accounts, recommendations carousels, or Netflix-clone chrome unless requested.

## Architecture

Current app: Vite + React + TypeScript in the project root.

- Routes and pages live under `src/` once routing is added. Prefer React Router when multiple screens exist.
- Keep film data behind a small module (`src/data/` or later an API). Do not hardcode catalog markup in ten components.
- Player: native `<video>` first. Poster, captions (`<track>`), keyboard controls, and a visible pause/play control. Lazy-load the player route so the catalog stays light.
- Media files stay out of git when large; use `public/` or hosted URLs. Never commit secrets or signed playback keys.

## UX for watching

- Catalog cards must be keyboard reachable and have a real title, not only a poster.
- Player page: large video, title nearby, no autoplay with sound. Honor `prefers-reduced-motion` for UI chrome; video playback is user-initiated.
- Buffering and errors need plain-language states ("Can't play this film" + retry), not empty black screens.
- Touch targets on mobile player controls at least 44px.

## Accessibility and performance

- Semantic landmarks (`header`, `main`, `footer`), one `h1` per page.
- Contrast must meet the design; if the mock fails WCAG, flag it and ask before changing colors.
- Images: width/height or aspect-ratio to avoid layout shift; `loading="lazy"` off-hero.
- Fetch independent data in parallel. Do not introduce waterfalls for catalog + detail.

## Implementation order

1. Keep the landing shell faithful to Canva (already in place).
2. Wire catalog from structured film data when asked.
3. Add player and playback states.
4. Accessibility and responsive pass.

Read `implement-user-design` before restyling. Read `react-best-practices` when adding data fetching or the player bundle.
