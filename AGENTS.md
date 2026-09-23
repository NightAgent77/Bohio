# AGENTS.md

Cine Bohio is a short-film streaming site. This file is the operating manual for agents. Read [PROJECT.md](PROJECT.md) at the start of every session, and update it after meaningful work.

## Session start

1. Read `PROJECT.md` (state, decisions, open work).
2. Match the owner’s Canva design — do not invent a competing look.
3. Skills to load when relevant:
   - `implement-user-design` for any visual change
   - `cine-bohio-streaming` for catalog / player / IA
   - `frontend-design` only for gaps the mock does not cover
   - `web-ux-accessibility` and `web-design-guidelines` for a11y/UX review
   - Personal library also has Vercel `react-best-practices` and `composition-patterns`

## Stack

- Vite 8 + React 19 + TypeScript in the **project root**
- Supabase Auth via `@supabase/supabase-js` (`src/lib/supabase.ts`). Keys in gitignored `.env.local`
- Single-page app in `src/App.tsx` + `src/index.css` (no router yet): landing or signed-in dashboard, gated by the Supabase session
- Dev: `npm run dev` → http://localhost:5173/
- Check: `npm run build` (tsc + vite) and `npm run lint` (oxlint)
- Type-only imports required (`verbatimModuleSyntax`): `import type { FormEvent } from 'react'`

## Design source of truth

- Canva design **Bohio**, id `DAHUET3exrU`
- Two artboards on one page: expanded glass nav + compact centered pill
- Landscape asset `MAHVMpHK6Ns` (`DSCF9057.jpg`, 7728×5152 original)
- Canva MCP is connected (`user-canva`). Prefer it over guessing layout.
- Canva export of this design was denied; MCP `get-assets` only returned a 200×133 thumbnail. Current `src/assets/landscape.jpg` and `hero-blur.jpg` are upscales of that thumbnail. Prefer a full-resolution export from the owner when available.

## Product rules

- Visuals follow the Canva mock (glass, blur, type, slogan, compact nav).
- Do not add Netflix-clone chrome, fake catalogs, or extra sections unless asked.
- Sign Up / Log in are real Supabase Auth on project **Cine-Bohio** (`lxdklufwsnjbdjmmjwip`). Do not replace them with a fake success message. New signups stay email-confirmed. A session replaces the landing with a Coming soon dashboard and a right-side profile widget. That widget opens a floating menu of placeholder items; Log out is the only working action. Sign up can reveal the password; Log in cannot.
- The Supabase CLI saved on this machine is a different account. Do not point Cine Bohio at it. Never commit `.env.local`, service-role keys, or access tokens.
- Native `<video>` when a player is added. No autoplay with sound.
- Large media stays out of git when possible; never commit secrets.

## Code conventions

- Import images from `src/assets/` (Vite bundler). Do **not** rely on `public/` for photos on this volume — Vite served those paths as HTML.
- Keep tokens in `src/index.css` (`:root`). Glass = backdrop-filter + translucent navy, not solid cards.
- Compact nav: `.masthead.is-compact` after `scrollY > 72`, showing About / Contact / Location only. Wordmark and auth stay hidden until the hero is back in view — no hover expand.
- Compact cluster width is `18.25rem` so the three labels sit evenly from the pill corners. Collapse the wordmark with `max-width: 0` and `overflow: hidden`. Keep `justify-content: end` and `0fr auto` — do not use compact `space-evenly` or `gap: 0` on the links (packs labels mid-morph).
- Page flow: Hero → About → The Movement (`#concept`) → Our Roots (`#location`) → Contact. Nav labels stay About / Contact / Location.
- Masthead morph stays off until `.is-ready` (fonts settled). Collapsing pieces use interpolable `min-width: 0`, not `min-content` / `max-content`.
- Nav radii: `--nav-radius` / `--nav-chip-radius` (not a full capsule). Auth chrome is on `.auth-slot`.
- Slogan uses Canva **Clarify**: per-word `filter: blur` → sharp, replay on every load. Copy lines: “Immerse yourself in true” / “visual storytelling”.
- Type: Manrope with `display=optional` and `'Manrope Fallback'` in `src/index.css`.
- Respect `prefers-reduced-motion`. Smooth scroll is `html.is-smooth-scroll` after the nav is ready.
- One `h1` per page. Hash links: `#top` `#about` `#concept` `#contact` `#location`.

## After every edit

```
- [ ] Behavior matches the request and the Canva mock
- [ ] npm run build passes
- [ ] UI verified in the browser (click/scroll, not only a screenshot)
- [ ] Related routes/sections still consistent (nav, compact bar, dialogs)
- [ ] PROJECT.md updated if state, decisions, or next steps changed
```

Skip the PROJECT.md bump for typos and pure formatting.

## Do not

- Restyle toward generic AI defaults (Inter/Roboto, purple gradients, identical rounded SaaS cards) unless the mock uses them.
- Swap the landscape for stock.
- Commit unless the owner asks.
- Force-push or change git remotes.
