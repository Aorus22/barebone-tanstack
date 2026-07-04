# Database Schema — Bare Bone

Schema runtime types at `src/lib/server/db/schema.ts` (Kysely types).
Schema migration at `prisma/schema.prisma`.
DB connection: `src/lib/server/db/kysely.ts` → `getDb()`

---

## Current State

The project is a skeleton. `prisma/schema.prisma` is currently **empty** — no tables have been defined yet. The following tables are **planned** based on the auth and infrastructure code already in the codebase:

### Auth & User Tables (planned)

| Table | Description |
|-------|-------------|
| `user_accounts` | Internal users |
| `user_sessions` | Active sessions per user |
| `group_accesses` | Access groups (role groups) |
| `group_module_visibilities` | Module visibility per group |
| `group_permissions` | Permissions per group |
| `app_modules` | Module definitions (from seed) |
| `permissions` | Permission definitions (from seed) |
| `user_module_visibilities` | Per-user module visibility overrides |
| `user_permissions` | Per-user permission overrides |
| `auth_impersonation_audits` | Login As audit trail |

### Domain Tables (to be added)

When implementing your domain, add tables via Prisma schema and migrations. The system is designed to be extended with any domain-specific tables.

---

## Planned Table Details

These are the tables the infrastructure code expects. They will need to be created in `prisma/schema.prisma` and have corresponding Kysely types in `src/lib/server/db/schema.ts`.

### `user_accounts`
```
id                string (uuid)
username          string — unique
password_hash     string | null — bcrypt hash
display_name      string | null
group_id          string | null — FK to group_accesses
is_active         boolean
last_login_at     Date | null
created_at        Date
updated_at        Date
deleted_at        Date | null — soft delete timestamp
```

### `user_sessions`
```
id                         string (uuid)
user_id                    string (FK user_accounts)
session_token_hash         string — SHA256(raw token)
impersonator_user_id       string | null — if impersonating
original_session_id        string | null
impersonation_started_at   Date | null
expires_at                 Date
last_seen_at               Date | null
revoked_at                 Date | null — null = active
ip_address                 string | null
user_agent                 string | null
created_at / updated_at    Date
```

### `group_accesses`
```
id            string (uuid)
name          string
description   string | null
is_active     boolean
is_default    boolean — default group for new users
created_at / updated_at / deleted_at
```

### `app_modules` + `permissions`
Master data tables initialized via seed scripts. Metadata modifications should only be done through seed script updates.

---

## System Log (Separate SQLite)

System log is **not** in PostgreSQL. Stored in a SQLite file:
- Path: `{cwd}/logs/system-action.db`
- Auto-created on first write
- Accessed via `node:sqlite` (Node.js built-in)
- Table: `system_action_logs`
- Queried via `src/lib/server/system-action-logger.ts`

This is **separate** from the main PostgreSQL schema.

---

## How to Extend the Schema

1. Edit `prisma/schema.prisma` to add new tables
2. Run migration:
   ```bash
   npm run db:migrate
   ```
3. Update Kysely types in `src/lib/server/db/schema.ts` to match new tables
4. Use `getDb()` in repository layer for runtime queries

---

## Query Example (Kysely)

```ts
import { getDb } from "@/lib/server/db/kysely"

const db = getDb()

// Select
const records = await db
  .selectFrom("my_table as t")
  .select(["t.id", "t.name"])
  .where("t.status", "=", "active")
  .orderBy("t.created_at", "desc")
  .limit(20)
  .execute()

// Insert
await db
  .insertInto("my_table")
  .values({
    id: crypto.randomUUID(),
    name: "Example",
    ...
  })
  .execute()

// Transaction
await db.transaction().execute(async (trx) => {
  await trx.insertInto("table_a").values(...).execute()
  await trx.insertInto("table_b").values(...).execute()
})
```
