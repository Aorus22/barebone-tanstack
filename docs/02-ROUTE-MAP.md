# Route Map — Bare Bone

All routes are managed via **TanStack file-based routing**. The route generator reads `src/routes/` and auto-generates `src/routeTree.gen.ts`.

---

## Layout Groups

TanStack Router supports "pathless layout groups" with `(groupname)` folders.

| Layout Group | Path prefix | Auth?         | Layout                     |
| ------------ | ----------- | ------------- | -------------------------- |
| `(app)`      | —           | ✅ auth required | `AppShell` + `SseProvider` |
| `(auth)`     | —           | ❌ public     | Minimal layout             |
| `(landing)`  | —           | ❌ public     | —                          |

`(app)/route.tsx` executes `checkSession` in the `beforeLoad` function. If the user is not authenticated → router redirects to `/login`.

---

## All Routes

### Auth Routes (`(auth)/`)

| File                      | URL       | Description                     |
| ------------------------- | --------- | ------------------------------- |
| `(auth)/route.tsx`        | —         | Layout wrapper auth group       |
| `(auth)/login.tsx`        | `/login`  | Login page                      |
| `(auth)/logout.tsx`       | `/logout` | Server redirect after logout    |

### App Routes (`(app)/`)

| File                       | Description                                   |
| -------------------------- | --------------------------------------------- |
| `(app)/route.tsx`          | Layout group root — auth guard, AppShell      |

**No domain-specific routes exist yet.** When adding features, create modules under `(app)/<group>/<module>/`.

### Special Routes (root `routes/`)

| File              | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `__root.tsx`      | Root layout, `QueryClientProvider`, theme              |
| `index.tsx`       | Landing page                                           |
| `healthz.ts`      | Health check endpoint                                  |
| `readyz.ts`       | Readiness check endpoint                               |
| `api/`            | Standard API router (not used)                         |

---

## Local Files in Route Directory

Files prefixed with `-` are ignored by the router generator and will not be constructed as route pages:

```
settings/users/
  -user-dialog.tsx            ← Local component (ignored by router)
  -group-dialog.tsx
  index.tsx                   ← Active route file
  query.ts                    ← Server query utility (ignored)
  server-action.ts            ← Server mutation utility (ignored)
```

**Ignore Rules**: Files `query.ts` and `server-action.ts` are explicitly excluded from auto-registration via bundler configuration in `vite.config.ts`:

```ts
routeFileIgnorePattern: "(^|/)(__root-query|query|server-action)\\.ts$"
```

---

## Module Config (Single Source of Truth)

File: `src/router/module-config.ts`

Currently minimal — exports only types:

```ts
export type ModuleGroup = string
export type ModuleVisibilityRule = string
```

When adding modules, this file will define all sidebar modules with:
- `id` — unique identifier
- `path` — URL path (without leading `/`)
- `label` — sidebar label
- `pageTitle` — page title
- `visibilityRule` — string matching `module_id` in DB
- `group` — module group category

Helper functions to implement:
```ts
getModuleConfig(moduleId)        // find one module
getModulesByGroup(group)         // all modules per group
getVisibleModulesByGroup(...)    // filter by user access
getFirstVisibleModulePath(...)   // first accessible path
```

---

## Auth Flow

```
User accesses /app/*
  → (app)/route.tsx → beforeLoad → Execute checkSession()
  → Not authenticated → Redirect to /login

User submits login form
  → Execute server action loginUser() → Calls auth.service.login()
  → Session cookie stored (httpOnly, secure)
  → Redirect to first visible module

User clicks logout
  → Execute logoutUser() → Deactivate session in DB (revoke) → Cookie removal
  → Redirect to /login
```

### Account Impersonation (Login As)

Admin accounts with `auth.login_as` permission can simulate sessions as other users:
- `loginAs()` in `auth.service.ts` — Generates a new session linked to `impersonator_user_id`
- `returnFromImpersonation()` — Ends simulation and restores original admin session
- All impersonation activity is logged in `auth_impersonation_audits`

---

## App Shell Layout

File `src/components/global/app-shell.tsx` is the main layout wrapper for all protected pages:

- Dynamic Sidebar navigation (adapts to user permissions)
- Topbar with module group switcher and user profile
- `SseProvider` initializes EventSource for async progress monitoring
- `AppUpdateManager` monitors application build version updates
