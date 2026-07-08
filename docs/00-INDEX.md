# Bare Bone — Knowledge Base Index

This document is the main entry point for all project documentation.
**Read this first** before reading other documents.

---

## Project Summary

Bare Bone adalah **full-stack application skeleton** dengan feature set yang sudah berfungsi: JWT auth, admin panel (User & Group Management), Audit Log real-time, Theme Customizer, dan Component Showcase.

- Stack: TanStack Start (React SSR), PostgreSQL (Kysely), SQLite (audit log)
- Auth: JWT stateless via `jose`, httpOnly cookie
- Admin: `/admin/user-management` (Users tab + Groups tab), `/admin/audit-log`
- Demo: `/demo/component/*` (UI component showcase)
- Theme: CSS variable overrides + blocking script anti-flash

---

## Document List

| File | Content |
|------|--------|
| [`01-PROJECT-OVERVIEW.md`](./01-PROJECT-OVERVIEW.md) | Stack, setup, scripts, environment vars |
| [`02-ROUTE-MAP.md`](./02-ROUTE-MAP.md) | All routes, layout groups, sidebar, auth guard |
| [`03-ARCHITECTURE-BE.md`](./03-ARCHITECTURE-BE.md) | Backend: auth service, system-action-logger, server fns |
| [`04-ARCHITECTURE-FE.md`](./04-ARCHITECTURE-FE.md) | Frontend: routing, ThemeCustomizer, DemoNav, DataTable |
| [`05-DATABASE-SCHEMA.md`](./05-DATABASE-SCHEMA.md) | PostgreSQL (Kysely) + SQLite (system_action_logs) |
| [`06-RBAC-PERMISSIONS.md`](./06-RBAC-PERMISSIONS.md) | Group permission matrix, access control |
| [`07-SSE-JOBS.md`](./07-SSE-JOBS.md) | SSE job system (not implemented yet) |
| [`08-CODE-PATTERNS.md`](./08-CODE-PATTERNS.md) | Mandatory code patterns, anti-patterns |
| [`09-FLOW-DIAGRAMS.md`](./09-FLOW-DIAGRAMS.md) | Interactive flow diagrams (Mermaid) |
| [`10-ADR.md`](./10-ADR.md) | Architecture Decision Records |
| [`11-RUNBOOK-TROUBLESHOOTING.md`](./11-RUNBOOK-TROUBLESHOOTING.md) | Development runbook & troubleshooting |
| [`12-PRODUCTION-SCALING-GUIDE.md`](./12-PRODUCTION-SCALING-GUIDE.md) | Deployment & scaling guide |

---

## Quick Reference for Agent

### Adding a New Admin Feature
1. Create playground/UI di `src/features/crud/playgrounds/`
2. Tambah route di `src/routes/(app)/admin/`
3. Daftarkan di sidebar admin (`src/routes/(app)/admin/route.tsx`)
4. Integrasikan `logAudit()` dari `@/lib/server/audit-action`

### Design Decisions
| Feature | Decision |
|---------|----------|
| Auth | JWT stateless (`jose`), httpOnly cookie, 24h expiry |
| Audit Log | SQLite via `node:sqlite`, auto-create `logs/system-action.db` |
| Theme | CSS variables overrides via `useThemeCustomizer` hook + blocking script |
| Admin Routes | Protected via `beforeLoad` → `checkSession()` → redirect `/login` |
| CRUD State | In-memory `useState` (demo), audit via server fn `logAudit` |
| Tabs | shadcn `Tabs` with default variant (not `line`) |

### Troubleshooting
- Auth: Pastikan `JWT_SECRET` di `.env`
- Audit Log: `logs/system-action.db` auto-created
- Theme: Blocking script di `scripts` array di `__root.tsx`
- DB: `DATABASE_URL` dan `SSE_SHARED_SECRET` harus di `.env`
