# Project Overview — Bare Bone

## Application Purpose

Bare Bone is a **generic full-stack application skeleton** built to accelerate development of new web applications. It provides a production-ready foundation with authentication, authorization, server-sent events, UI shell, and architecture patterns — so you can focus on business logic rather than infrastructure.

The project is intentionally **domain-agnostic**. No business modules are implemented yet. The skeleton is ready to be extended for any domain.

---

## Tech Stack (Actual)

| Layer | Technology |
|-------|-----------|
| Framework | TanStack Start v1 (React SSR) |
| Router | TanStack Router (file-based) |
| Runtime | Nitro (via Vite plugin) |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| State / Server Sync | TanStack Query (via router SSR query) |
| Table | TanStack Table v8 |
| Rich Text | Tiptap v3 |
| Charts | Recharts |
| Toast | Sonner |
| Animation | Motion (framer-motion successor) |
| DB Client (migration) | Prisma v7 |
| DB Client (runtime query) | Kysely v0.29 |
| DB | PostgreSQL (via `pg`) |
| Validation | Zod v4 |
| Auth | Custom session (cookie + SHA256 token hash) |
| Password | bcryptjs (pure JS, no native bindings) |
| File Storage | S3-compatible bucket (MinIO via `MINIO_*` env vars) |
| System Log | SQLite via `node:sqlite` (`logs/system-action.db`) |
| SSE | In-memory job store (no Redis) |

---

## Directory Structure

```
barebone/
  src/
    backend/          → Server-side business logic & database access (empty — to be filled)
    components/       → React UI components (global/ and ui/)
    hooks/            → React Custom Hooks
    lib/
      client/         → Client-side helpers
      server/         → Server-side helpers (auth, db, errors, session, env)
      shared/         → Universal helpers (can be imported by both client & server)
    router/           → Navigation module configuration (module-config.ts)
    routes/           → File-based routing files
      (app)/          → Authenticated layout group (uses AppShell)
      (auth)/         → Login/logout flow
      (landing)/      → Public universal pages
      api/            → Standard API router (not used)
    ui/               → Custom UI utilities
    utils/            → Helper utilities (client-utils/, server-utils/)
  prisma/             → Prisma schema definition & SQL migration files
  logs/               → SQLite audit trail database (auto-generated)
  storage/            → Local file storage directory
  docs/               → Technical knowledge base
  public/             → Static public assets (images, icons)
  scripts/            → Helper automation scripts
```

---

## NPM Scripts

| Script | Function |
|--------|----------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run test` | Vitest run |
| `npm run typecheck` | TypeScript check without emit |
| `npm run lint` | ESLint |
| `npm run format` | Prettier format all files |

---

## Environment Variables (Server)

Defined and validated in `src/lib/server/env.ts` with Zod.

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | `development` / `test` / `production` |
| `DATABASE_URL` | — | **Required.** PostgreSQL connection string (`postgresql://...`) |
| `HRIS_API_URL` | — | Optional. External HRIS API URL |
| `HRIS_API_KEY` | — | Optional. HRIS API key |
| `SESSION_COOKIE_NAME` | `app_session` | Session cookie name |
| `SESSION_COOKIE_SECURE` | `false` | `true` for HTTPS production |
| `SESSION_COOKIE_SAME_SITE` | `lax` | `lax` / `strict` / `none` |

To read environment variables in server-side code:
```ts
// Must use getServerEnv() helper to guarantee correctly parsed types
const { DATABASE_URL } = getServerEnv()
```

To read variables outside the Zod schema:
```ts
const value = getRequiredServerEnv("SOME_API_KEY")
```

---

## Vite Configuration

File: `vite.config.ts`

- Main plugins: `tanstackStart`, `nitro`, `tailwindcss`, `viteTsConfigPaths`
- Path aliases via `tsconfig.json` + `viteTsConfigPaths`

---

## TypeScript Configuration

Path alias `@/` → `src/` configured in `tsconfig.json`, activated by `viteTsConfigPaths`.

---

## Deployment

- Dockerfile available at root
- `docker-compose.yaml` available
- Runtime: Nitro (Node.js)
- Environment variables must be set at runtime (not hardcoded)
