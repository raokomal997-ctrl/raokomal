# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifact: `artifacts/hgss-school`

Multi-page React + Vite + TypeScript website for **Hindu Girls Senior Secondary School, Kaithal** (CISCE, Estd. 1974). BASE_PATH `/`, SPA rewrite `/* → /index.html`.

- **Routing**: hash-based, state in `src/App.tsx` (no React Router). Routes: `home`, `story`, `faculty`, `achievements`, `programs-primary`, `programs-middle`, `programs-senior`, `gallery`, `facilities`, `notices`, `admissions`, `contact`. Special hash `#apply` opens the admission modal.
- **Navbar** (`src/components/Navbar.tsx`): fixed, three dropdowns (About, Academics, Campus Life), close on outside-click, mobile hamburger menu.
- **Admission Modal** (`src/components/AdmissionModal.tsx`): reusable, accessible from "Apply Now" CTA on every page; validates fields, generates `HGSS-YY-NNNNNN` ref number, persists submissions to `localStorage["hgss_applications"]`.
- **Styles**: plain CSS in `src/styles/global.css` (Playfair Display + DM Sans, navy/gold/cream palette). Tailwind/shadcn left in repo but unused by new pages.
- **Photos**: `public/photos/*.jpeg` (18 images including `school-logo.jpeg` used as favicon and brand mark).
