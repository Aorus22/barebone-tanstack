# Frontend Architecture — Bare Bone

This document describes the frontend architecture **based on the actual code**.

> For backend, see `03-ARCHITECTURE-BE.md`.

---

## Goals

- Clear separation between UI/client code and server business logic
- Consistent UI/UX across modules
- Predictable feature folder structure

---

## Stack FE

- React 19 + TypeScript
- TanStack Router (file-based routing) + TanStack Start
- TanStack Table v8 (all tables)
- TanStack Query (via `@tanstack/react-router-ssr-query`)
- shadcn/ui + Tailwind CSS v4
- Sonner (toast notifications)
- Zod (client-side form validation)
- Tiptap v3 (rich text editor)
- Recharts (charts)
- Motion (animations)

---

## Structure `src/` (FE Scope)

```
src/
  routes/
    (app)/
      route.tsx           → layout group, auth guard
      <group>/            → module groups (warehouse, settings, etc.)
        <module>/         → feature modules
          index.tsx       → page component
          query.ts        → server functions for reads
          server-action.ts → server functions for mutations
          -component.tsx  → local components (prefix -)
    (auth)/
      login.tsx
      logout.tsx
    __root.tsx            → root layout
    __root-query.ts       → root loader

  components/
    global/
      app-shell.tsx              → main layout (sidebar + topbar + QueryClientProvider)
      sidebar.tsx                → navigation + user profile popover + group switcher
      topbar.tsx                 → header with breadcrumbs
      data-table.tsx             → reusable TanStack Table wrapper
      confirm-modal-provider.tsx → global confirm dialog
      sse-provider.tsx           → SSE connection to /sse endpoint
      app-update-manager.tsx     → check & prompt app update
      reset-password-dialog.tsx  → reset password dialog from sidebar
      image-preview-wrapper.tsx  → image preview via react-photo-view
      pdf-preview-modal.tsx      → PDF preview via iframe + drag-to-pan + zoom
      docx-preview-modal.tsx     → DOCX preview via docx-preview + zoom
      attachment-file-row.tsx    → row: icon + name + size + preview + download
      not-found-page.tsx         → 404 page
    ui/
      ... (shadcn components)
      custom/             → custom UI components

  hooks/
    use-mobile.ts
    use-sse-jobs.ts       → subscribe to SSE job updates

  router/
    module-config.ts      → single source of truth for sidebar modules

  lib/
    client/               → client-only helpers
    shared/
      permissions.ts      → MODULE_ACTIONS, permission constants
      with-system-log.ts  → system log wrapper (shared, usable by server fn)

  ui/
    custom/               → extended custom UI

  utils/
    client-utils/
    server-utils/
```

---

## Routing

### File-Based Routing

Routes are auto-generated from `src/routes/` structure. The router generator produces `src/routeTree.gen.ts`.

**Routing rules:**
- Each page = one route file at `src/routes/(app)/<group>/<module>/index.tsx`
- Sub-routes = files or sub-folders inside the module folder
- Files prefixed with `-` → local component, **not** a route
- Files `query.ts` and `server-action.ts` → ignored by router (via `routeFileIgnorePattern`)

### Layout Groups

```
(app)/route.tsx      → auth guard + AppShell wrapper
  <group>/            → module groups (no additional layout)

(auth)/route.tsx     → login layout
```

### Route File Pattern

```tsx
// src/routes/(app)/<group>/<module>/index.tsx
import { createFileRoute } from "@tanstack/react-router"

function MyPage() {
  return <div>...</div>
}

export const Route = createFileRoute("/(app)/<group>/<module>/")({
  component: MyPage,
  // Optional:
  // loader: async ({ context }) => await getPageData({...}),
  // beforeLoad: async () => { ... }
})
```

---

## Server Functions in Frontend

### `query.ts` — Data Fetching

Contains `createServerFn({ method: "POST" })` or `GET` for data fetching. Does not need `withSystemLog` for read-only queries.

```ts
// routes/(app)/<group>/<module>/query.ts
const runGetList = createServerOnlyFn(async (data: {...}) => {
  const { getServerActionContext } = await import("@/lib/server/context")
  const ctx = await getServerActionContext()
  return someService.getList(ctx, data)
})

export const getList = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as {...})
  .handler(async ({ data }) => runGetList(data))
```

### `server-action.ts` — Mutations

Contains `createServerFn` for mutations. **Must** be wrapped with `withSystemLog`.

```ts
// routes/(app)/<module>/server-action.ts
export const createRecord = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    return withSystemLog("module.create", data, async () => {
      const service = await import("@/backend/<module>/<module>.service")
      return service.create(ctx, data)
    })
  })
```

---

## UI Components

### shadcn/ui

Components available at `src/components/ui/`. Add via:
```sh
npx shadcn@latest add <component-name>
```

Import:
```ts
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
```

### Global Components

| Component | Path | Description |
|-----------|------|-------------|
| `AppShell` | `components/global/app-shell.tsx` | Main layout (sidebar + topbar) |
| `DataTable` | `components/global/data-table.tsx` | TanStack Table wrapper |
| `ConfirmModalProvider` | `components/global/confirm-modal-provider.tsx` | Global confirm dialog |
| `SseProvider` | `components/global/sse-provider.tsx` | SSE connection, job subscription |
| `Sidebar` | `components/global/sidebar.tsx` | Navigation + group switcher |
| `Topbar` | `components/global/topbar.tsx` | App header |

---

## Tables

All tables use **TanStack Table v8** via the `DataTable` component.

```tsx
import { DataTable } from "@/components/global/data-table"

const columns: ColumnDef<MyRow>[] = [...]

<DataTable columns={columns} data={rows} />
```

---

## Forms

Forms use Zod for client-side validation.
Pattern:
1. Define Zod schema
2. Parse/safeParse before submit
3. Handle `fieldErrors` from `AppError` response

No form library (no react-hook-form). Form state managed locally in page components.

---

## Toast Notifications

Uses **Sonner**:
```ts
import { toast } from "sonner"

toast.success("Saved successfully")
toast.error("An error occurred")
toast.loading("Processing...")
```

---

## Confirm Modal

Global confirm dialog via `ConfirmModalProvider`:

```ts
import { confirm } from "@/lib/client/confirm-modal"

const ok = await confirm({
  title: "Delete data?",
  description: "This action cannot be undone.",
  confirmLabel: "Delete",
})
if (ok) { /* proceed */ }
```

---

## SSE (Server-Sent Events) in Frontend

### SseProvider

`src/components/global/sse-provider.tsx` opens a connection to the `/sse` endpoint and exposes job state via React context.

### Hook: `useSseJobs`

```ts
const { jobs, activeJobs } = useSseJobs()
// jobs: SseJob[]
// activeJobs: SseJob[] (status queued or running)
```

---

## Auth & Session in FE

### Auth check in routes

Done in `(app)/route.tsx` via `checkSession` server function — no need for per-route checks.

### Session data access

Session is loaded in `__root-query.ts` (root loader) and available via router context.

### Impersonation UI

Sidebar shows a banner when in impersonation mode.
"Return to original account" button calls `returnToOriginalAccount()`.

---

## Permission Check in FE

Frontend shows/hides UI based on permissions (UX only, **not security**):

```ts
// Get permissions from session actor
const permissions = session.actor?.permissions ?? []

// Check visibility
const canCreate = permissions.includes("users.create")
```

**Remember**: Real security is enforced in backend. Hiding buttons in UI = UX, not security.

---

## Module Config & Sidebar Design Standards

Sidebar reads `moduleConfig` from `src/router/module-config.ts` and filters based on `session.actor.visibleModules`.

Group switcher in topbar: toggles between module groups.

### Sidebar UI/UX Standards:

1. **Dynamic Menu Rendering**: Sidebar renders all menus in a single loop in linear order as declared in module-config. Rendered parents tracked via `Set` to prevent duplicate rendering.

2. **Parent Menu Alignment**: Parent menus use uniform text size, padding, and icon size. Highlighted with border only when a child is active.

3. **Sub-menu Visual Design**: Sub-menus wrapped in left-border container. Smaller font and padding for hierarchy indication.

4. **Instant Transitions & Optimistic UI**: Active items use `transition-none` for instant color switching. Sidebar uses `pendingModulePath` state for optimistic UI highlighting.

5. **Collapsed Alignment**: When sidebar is collapsed (88px width), vertical lines hidden, child menu icons aligned with parent.

6. **Auto Scroll-Into-View**: `scrollIntoView({ behavior: "smooth", block: "nearest" })` via `useEffect` on page load or navigation change.

---

## Import Boundary Rules (FE)

- `@/lib/client/*` — **client-only**, do not import in server fn handlers
- `@/lib/server/*` — **server-only**, do not import in React components
- `@/lib/shared/*` — safe, usable anywhere
- `@/components/*` — client-only React components
- `@/backend/*` — **server-only**, only dynamic import in server fn handlers

---

## Anti-Patterns (Strictly Prohibited)

```ts
// ❌ Business logic in page component
function MyPage() {
  const processData = (data) => {
    // ← this should be in service layer
    if (data.some(r => r.isDuplicate)) { ... }
  }
}

// ❌ Import server-only code in React components
import { getDb } from "@/lib/server/db/kysely"  // ← crashes on client

// ❌ Mutation without withSystemLog in server-action.ts
export const deleteRecord = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    await service.delete(data.id)  // ← not logged in system log
  })

// ❌ Duplicating module label/path across files
// Use moduleConfig from src/router/module-config.ts as single source of truth
```
