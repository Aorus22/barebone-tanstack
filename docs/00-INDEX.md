# Bare Bone — Knowledge Base Index

This document is the main entry point for all project documentation.
**Read this first** before reading other documents.

---

## Project Summary

Bare Bone is a **generic full-stack application skeleton** built with TanStack Start + React + TypeScript. It provides a ready-to-use foundation for building any web application domain. The current state is a **clean template** — no business domain has been implemented yet.

- Stack: TanStack Start (full-stack React SSR), PostgreSQL (Kysely), Prisma (migration)
- Render: SSR via Nitro, file-based routing via TanStack Router
- Current state: Skeleton with auth, RBAC, SSE, UI shell, and code architecture patterns

---

## Document List

| File | Content |
|------|--------|
| [`01-PROJECT-OVERVIEW.md`](./01-PROJECT-OVERVIEW.md) | Stack, setup, scripts, environment vars |
| [`02-ROUTE-MAP.md`](./02-ROUTE-MAP.md) | All routes, layout groups, sidebar |
| [`03-ARCHITECTURE-BE.md`](./03-ARCHITECTURE-BE.md) | Backend: service layer, repository, server fn, contracts |
| [`04-ARCHITECTURE-FE.md`](./04-ARCHITECTURE-FE.md) | Frontend: routing, components, query, SSE, UI patterns |
| [`05-DATABASE-SCHEMA.md`](./05-DATABASE-SCHEMA.md) | All Kysely tables (actual schema) |
| [`06-RBAC-PERMISSIONS.md`](./06-RBAC-PERMISSIONS.md) | Access system: visibleModules, permissions, module actions |
| [`07-SSE-JOBS.md`](./07-SSE-JOBS.md) | In-memory SSE job system, job types, usage |
| [`08-CODE-PATTERNS.md`](./08-CODE-PATTERNS.md) | Mandatory code patterns, anti-patterns, real examples |
| [`09-FLOW-DIAGRAMS.md`](./09-FLOW-DIAGRAMS.md) | Interactive flow diagrams (Mermaid) |
| [`10-ADR.md`](./10-ADR.md) | Architecture Decision Records (Design Rationale) |
| [`11-RUNBOOK-TROUBLESHOOTING.md`](./11-RUNBOOK-TROUBLESHOOTING.md) | Development runbook & troubleshooting |
| [`12-PRODUCTION-SCALING-GUIDE.md`](./12-PRODUCTION-SCALING-GUIDE.md) | Deployment & scaling guide |

---

## Quick Reference for Agent

### Adding a New Feature
1. Create backend module at `src/backend/<feature>/`
2. Add route at `src/routes/(app)/<group>/<module>/`
3. Register module in `src/router/module-config.ts`
4. Register permission in `src/lib/shared/permissions.ts`

### Design Decisions & Architecture
→ Technology choices (Kysely, SQLite, In-Memory SSE) documented in [`10-ADR.md`](./10-ADR.md).

### Troubleshooting
→ Database locks, bundling errors, and permission issues in [`11-RUNBOOK-TROUBLESHOOTING.md`](./11-RUNBOOK-TROUBLESHOOTING.md).

### Production Deployment Policy
→ Blue/green deploy workflow, deploy guard scripts, and shell guards in [`12-PRODUCTION-SCALING-GUIDE.md`](./12-PRODUCTION-SCALING-GUIDE.md).

### Server Function & Mutation Patterns
→ See `createServerFn`, `createServerOnlyFn`, and `withSystemLog` wrapper patterns in [`08-CODE-PATTERNS.md`](./08-CODE-PATTERNS.md).

### Database Runtime Access
→ Database access must use Kysely query builder referencing schema definitions at `src/lib/server/db/schema.ts`. See [`05-DATABASE-SCHEMA.md`](./05-DATABASE-SCHEMA.md).

### Backend Authorization Enforcement
→ See `assertModuleVisible` and `assertModuleActionPermission` mechanisms in [`06-RBAC-PERMISSIONS.md`](./06-RBAC-PERMISSIONS.md).

### Real-time Process Management (SSE)
→ In-memory progress job creation, updates, and completion documented in [`07-SSE-JOBS.md`](./07-SSE-JOBS.md).

---

## Path Aliases

| Alias | Resolves to |
|-------|------------|
| `@/backend/*` | `src/backend/*` |
| `@/lib/server/*` | `src/lib/server/*` |
| `@/lib/client/*` | `src/lib/client/*` |
| `@/lib/shared/*` | `src/lib/shared/*` |
| `@/components/*` | `src/components/*` |
| `@/router/*` | `src/router/*` |
| `@/hooks/*` | `src/hooks/*` |
| `@/utils/*` | `src/utils/*` |

---

## Current State

This is a **skeleton project** with no domain-specific modules yet. The following infrastructure is ready:

- **Auth**: Custom session-based auth (cookie + SHA256 token hash)
- **RBAC**: Module visibility + action permissions system
- **SSE**: In-memory job progress tracking infrastructure
- **UI Shell**: AppShell, Sidebar, Topbar, DataTable, and global components
- **Architecture**: Service/Repository separation, server function patterns
- **Database**: Kysely query builder ready, Prisma for migrations
- **File Storage**: S3-compatible (MinIO) infrastructure
