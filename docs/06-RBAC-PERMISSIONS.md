# RBAC & Permissions — Bare Bone

The access system is based on two layers: **module visibility** + **action permissions**.

Key files:

- `src/lib/shared/permissions.ts` — permission contracts (single source of truth in code)
- `src/lib/server/module-rules.ts` — enforcement functions
- `src/router/module-config.ts` — sidebar module config
- Seed scripts — DB initialization for modules & permissions (must stay in sync with permissions.ts)

---

## Two Access Layers

### 1. `visibleModules` — Module Visibility (Read Access)

Determines whether a user can see/access a module.

Example values: `["dashboard", "users", "settings"]`

If a module is not in `visibleModules` → backend throws 403, frontend hides from sidebar.

### 2. `permissions` — Action Permissions (Write Access)

Determines which mutation actions are allowed within modules that are already visible.

Format: `"<moduleId>.<action>"` — e.g., `"users.create"`, `"users.delete"`

---

## Module IDs

Currently **empty** in the codebase (`MODULE_IDS = [] as const`). These will be populated when domain modules are created:

```ts
export const MODULE_IDS = [] as const
```

To add modules, update `src/lib/shared/permissions.ts` with your domain module IDs.

---

## Available Actions per Module

Each module supports relevant mutation operations. Configured in `MODULE_AVAILABLE_ACTIONS`:

```ts
export const MODULE_ACTIONS = ["create", "read", "update", "delete"] as const
```

The `MODULE_AVAILABLE_ACTIONS` record maps each module ID to its allowed actions. Modules without action config are read-only.

---

## Special Permissions

Some permissions follow a non-standard format beyond `module.action`:

| Constant | Value | Description |
|----------|-------|-------------|
| `LOGIN_AS_PERMISSION` | `"auth.login_as"` | Can Login As another user |
| `RESET_PASSWORD_PERMISSION` | `"users.reset_password"` | Can reset user passwords |

Additional special permissions can be added per domain requirements.

---

## Enforcement in Backend

### Import

```ts
import {
  assertModuleVisible,
  assertPermission,
  assertModuleActionPermission,
} from "@/lib/server/module-rules"
import { LOGIN_AS_PERMISSION } from "@/lib/shared/permissions"
```

### Usage

```ts
// Check module visibility (read access)
assertModuleVisible(ctx.actor, "my-module")
// → throws AppError("MODULE_NOT_VISIBLE", 403) if no access

// Check standard permission (module.action)
assertModuleActionPermission(ctx.actor, "my-module", "update")
// → throws AppError("PERMISSION_DENIED", 403) if no permission

// Check special permission
assertPermission(ctx.actor, LOGIN_AS_PERMISSION)

// Boolean check (no throw)
const canDelete = canUseModuleAction(ctx.actor, "my-module", "delete")
const canLoginAs = canUsePermission(ctx.actor, LOGIN_AS_PERMISSION)
```

---

## Enforcement in Frontend (UX Only)

Frontend only shows/hides UI — **not security**:

```ts
// Get from session (root loader)
const permissions = session.actor?.permissions ?? []
const visibleModules = session.actor?.visibleModules ?? []

// Check module visibility
const canSeeUsers = visibleModules.includes("users")

// Check action permission
const canDeleteUser = permissions.includes("users.delete")

// Show/hide button
{canDeleteUser && <Button onClick={handleDelete}>Delete</Button>}
```

---

## Group Access Flow

```
User created with group_id
  ↓
group_accesses → group_module_visibilities → app_modules
              → group_permissions          → permissions

On login/request:
  auth.repository.findAccessPayloadByUserId(userId)
    → JOIN user_accounts + group_accesses + group_module_visibilities
    → Returns: { visibleModules: string[], permissions: string[] }
```

Access payload is loaded **fresh on every request** from DB (not from token/JWT).

---

## Per-User Overrides

Beyond group-level access, individual user overrides are possible:

- `user_module_visibilities` — add/override module visibility
- `user_permissions` — add/override permissions

---

## Group Authorization Dialog (UI)

Access rights configuration is managed in the user management module (`/settings/users`):

1. Select an access group
2. System displays modules grouped by category
3. Module checkbox enables read visibility for the group
4. For writable modules, a gear icon allows granular permission configuration (Create, Update, Delete)
5. Read-only modules show no configuration icon

**UI Sync Rules:**
- When module visibility is enabled, all supported actions are auto-checked
- When module visibility is disabled, all related action permissions are auto-removed

---

## Seed Synchronization

**Important**: The contract in `permissions.ts` must always stay in sync with the DB data.

When adding a new module or permission:

1. Update `MODULE_IDS` and `MODULE_AVAILABLE_ACTIONS` in `src/lib/shared/permissions.ts`
2. Update `src/router/module-config.ts` (add module entry)
3. Update seed scripts (add module and permission data)
4. Run seed to sync DB

If seed is not re-run, runtime permission checks will fail because DB data won't match the code contract.
