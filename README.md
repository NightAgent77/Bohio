# Cine Bohio

Short-film streaming site. Vite + React + TypeScript, with Supabase email/password auth. The current build is a single landing page from the Canva **Bohio** mock: glass masthead, Clarify slogan, About, The Movement, Our Roots, and Contact.

```bash
npm install
npm run dev
```

Opens at http://localhost:5173/. Check with `npm run build` and `npm run lint`.

Auth needs a gitignored `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
```

The local file already points at Supabase project `Cine-Bohio`. Do not commit it. Details, decisions, and the admin login live in [PROJECT.md](PROJECT.md).

- [AGENTS.md](AGENTS.md) — how to work in this repo
- [PROJECT.md](PROJECT.md) — what exists, decisions, and what’s next
