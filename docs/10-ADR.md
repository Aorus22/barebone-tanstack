# Architecture Decision Records (ADR) — Bare Bone

This document records important architectural decisions made in the Bare Bone project, along with their rationale and context.

---

## ADR 1: Kysely for Runtime Queries, Prisma for Migrations

### Status
**ACCEPTED**

### Context
We need a type-safe, fast query builder capable of handling complex SQL queries. Prisma is excellent for schema definition and migrations, but Prisma Client has runtime performance overhead and its nested relational queries generate suboptimal SQL that is hard to fine-tune.

### Decision
1. Use **Prisma only as the single source of truth for schema and migration engine** (`prisma/schema.prisma`).
2. Use **Kysely (`kysely`) as the primary runtime query builder** in the repository layer.
3. Kysely type-safety is ensured by maintaining matching type definitions in `src/lib/server/db/schema.ts`.

### Consequences
- Runtime queries are very fast and optimal.
- Raw SQL expressions can be written safely when needed for performance tuning.
- Developers/Agents are strictly prohibited from instantiating or using `PrismaClient` in service or repository layers.

---

## ADR 2: In-Memory SSE for Job Progress Feedback

### Status
**ACCEPTED**

### Context
Some backend operations take a long time (e.g., importing and validating thousands of records, processing uploads). We need a real-time progress feedback mechanism (0-100%) to the UI. Using a Redis queue + worker (`bullmq`) adds too much complexity and infrastructure overhead for this application's scale.

### Decision
1. Use **Server-Sent Events (SSE)** — lightweight and natively supported in browsers.
2. Implement an **In-Memory Job Store** (`src/backend/sse/sse.service.ts`) where all job states are kept in the Node.js/Nitro process memory.
3. Frontend uses `useSseJobs` hook via EventSource listener for state synchronization.

### Consequences
- Very simple architecture, zero external infrastructure dependencies (no Redis needed).
- Job state is lost on server restart/redeploy. This is an **accepted trade-off** because SSE is only for real-time UX feedback, not persistent audit data.

---

## ADR 3: Separate SQLite for System Action Log

### Status
**ACCEPTED**

### Context
We must record an audit trail for every server action mutation (who, what payload, what error, execution duration). If written to the main PostgreSQL database:
1. Increases transactional database I/O load.
2. Database size grows quickly since logs contain raw JSON data.
3. Large audit log queries could lock rows in transactional tables.

### Decision
1. Use a **separate SQLite database** for logging (`logs/system-action.db`).
2. Use Node.js native `node:sqlite` (`DatabaseSync`) — very fast and no network TCP overhead.
3. Logs are written asynchronously at the end of the `withSystemLog` wrapper function.

### Consequences
- Main transactional database (PostgreSQL) stays clean, lightweight, and fast.
- SQLite file can be backed up or pruned independently.
- SQLite logs are written asynchronously, so they don't block client response time.

---

## ADR 4: Two-Step Commit & External Backup for Data Import

### Status
**ACCEPTED**

### Context
Data import processes are vulnerable to mid-process failures (e.g., connection drops, corrupt files, duplicate IDs). If we write directly to the database in the first step, we risk corrupting database integrity or losing original backup files.

### Decision
1. **Step 1 (Preview)**: Parse, validate, and store validated data in an **In-Memory Preview Cache**. Return a `previewId` to the client.
2. **Step 2 (Backup)**: When the user confirms "Commit", the server first backs up the original data to external storage before writing to DB.
3. **Step 3 (DB Write)**: If the backup succeeds, write data from cache to PostgreSQL in a single Kysely transaction. On success, consume/delete the cache.

### Consequences
- If external backup fails, the PostgreSQL database is completely untouched (safe from partial/incomplete data).
- Preview cache data is not deleted until commit succeeds, allowing users to "Retry" without re-uploading the original file.

---

## ADR 5: Pure JS `bcryptjs` Over Native `bcrypt`

### Status
**ACCEPTED**

### Context
Installing the native `bcrypt` module often triggers C++ compilation errors in Docker environments, especially when switching CPU architectures between local development (M1/M2 Mac or Windows) and Linux x86 production servers.

### Decision
Use **`bcryptjs`** (pure JavaScript implementation) for password hashing.

### Consequences
- Slightly slower hashing compared to native C++ (not critical since login rate is low).
- Docker build process is guaranteed to succeed without requiring build-essential toolchains in the base OS image.
