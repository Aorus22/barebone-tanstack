# Project Overview — Bare Bone

## Application Purpose

Bare Bone adalah **full-stack application skeleton** dengan feature set siap pakai:
- **JWT Auth** — Login/logout, route protection, session management
- **Admin Panel** — User management (CRUD), Group management (RBAC with permission matrix)
- **Audit Log** — Real-time activity logging dengan SQLite server-side pagination
- **Theme Customizer** — CSS variable overrides (color + radius), real-time, persistent
- **Component Showcase** — UI component demo (shadcn/ui + custom playgrounds)

---

## Tech Stack (Actual)

| Layer | Technology |
|---|---|
| Framework | TanStack Start v1 (React SSR) |
| Router | TanStack Router (file-based) |
| UI | React 19, shadcn/ui, Tailwind CSS v4 |
| Table | TanStack Table v8 |
| Charts | Recharts |
| Toast | Sonner |
| DB (runtime) | Kysely + PostgreSQL (`pg`) |
| Auth | JWT stateless via `jose` (HS256), httpOnly cookie |
| Password | bcryptjs |
| Audit Log | SQLite via `node:sqlite` (`logs/system-action.db`) |
| Validation | Zod |

---

## Directory Structure

```
barebone/
  src/
    backend/
      auth/           → JWT auth service (login, verify, loadAccessPayload)
      deployment/
    components/
      global/         → demo-nav, theme-customizer, data-table, sidebar, topbar
      ui/             → shadcn/ui components (button, dialog, table, select, dll)
    features/
      showcase/       → Component showcase (playgrounds, registry, catalog)
      crud/
        _data/        → Mock data & types (rbac, users, audit-log)
        playgrounds/  → CRUD playgrounds (users, groups, audit-log)
    hooks/            → useThemeCustomizer, useSseJobs
    lib/
      server/         → session, cookie, system-action-logger, audit-action, env
      client/         → confirm-modal, ai-store, sse, toast
      shared/         → permissions
    router/           → module-config
    routes/           → File-based routing
      (app)/          → app layout + admin routes + demo routes
      (auth)/         → login, logout, server-action
  logs/               → SQLite audit trail database (auto-generated)
  docs/               → Technical knowledge base
```

---

## NPM Scripts

| Script | Function |
|---|---|
| `npm run dev` | Dev server (port 3000, fallback 3001) |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript check |
| `npm run seed` | Run all seed scripts (core → groups → users) |
| `npm run seed:core` | Seed superadmin group + user |

---

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `DATABASE_URL` | — | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | — | ✅ | Secret key untuk JWT signing |
| `SSE_SHARED_SECRET` | — | ✅ | Secret untuk SSE daemon |
| `SESSION_COOKIE_NAME` | `app_session` | ❌ | Session cookie name |
| `NODE_ENV` | `development` | ❌ | Environment mode |

---

## Auth Flow

```
Client                     Server
  │                          │
  │  POST /login             │
  │  username + password     │  → verify bcrypt
  │                          │  → create JWT (HS256, 24h)
  │  ← httpOnly cookie       │  → set cookie
  │                          │
  │  GET /admin/*            │
  │  (cookie otomatis)       │  → beforeLoad: verify JWT
  │                          │  → invalid → 307 /login
  │  ← protected page        │  → valid → render
```

---

## Key Implementation Details

### Theme Customizer Anti-Flash
Blocking script di `__root.tsx` (via `scripts` array di `head()`):
```ts
scripts: [{
  children: `(function(){ ... document.documentElement.style.setProperty(...) })()`
}]
```
- Jalan SYNCHRONOUS saat HTML parsing, SEBELUM React mount
- Baca `theme-custom-colors` dari localStorage
- Langsung set CSS variable ke inline style `<html>` via `setProperty`
- Tidak ada flash karena inline style punya prioritas tertinggi

### Audit Log
- SQLite database terpisah (`logs/system-action.db`), auto-created
- Tidak perlu migration — table & indexes dibuat otomatis
- Server-side pagination via `ORDER BY + LIMIT/OFFSET`
- Semua CRUD action di-log via `logAudit` server function

### Admin Routes Protection
- `(app)/admin/route.tsx` → `beforeLoad: checkSession()`
- Jika `!isAuthenticated` → `redirect("/login")`
- JWT stateless — tidak ada DB lookup untuk verifikasi tiap request
