# Cine Bohio — project log

Handoff for new agent sessions. Operating rules live in [AGENTS.md](AGENTS.md). Last updated 15 Sep 2026.

## What this is

A website for streaming short films. Brand: **Cine Bohío** — a home for short films and a movement for creators, born in Puerto Rico and open to the world. Tone: cinematic, restrained, glass over landscape — not a Netflix clone.

Owner designs in **Canva**. Cursor is connected to that Canva account (`user-canva` MCP). Implement the mock; don’t replace it with a generated aesthetic.

## Current snapshot

| | |
|---|---|
| Stack | Vite 8, React 19, TypeScript, no router, no backend |
| App | Single landing page |
| Run | `npm run dev` → http://localhost:5173/ |
| Design | Canva file **Bohio** (`DAHUET3exrU`) |
| Status | Landing from the Canva mock; brand copy and section order from the 15 Sep 2026 brief |

### What’s on the page

- Fixed frosted landscape backdrop (`src/assets/hero-blur.jpg`)
- Glass masthead: wordmark, About, Contact, Location, Sign Up, Log in
- On scroll (`scrollY > 72`) the bar eases into a centered pill with only About, Contact, and Location, evenly inset from the pill corners. Wordmark and Sign Up / Log in stay hidden until the page is scrolled back to the hero — no hover expand
- Hero slogan with Clarify-style blur-to-sharp intro (replays on refresh)
- Scroll cue (three dots + chevron) → About
- About (platform + movement), The Movement stills (Discover / Support / Create), Our Roots (`#location`), Contact form (client-side thank-you)
- Sign Up / Log in glass dialogs — copy only, no accounts

### Key files

- `src/App.tsx` — page, compact-nav + `navReady` gating, auth dialog, contact form
- `src/index.css` — tokens, glass, masthead morph, Clarify keyframes, Manrope fallback
- `index.html` — Manrope from Google Fonts with `display=optional`
- `src/assets/landscape.jpg` — upscaled still (from Canva thumbnail)
- `src/assets/hero-blur.jpg` — Gaussian-blurred version for the backdrop
- `.cursor/skills/` — project skills
- `.cursor/rules/cine-bohio.mdc` — always-on pointer to this log

## How we got here

1. **Scaffold** — Empty Vite + React + TS app in this folder. Landing was only the title “Cine Bohio”.
2. **Skills** — Installed design/architecture skills (Anthropic frontend-design, Vercel web-design-guidelines, react-best-practices, composition-patterns) plus project skills: `implement-user-design`, `cine-bohio-streaming`, `web-ux-accessibility`. Canva MCP added to `~/.cursor/mcp.json` and authenticated.
3. **Canva** — Searched designs named Bohio. One page, 1366×768, two stacked frames (full nav vs compact pill). Text: slogan, Cine Bohio, Sign Up, Log in, About, Contact, Location. Background photo asset `MAHVMpHK6Ns` / `DSCF9057.jpg`.
4. **Landing build** — Implemented glass UI, compact-nav transition, Clarify slogan, about/concept/contact/location, auth UI. PNG export of the Canva file was denied; only a 200×133 asset thumbnail was available, so stills are soft until a full-res original is provided.
5. **Masthead polish (15 Sep 2026)** — Tighter nav radii, slightly wider auth group, compact bar shows About / Contact / Location only (no hover expand). Load gating so a top-of-page refresh does not play the compact morph. Expand uses interpolable `min-width: 0` so the three links do not jump left.
6. **Compact pill spacing (15 Sep 2026)** — About sat closer to the left corner than Location to the right because the collapsed cluster (`17.55rem`) was narrower than the three labels plus padding, and `justify-content: end` overflowed left. Cluster is now `18.25rem`. Wordmark still collapses with `max-width: 0` / `overflow: hidden`. Do not switch compact layout to `space-evenly` or `gap: 0` — that packed the labels during the morph.
7. **Brand brief (15 Sep 2026)** — Applied `CINE_BOHIO_BRAND_AND_PAGE_BRIEF.md` to the existing landing: About / Movement / Our Roots / Contact copy, still cards as Discover / Support / Create, Location section moved before Contact. Nav labels and `#about` `#concept` `#contact` `#location` unchanged. Hero supporting line omitted so the Canva slogan stays uncrowded.

## Decisions (don’t silently reverse)

- Owner mock wins over “make it more cinematic.”
- Photos imported through `src/assets/` because `public/images/*.jpg` was served as `text/html` by Vite on this volume.
- No catalog, player, or real auth until asked.
- Compact bar shows About / Contact / Location only; it does not expand on hover. Wordmark and auth return when scrolling back to the hero.
- Contact submit is a local success message, not email/API.
- Nav pills use a slightly tighter radius than a full capsule (`--nav-radius` / `--nav-chip-radius`); auth glass lives on `.auth-slot`, not the inner flex wrapper.
- Masthead transitions stay off until `.is-ready` (after fonts + a few frames). Do not use `min-width: max-content` / `min-content` on collapsing nav pieces — those snap on expand and crush the pill.
- Compact labels need equal insets: collapse the wordmark with `max-width: 0` and `overflow: hidden`, and keep the compact cluster wide enough for the three labels plus padding (`18.25rem`). A tighter width (`17.55rem`) overflowed left because `justify-content: end` keeps the morph from jumping.
- Manrope loads with `display=optional` plus a metric-matched `'Manrope Fallback'` so a late font swap does not shove the labels.
- Brand positioning lives in the brief: platform + movement, Puerto Rican origin, global future. Homepage copy stays short; do not add fake catalog, live ratings, submissions, or working accounts. Nav still says Location even when the section eyebrow is Our Roots.

## Open / next

- Drop in a full-resolution `DSCF9057.jpg` to replace the upscaled thumbnail
- Catalog of shorts, film detail, player (native `<video>`)
- Real Sign Up / Log in when the owner wants accounts
- Routing when there is more than one screen (React Router)
- Any further Canva frames beyond this landing

## Pitfalls

- `verbatimModuleSyntax`: type imports must use `import type`
- AppleDouble `._*` files appear on this drive; `.gitignore` already ignores them
- Canva `export-design` failed for `DAHUET3exrU` (“Not allowed to access design”); inspect via `start-editing-transaction` then **cancel** if not editing
- Do not commit the inspect-only Canva transaction; always cancel or commit explicitly
- First paint will tween `width` / `grid-template-columns` if transitions are enabled too early — keep `.masthead:not(.is-ready)` at `transition: none`
- Auth/wordmark `min-width: min-content` or `max-content` is not interpolable; on expand the cluster stays compact while auth pops to full width and the links jump left
- Compact cluster width must fit labels + `padding-inline: 1.45rem` + border (`18.25rem`). Tightening it to `17.55rem` made About hug the left edge. Keep `justify-content: end` and `grid-template-columns: 0fr auto` so expand does not jump. Do not use compact `space-evenly` / `gap: 0` on `.nav-links` — the words collapse into one string mid-morph.
