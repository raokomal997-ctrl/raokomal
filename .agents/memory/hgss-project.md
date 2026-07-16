---
name: HGSS School project layout
description: Key facts about this project's structure after Vercel-to-Replit migration.
---

# HGSS School project layout

The "Vercel import" was already a pnpm workspace (not a Next.js app). `.migration-backup/` held the previous Replit workspace state.

**Why:** The project was a Vite+React app on Vercel, already using the Replit pnpm_workspace scaffold. Migration meant copying files back into the right workspace locations, not converting from Next.js.

**How to apply:** If you see `.migration-backup/` in this project, treat it as an archive — do not register or run its artifacts.

## Structure
- `artifacts/hgss-school/` — React/Vite school website (hash-based routing, dark theme, gold/purple palette)
- `artifacts/api-server/` — Express 5 server; routes: `/api/healthz`, `/api/openai/*` (Groq chat), `/api/tts` (ElevenLabs)
- `lib/integrations-openai-ai-server/` — OpenAI/Groq client helpers (discovered by `lib/*` in pnpm-workspace.yaml)
- `lib/integrations-openai-ai-react/` — React hooks for audio/OpenAI
- `lib/db/` — Drizzle + Postgres; tables: conversations, messages

## Key env vars needed at runtime
- `GROQ_API_KEY` — AI chatbot (Diyana) via Groq's OpenAI-compatible API
- `ELEVENLABS_API_KEY` — TTS proxy route (`/api/tts`)
- `DATABASE_URL` — Postgres (api-server falls back to in-memory if absent)

## Vite proxy
`artifacts/hgss-school/vite.config.ts` proxies `/api` → `localhost:3000` in dev. The shared proxy handles it in production.
