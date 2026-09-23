# Cine Bohio — project log

Handoff for new agent sessions. Operating rules live in [AGENTS.md](AGENTS.md). Last updated 23 Sep 2026.

## What this is

A website for streaming short films. Brand: **Cine Bohío** — a home for short films and a movement for creators, born in Puerto Rico and open to the world. Tone: cinematic, restrained, glass over landscape — not a Netflix clone.

Owner designs in **Canva**. Cursor is connected to that Canva account (`user-canva` MCP). Implement the mock; don’t replace it with a generated aesthetic.

## Current snapshot

| | |
|---|---|
| Stack | Vite 8, React 19, TypeScript, Supabase Auth, no router |
| App | Landing (logged out) or Coming soon dashboard (logged in) |
| Run | `npm run dev` → http://localhost:5173/ |
| Design | Canva file **Bohio** (`DAHUET3exrU`) for the landing |
| Auth | Supabase project **Cine-Bohio** (`lxdklufwsnjbdjmmjwip`, `us-west-2`). Client keys in gitignored `.env.local` |
| Status | Landing from the Canva mock; a session enters a placeholder dashboard |

### What’s on the page

- Fixed frosted landscape backdrop (`src/assets/hero-blur.jpg`)
- Glass masthead: wordmark, About, Contact, Location, Sign Up, Log in
- On scroll (`scrollY > 72`) the bar eases into a centered pill with only About, Contact, and Location, evenly inset from the pill corners. Wordmark and Sign Up / Log in stay hidden until the page is scrolled back to the hero — no hover expand
- Hero slogan with Clarify-style blur-to-sharp intro (replays on refresh)
- Scroll cue (three dots + chevron) → About
- About (platform + movement), The Movement stills (Discover / Support / Create), Our Roots (`#location`), Contact form (client-side thank-you)
- Sign Up / Log in glass dialogs call Supabase Auth (`src/lib/supabase.ts`). Sign up has a show/hide control on the right of the password field; Log in stays masked
- A confirmed session leaves the landing and opens a Coming soon dashboard. Login from the landing plays a reverse-Clarify dissolve, then the dashboard bar and “Coming soon” line enter with the same per-word Clarify stagger as the hero slogan. Refreshing while signed in still plays that intro. The right-side profile widget shows initials plus email. Clicking it opens a floating menu: Profile, Watchlist, Settings, and Notifications are placeholders; Log out signs out through Supabase and returns to the landing
- New signups must confirm email (`mailer_autoconfirm` is false). No custom SMTP. The built-in mailer only reaches organization members and returns “email rate limit exceeded” after about 2 emails per hour
- Accounts live in Supabase Auth (`auth.users`) only. There is no profiles table
- Confirmed admin login: `chilaxer77@gmail.com`, `app_metadata.role` = `admin`. Password is not in the repo. This account enters the same Coming soon dashboard as any other user
- Auth site URL and redirect allow list: still `http://localhost:5173` and `http://127.0.0.1:5173/**`. Add `https://cinebohio.vercel.app` and `https://cinebohio.vercel.app/**` so confirmation / reset links from the live site work
- Live site: [cinebohio.vercel.app](https://cinebohio.vercel.app) on Vercel project `cinebohio` (team `nightagent77s-projects`). Production Config has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Redeployed 23 Sep 2026 without build cache; landing and Sign Up / Log in reach Supabase. Preview / Development env vars are not set. Live production is still git `dfb9b11` — later local dashboard/transition work is not on that deploy unless it is committed and pushed

### Key files

- `src/App.tsx` — landing, compact-nav + `navReady` gating, auth dialog, contact form, session-gated dashboard + profile menu
- `src/lib/supabase.ts` — browser client. URL and publishable key live in gitignored `.env.local`
- `src/index.css` — tokens, glass, masthead morph, dashboard bar, profile menu, Clarify keyframes, Manrope fallback
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
8. **Auth (23 Sep 2026)** — Connected the separate Cine Bohio Supabase account (not the CLI’s other login). Project `Cine-Bohio` in `us-west-2`. Sign up, log in, and sign out use `@supabase/supabase-js`. Confirmation stays on. Sign-up password can be shown with the eye control on the right. Admin login is `chilaxer77@gmail.com`, already confirmed, because the built-in mailer rate-limits confirmation email.
9. **Signed-in dashboard (23 Sep 2026)** — A session now enters a Coming soon screen instead of staying on the landing. Profile widget on the right; floating account menu with placeholder items and a working Log out. No router yet — the view is gated by `supabase.auth` session.
10. **Enter transition (23 Sep 2026)** — Landing chrome dissolves with a reverse Clarify, then the dashboard bar and copy use the same blur-to-sharp stagger as the hero slogan (`clarify` / 90ms). Reduced motion skips the leave delay and the blur.
11. **Live Vercel env (23 Sep 2026)** — Production was a navy blank because the Vite build had no `VITE_SUPABASE_*` (`.env.local` is gitignored) and the client threw on import. Keys were added in Vercel as Production **Config** (Secret rejects `VITE_` names). Redeployed `dfb9b11` without cache; the landing paints and Log in talks to project `lxdklufwsnjbdjmmjwip`. Local `src/lib/supabase.ts` now returns `null` instead of throwing if keys are missing — that guard is not necessarily on the live commit.

## Decisions (don’t silently reverse)

- Owner mock wins over “make it more cinematic.”
- Photos imported through `src/assets/` because `public/images/*.jpg` was served as `text/html` by Vite on this volume.
- No catalog or player until asked. Auth is Supabase email and password on project `Cine-Bohio` (`lxdklufwsnjbdjmmjwip`). The Supabase CLI on this machine is logged into a different account (Orbital / Bohio Labs). Do not run `supabase login` in a way that replaces that login, and do not create Cine Bohio resources on it. The Cine Bohio access token is not in the repo; if a management call is needed, ask the owner for a new token. Do not commit `.env.local`.
- Do not store the admin password in markdown or source. Signup confirmation stays on until the owner adds SMTP.
- Compact bar shows About / Contact / Location only; it does not expand on hover. Wordmark and auth return when scrolling back to the hero.
- Contact submit is a local success message, not email/API.
- Nav pills use a slightly tighter radius than a full capsule (`--nav-radius` / `--nav-chip-radius`); auth glass lives on `.auth-slot`, not the inner flex wrapper.
- Masthead transitions stay off until `.is-ready` (after fonts + a few frames). Do not use `min-width: max-content` / `min-content` on collapsing nav pieces — those snap on expand and crush the pill.
- Compact labels need equal insets: collapse the wordmark with `max-width: 0` and `overflow: hidden`, and keep the compact cluster wide enough for the three labels plus padding (`18.25rem`). A tighter width (`17.55rem`) overflowed left because `justify-content: end` keeps the morph from jumping.
- Manrope loads with `display=optional` plus a metric-matched `'Manrope Fallback'` so a late font swap does not shove the labels.
- Brand positioning lives in the brief: platform + movement, Puerto Rican origin, global future. Homepage copy stays short; do not add a fake catalog, live ratings, or submissions. Nav still says Location even when the section eyebrow is Our Roots. Accounts are real Supabase auth.
- A live session enters the Coming soon dashboard. Do not keep the signed-in user on the marketing landing, and do not put Sign out back on the landing masthead. Log out lives in the profile menu. Placeholder menu items stay inert until those screens exist.
- Landing → dashboard uses the slogan’s Clarify motion (blur out, then blur in). Do not replace that with a generic fade or a different easing language.

## Open / next

- Drop in a full-resolution `DSCF9057.jpg` to replace the upscaled thumbnail
- Catalog of shorts, film detail, player (native `<video>`)
- Custom SMTP so confirmation mail reaches people outside the Supabase organization; until then, signup tells the visitor to check email and login stays closed until that link is opened
- Add `https://cinebohio.vercel.app` and `https://cinebohio.vercel.app/**` to the Supabase auth redirect allow list
- Optionally set the same `VITE_SUPABASE_*` Config vars for Vercel Preview / Development
- Commit/push local dashboard transition + optional-supabase guard if that work should go live (production is still `dfb9b11`)
- Routing when the dashboard is more than one screen (React Router)
- Any further Canva frames beyond this landing

## Pitfalls

- `verbatimModuleSyntax`: type imports must use `import type`
- AppleDouble `._*` files appear on this drive; `.gitignore` already ignores them
- Canva `export-design` failed for `DAHUET3exrU` (“Not allowed to access design”); inspect via `start-editing-transaction` then **cancel** if not editing
- Do not commit the inspect-only Canva transaction; always cancel or commit explicitly
- First paint will tween `width` / `grid-template-columns` if transitions are enabled too early — keep `.masthead:not(.is-ready)` at `transition: none`
- Auth/wordmark `min-width: min-content` or `max-content` is not interpolable; on expand the cluster stays compact while auth pops to full width and the links jump left
- Compact cluster width must fit labels + `padding-inline: 1.45rem` + border (`18.25rem`). Tightening it to `17.55rem` made About hug the left edge. Keep `justify-content: end` and `grid-template-columns: 0fr auto` so expand does not jump. Do not use compact `space-evenly` / `gap: 0` on `.nav-links` — the words collapse into one string mid-morph.
- `.env.local` is required for working Sign up / Log in. Vite bakes `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in at build time. They are not in git. A live host that builds without those variables used to crash to a navy screen. Production now has them as Vercel Config; changing them needs a rebuild (not a cache-only redeploy). On the local tree, missing keys no longer throw — the landing paints and auth stays disconnected. `.gitignore` ignores `.env` and `*.local`. Vercel Secret type rejects `VITE_` keys; use Config.
- A deployed site URL must also be added to the Supabase auth redirect list.
- A personal access token pasted in chat on 23 Sep 2026 can manage the Cine Bohio account. Treat it as exposed and do not reuse it. Ask the owner to revoke it at Supabase account tokens if that has not happened.
