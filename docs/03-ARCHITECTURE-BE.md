# Backend Architecture — Bare Bone

This document describes the backend architecture **based on the actual code**.

> For frontend, see `04-ARCHITECTURE-FE.md`.

---

## Main Boundary Flow

```
React component / page
  ↓
route/query.ts or route/server-action.ts
  (createServerFn wrapper + withSystemLog)
  ↓
createServerOnlyFn  ← internal call, not exposed as HTTP endpoint
  ↓
backend/<feature>/<feature>.service.ts
  ↓
backend/<feature>/<feature>.repository.ts
  ↓
lib/server/db/kysely.ts → PostgreSQL
```

**Key Layer Separation Principles:**
- Business Logic: Must be isolated in `service.ts`
- Database Access: Must be isolated in `repository.ts`
- Server Function Wrapper: Must be minimal — only handles initial auth verification and passes parameters to service layer
- Writing business logic or direct DB instructions inside `query.ts` or `server-action.ts` is **strictly prohibited**

---

## Backend Structure per Module

Each feature has its own backend module:

```
src/backend/
  auth/
    auth.service.ts       → login, logout, session, impersonation, password
    auth.repository.ts    → DB queries for sessions & users
    index.ts

  users/
    users.service.ts
    users.repository.ts
    users.types.ts
    index.ts

  sse/
    sse.service.ts    → in-memory job store
    sse.types.ts      → SseJob, SseJobType, SseStreamEvent types
    index.ts

  ai/
    ai.service.ts     → AI integration
```

**All other feature directories are empty and ready to be created.**

---

## Layer: Service

Service layer responsibilities:
- Business rules & domain logic
- Orchestration across repositories / modules
- Domain validation (after Zod input validation)
- Transaction boundary decisions
- Receives `BackendContext` from server function

```ts
// Example service signature
export async function createRecord(
  ctx: BackendContext,
  input: CreateInput,
  options?: { onProgress?: (...) => void }
) {
  // 1. assertModuleVisible / assertPermission
  // 2. business logic
  // 3. call repository
}
```

---

## Layer: Repository

Repository layer responsibilities:
- SQL queries via Kysely (not Prisma Client)
- Raw DB row to DTO / domain object mapping
- Receives optional transaction handle from service
- No business decisions

```ts
// Example: repository accepting transaction
export async function insertRecord(
  record: RecordInsert,
  trx?: Transaction<Database>
) {
  const db = trx ?? getDb()
  return db.insertInto("my_table").values(record).execute()
}
```

---

## Database Access

### Kysely (runtime queries)

Connection file: `src/lib/server/db/kysely.ts`
Schema types: `src/lib/server/db/schema.ts`

```ts
import { getDb } from "@/lib/server/db/kysely"

const db = getDb()
const result = await db
  .selectFrom("my_table")
  .selectAll()
  .where("status", "=", "active")
  .execute()
```

**Kysely Rules:**
- Always use `getDb()` — singleton connection
- Import Kysely via dynamic import in server actions needing lazy loading
- Do not import `getDb` at top level of route files

### Prisma (migration only)

Prisma is used only for:
- `prisma/schema.prisma` — database schema definition
- `prisma migrate dev` — creating SQL migrations

**Do not** use Prisma Client for runtime app queries.

---

## Server Function Pattern (Actual)

### `createServerFn` — public endpoint

Exposed as HTTP endpoint, callable from client.

```ts
// route/server-action.ts
export const loginUser = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data)
  .handler(async ({ data }) => {
    return withSystemLog("auth.login", data, async () => {
      const authService = await import("@/backend/auth/auth.service")
      const result = await authService.login(data)

      const { setSessionCookie } = await import("@/lib/server/cookie")
      setSessionCookie(result.sessionToken, new Date(result.expiresAt))
      return result
    })
  })
```

### `createServerOnlyFn` — internal server function

Not exposed as HTTP endpoint. Used for server-only logic called from `createServerFn`.

```ts
const runImport = createServerOnlyFn(async (data: { ... }) => {
  const { getServerActionContext } = await import("@/lib/server/context")
  const ctx = await getServerActionContext()
  // ... heavy logic
})

export const importData = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { ... })
  .handler(async ({ data }) => {
    return withSystemLog("module.import", data, () => runImport(data))
  })
```

### Dynamic Import — MANDATORY for server-only code

All imports from `@/backend/*`, `@/lib/server/*`, `node:*`, and `bcryptjs` **must** use dynamic import in the handler:

```ts
// ✅ CORRECT
const authService = await import("@/backend/auth/auth.service")

// ❌ WRONG — no static import at top level in server action files
import * as authService from "@/backend/auth/auth.service"
```

**Why?** Vite bundler will include server-only code into the client bundle if statically imported in route files.

---

## Backend Context

```ts
// src/lib/server/context.ts
export type BackendContext = {
  actor?: BackendActor  // currently logged-in user
  requestId: string     // UUID per request
  now: Date             // request timestamp
}

export async function getServerActionContext(): Promise<BackendContext>
```

`BackendActor` extends `ActorWithAccess`:
```ts
type BackendActor = {
  id: string
  name?: string
  visibleModules?: ReadonlyArray<string>
  permissions?: ReadonlyArray<string>
}
```

Usage in service:
```ts
export async function doSomething(ctx: BackendContext, ...) {
  assertModuleVisible(ctx.actor, "my-module")
  assertModuleActionPermission(ctx.actor, "my-module", "update")
  // ...
}
```

---

## Error Handling

### AppError (mandatory in service layer)

```ts
// src/lib/server/errors.ts
export class AppError extends Error {
  readonly code: string
  readonly fieldErrors?: Record<string, Array<string>>
  readonly statusCode?: number

  constructor(code: string, message: string, options?: { cause?, fieldErrors?, statusCode? })
}
```

Examples:
```ts
throw new AppError("NOT_FOUND", "Record not found.", { statusCode: 404 })
throw new AppError("PERMISSION_DENIED", "Access denied.", { statusCode: 403 })
throw new AppError("VALIDATION_ERROR", "Invalid data.", { fieldErrors: { email: ["Invalid format"] } })
```

### `humanizeUnknownError`

Converts any error into a safe message for the user:
```ts
const { humanizeUnknownError } = await import("@/lib/server/errors")
return { success: false, message: humanizeUnknownError(error) }
```

---

## System Action Log (withSystemLog)

**Every** server action mutation must be wrapped with `withSystemLog`.

File: `src/lib/shared/with-system-log.ts`

```ts
export async function withSystemLog<TData>(
  actionName: string,       // format: "module.operation" (e.g. "users.create")
  payload: unknown,         // input data (sanitized, passwords redacted)
  run: () => Promise<TData>,
  options?: { actorOverride?: { actorId?: string | null; actorName?: string | null } }
): Promise<TData>
```

Log stored in SQLite: `logs/system-action.db` (auto-created).
Log fields: requestId, actionName, module, operation, actorId, actorName, sessionId, status, durationMs, errorCode, errorMessageSafe, payloadJson.

**Naming Convention**: `<module>.<operation>` — e.g., `auth.login`, `auth.logout`, `users.create`.

---

## Session & Auth

### Session lifecycle
1. Login → `auth.service.login()` → generate token (48 random bytes) → store token hash (SHA256) in DB
2. Request → `getServerSession()` → read cookie → hash token → query DB → load `accessPayload`
3. Logout → `auth.service.logout()` → set `revoked_at` in `user_sessions`

### Access payload
On every request, user access is loaded fresh from DB:
```ts
// auth.repository.findAccessPayloadByUserId()
// Queries group_module_visibilities and group_permissions based on user.group_id
// Returns: { visibleModules: string[], permissions: string[] }
```

---

## Transaction Boundary

Services requiring atomicity use Kysely transactions:

```ts
await db.transaction().execute(async (trx) => {
  await repo.insertBatch(batch, trx)
  await repo.insertBatchItems(items, trx)
})
```

Repository accepts optional `trx` parameter and falls back to `getDb()`.

---

## File Storage (Local/MinIO)

File: `src/lib/server/storage.ts`

```ts
const saved = await saveStorageFile({
  file: buffer,          // Blob | ArrayBuffer | Uint8Array
  directory: "uploads",  // sub-directory in storage/
  fileName: "photo.jpg"  // optional, auto UUID if empty
})
// saved.path → "uploads/photo.jpg"

await deleteStorageFile("uploads/photo.jpg")
```

Root storage: `{cwd}/storage/`. Path traversal is protected.

---

## Pagination (List Query)

Standard list query schema:
```ts
// src/lib/server/list-query.ts
const serverListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  perPage: z.coerce.number().int().min(1).max(200).catch(20),
  search: z.string().catch(""),
  sort: z.string().catch("createdAt.desc"),
})

type PaginatedResult<TItem> = {
  items: Array<TItem>
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}
```

---

## Auth Rules in Backend (Enforcement)

Must be enforced in service layer **before** any action:

```ts
// 1. Check module visible (read access)
assertModuleVisible(ctx.actor, "my-module")

// 2. Check action permission (write access)
assertModuleActionPermission(ctx.actor, "my-module", "update")

// 3. Check special permission
assertPermission(ctx.actor, SPECIAL_PERMISSION)
```

Functions from `src/lib/server/module-rules.ts`:
- `canViewModule(actor, moduleId)` → boolean
- `assertModuleVisible(actor, moduleId)` → throw AppError if not allowed
- `canUsePermission(actor, permission)` → boolean
- `assertPermission(actor, permission)` → throw AppError
- `canUseModuleAction(actor, moduleId, action)` → boolean
- `assertModuleActionPermission(actor, moduleId, action)` → throw AppError

---

## Enum Convention

Enums defined as `const` + `type` (not TypeScript `enum`):

```ts
export const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const
export type StatusOption = (typeof STATUS_OPTIONS)[number]
```

---

## Import Boundary Rules (BE)

- `@/backend/*` → **server-only**, dynamic import in server fn
- `@/lib/server/*` → **server-only**, dynamic import in server fn
- `@/lib/shared/*` → safe for static import (client + server safe)
- `@/lib/client/*` → **client-only**, do not import in server code
- `node:*` → dynamic import in server fn
- `bcryptjs` → dynamic import in server fn

---

## Anti-Patterns (Strictly Prohibited)

```ts
// ❌ Static import of server-only in route file top level
import { getDb } from "@/lib/server/db/kysely"

// ❌ Business logic in query.ts or server-action.ts
const runGetList = createServerOnlyFn(async () => {
  if (status === "active") { /* ← this is business logic, should be in service */ }
})

// ❌ Prisma Client for runtime queries
const records = await prisma.myTable.findMany()

// ❌ Raw Error without AppError in service layer
throw new Error("not allowed")

// ❌ process.env directly
const url = process.env.DATABASE_URL  // ← use getServerEnv()
```
