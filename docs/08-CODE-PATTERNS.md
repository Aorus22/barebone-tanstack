# Code Patterns — Bare Bone

Collection of mandatory code implementation standards for adding or updating features.
Compliance is required to prevent architectural inconsistencies and client bundling failures.

---

## 1. Pattern: Server Function (Mutation)

Every **data mutation** operation (Create, Update, Delete, or business action):

```ts
// src/routes/(app)/<group>/<module>/server-action.ts

import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"
import { withSystemLog } from "@/lib/shared/with-system-log"
// ✅ Modules in @/lib/shared/* are safe for static import

// Complex procedures defined via createServerOnlyFn (not exposed as HTTP endpoint)
const runDeleteRecord = createServerOnlyFn(async (data: { id: string }) => {
  // Dynamic import REQUIRED for all server-only modules
  const { getServerActionContext } = await import("@/lib/server/context")
  const service = await import("@/backend/<module>/<module>.service")

  const ctx = await getServerActionContext()

  // Business logic and auth enforcement delegated to service layer
  return service.deleteRecord(ctx, data.id)
})

// Public Server Function (exposed as HTTP endpoint for client consumption)
export const deleteRecord = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { id: string })
  .handler(async ({ data }) => {
    // withSystemLog wrapper REQUIRED on every mutation
    return withSystemLog("module.delete", data, () => runDeleteRecord(data))
  })
```

---

## 2. Pattern: Server Function (Query / Read)

For **read operations** (read-only), `withSystemLog` is not required:

```ts
// src/routes/(app)/<group>/<module>/query.ts

import { createServerFn, createServerOnlyFn } from "@tanstack/react-start"

const runGetList = createServerOnlyFn(async (data: { page?: number; search?: string }) => {
  const { getServerActionContext } = await import("@/lib/server/context")
  const service = await import("@/backend/<module>/<module>.service")
  const ctx = await getServerActionContext()
  return service.getList(ctx, data)
})

export const getList = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as { page?: number; search?: string })
  .handler(async ({ data }) => runGetList(data))
```

---

## 3. Pattern: Service Layer

```ts
// src/backend/<module>/<module>.service.ts

import type { BackendContext } from "@/lib/server/context"
import { assertModuleVisible, assertModuleActionPermission } from "@/lib/server/module-rules"
import { AppError } from "@/lib/server/errors"
import * as repo from "./<module>.repository"

export async function deleteRecord(ctx: BackendContext, id: string) {
  // 1. Check auth FIRST
  assertModuleVisible(ctx.actor, "my-module")
  assertModuleActionPermission(ctx.actor, "my-module", "delete")

  // 2. Check data exists
  const record = await repo.findById(id)
  if (!record) {
    throw new AppError("NOT_FOUND", "Record not found.", { statusCode: 404 })
  }

  // 3. Business rule check
  if (record.status === "LOCKED") {
    throw new AppError("CANNOT_DELETE_LOCKED", "Locked records cannot be deleted.")
  }

  // 4. Execute
  await repo.deleteById(id)

  return { success: true }
}
```

---

## 4. Pattern: Repository Layer

```ts
// src/backend/<module>/<module>.repository.ts

import { getDb } from "@/lib/server/db/kysely"
import type { Transaction } from "kysely"
import type { Database } from "@/lib/server/db/schema"

export async function findById(id: string) {
  const db = getDb()
  return db
    .selectFrom("my_table")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst()
}

export async function deleteById(id: string, trx?: Transaction<Database>) {
  const db = trx ?? getDb()
  await db
    .deleteFrom("my_table")
    .where("id", "=", id)
    .execute()
}
```

---

## 5. Pattern: Route File (Page Component)

```tsx
// src/routes/(app)/<group>/<module>/index.tsx

import { createFileRoute } from "@tanstack/react-router"
import { getList } from "./query"

function MyPage() {
  return (
    <div>
      <h1>My Module</h1>
    </div>
  )
}

export const Route = createFileRoute("/(app)/<group>/<module>/")({
  component: MyPage,
  // Loader: can pre-load data on server side
  loader: async () => {
    return getList({ page: 1 })
  },
})
```

---

## 6. Pattern: Error Handling in Server Action

```ts
const runDoSomething = createServerOnlyFn(async (data: { id: string }) => {
  try {
    const service = await import("@/backend/module/module.service")
    const ctx = await (await import("@/lib/server/context")).getServerActionContext()

    const result = await service.doSomething(ctx, data.id)
    return { success: true, data: result }
  } catch (error) {
    const { humanizeUnknownError } = await import("@/lib/server/errors")
    return { success: false, message: humanizeUnknownError(error) }
  }
})
```

---

## 7. Pattern: Adding a New Module

Complete checklist when creating a new module:

### Step 1: Backend module
```
src/backend/<module>/
  <module>.service.ts   ← business logic
  <module>.repository.ts ← DB access (Kysely)
  <module>.types.ts     ← types/DTOs (if needed)
  index.ts              ← re-export
```

### Step 2: Frontend route
```
src/routes/(app)/<group>/<module>/
  index.tsx             ← main page
  query.ts              ← read server functions
  server-action.ts      ← mutation server functions
  -<component>.tsx      ← local components (prefix -)
```

### Step 3: Module config
```ts
// src/router/module-config.ts
{
  id: "my-module",
  path: "/<group>/my-module",
  label: "My Module",
  pageTitle: "My Module",
  visibleInSidebar: true,
  visibilityRule: "my-module",
  group: "<group>",
}
```

### Step 4: Permissions
```ts
// src/lib/shared/permissions.ts
// Add to MODULE_IDS
"my-module",

// Add to MODULE_AVAILABLE_ACTIONS
"my-module": ["create", "update"],
```

### Step 5: Seed
- Add module and permission to seed scripts
- Run seed to sync DB

---

## 8. Pattern: Adding an SSE Job

```ts
// In server-action.ts
const runLongOperation = createServerOnlyFn(async (data: { ... }) => {
  const sse = await import("@/backend/sse")
  const { getServerActionContext } = await import("@/lib/server/context")
  const ctx = await getServerActionContext()

  if (!ctx.actor?.id) return { success: false, message: "Unauthorized" }

  const job = await sse.createJob({
    actorId: ctx.actor.id,
    type: "module.operation",  // ← add to SseJobType first
    message: "Operation started.",
  })
  const jobId = job.id

  try {
    sse.updateJobStage({ jobId, stage: "processing", progress: 10, message: "Processing..." })

    // ... heavy work ...

    sse.completeJob(jobId, "Complete!", { result: "ok" })
    return { success: true, jobId }
  } catch (error) {
    const { humanizeUnknownError } = await import("@/lib/server/errors")
    sse.failJob(jobId, humanizeUnknownError(error))
    return { success: false, message: humanizeUnknownError(error), jobId }
  }
})
```

---

## 9. Pattern: Pagination List

```ts
// Service
export async function getList(ctx: BackendContext, params: {
  page?: number
  perPage?: number
  search?: string
  sort?: string
}) {
  assertModuleVisible(ctx.actor, "my-module")

  const { parseServerListQuery } = await import("@/lib/server/list-query")
  const query = parseServerListQuery(params)

  return repo.findMany(query)
}

// Repository
export async function findMany(query: ServerListQuery): Promise<PaginatedResult<MyRecord>> {
  const db = getDb()
  const offset = (query.page - 1) * query.perPage

  let q = db.selectFrom("my_table")

  if (query.search) {
    q = q.where((eb) =>
      eb.or([
        eb("name", "ilike", `%${query.search}%`),
        // ...
      ])
    )
  }

  const [{ count }, items] = await Promise.all([
    q.select((eb) => eb.fn.countAll<number>().as("count")).executeTakeFirstOrThrow(),
    q.selectAll().limit(query.perPage).offset(offset).execute(),
  ])

  return {
    items,
    page: query.page,
    perPage: query.perPage,
    totalItems: Number(count),
    totalPages: Math.ceil(Number(count) / query.perPage),
  }
}
```

---

## 10. Pattern: Toast + Confirm

```ts
// Toast
import { toast } from "sonner"
toast.success("Saved successfully.")
toast.error("Failed to save.")

// Confirm before destructive action
import { confirm } from "@/lib/client/confirm-modal"

async function handleDelete(id: string) {
  const ok = await confirm({
    title: "Delete data?",
    description: "This action cannot be undone.",
    confirmLabel: "Delete",
  })
  if (!ok) return

  const result = await deleteRecord({ data: { id } })
  if (result.success) {
    toast.success("Data deleted successfully.")
  } else {
    toast.error(result.message)
  }
}
```

---

## 11. Pattern: File Attachment & Preview

Pattern for file upload, serve, preview, and download via direct route URL.

### Preview Components (global)

| Component | File | Purpose |
|-----------|------|---------|
| `AttachmentFileRow` | `attachment-file-row.tsx` | Ready-to-use row: file icon + name + size + preview + download |
| `ImagePreviewWrapper` | `image-preview-wrapper.tsx` | Wrap trigger → image preview via react-photo-view |
| `PdfPreviewModal` | `pdf-preview-modal.tsx` | PDF modal with iframe + drag-to-pan + zoom |
| `DocxPreviewModal` | `docx-preview-modal.tsx` | DOCX modal via docx-preview + zoom |

### Flow

```
Upload → MinIO bucket (uploads/{timestamp}-{uuid}.{ext})
           ↓
Route handler /uploads/$fileName.ts → stream from MinIO
           ↓
Client uses direct route URL:
  <AttachmentFileRow fileUrl="/uploads/abc.pdf" ... />
```

### Usage

```tsx
// 1. Ready-to-use row (icon + name + size + preview + download)
<AttachmentFileRow
  fileUrl={`/uploads/${file.filePath.split("/").pop()}`}
  originalName={file.originalName}
  fileSize={file.fileSize}
  mimeType={file.mimeType}
/>

// 2. Standalone image preview
<ImagePreviewWrapper src={fileUrl}>
  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
</ImagePreviewWrapper>

// 3. Standalone PDF preview
<PdfPreviewModal fileUrl={fileUrl} fileName={file.originalName} />

// 4. Standalone DOCX preview
<DocxPreviewModal fileUrl={fileUrl} fileName={file.originalName} />

// 5. Download
<a href={fileUrl} target="_blank" rel="noopener noreferrer">
  <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
</a>
```

### Route Handler (serve from MinIO)

```ts
// src/routes/uploads/$fileName.ts
import { defineEventHandler } from "vinxi/http"
import { readStorageFile } from "@/lib/server/storage"

export const handler = defineEventHandler(async (event) => {
  const fileName = event.context.params.fileName
  const file = await readStorageFile(`uploads/${fileName}`)
  if (!file) throw createError({ statusCode: 404 })
  setResponseHeader(event, "Content-Type", file.mimeType)
  setResponseHeader(event, "Content-Disposition", "inline")
  return file.stream
})
```

### Upload in Service Layer

```ts
const { saveStorageFile } = await import("@/lib/server/storage")
const { Buffer } = await import("node:buffer")

const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`
await saveStorageFile({
  key,
  body: Buffer.from(file.buffer),
  mimeType: file.mimeType,
})
```

### Rules

- Direct route URL (`/uploads/...`) → no fetch/blob URL/base64 needed on client
- Download via plain `<a href>`
- Image preview via `react-photo-view` (PhotoProvider/PhotoView)
- PDF preview via iframe with `pointer-events-none` + drag-to-pan
- DOCX preview via `docx-preview` `renderAsync()` + CSS zoom
- Max file size validated in service layer

---

## Anti-Patterns — Do Not Do These

```ts
// ❌ Static import of server-only in route/tsx file
import { getDb } from "@/lib/server/db/kysely"
import { authService } from "@/backend/auth/auth.service"

// ❌ Business logic in server action / query
export const doThing = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    // All this should be in service.ts:
    if (data.status === "active" && data.count > 10) { ... }
    await db.updateTable("my_table").set({ ... }).execute()
  })

// ❌ Prisma Client for runtime queries
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
const result = await prisma.myTable.findMany()

// ❌ Throw raw Error in service (use AppError)
throw new Error("Not found")  // ← use throw new AppError(...)

// ❌ process.env directly
const url = process.env.DATABASE_URL  // ← use getServerEnv()

// ❌ Mutation without withSystemLog
export const createRecord = createServerFn({ method: "POST" })
  .handler(async ({ data }) => {
    // ← no withSystemLog, not recorded in system log
    return service.createRecord(data)
  })

// ❌ Duplicating module path definitions
const MODULE_PATH = "/my-module"  // ← already in module-config.ts

// ❌ Hardcoded permission string
if (actor.permissions.includes("users.delete")) { ... }
// ← use: canUseModuleAction(actor, "users", "delete")
```
