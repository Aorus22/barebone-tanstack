# Developer Runbook & Troubleshooting — Bare Bone

This document contains standard operating procedures for local setup, database migration management, and runtime troubleshooting.

---

## 1. Local Development Setup

### Prerequisites
- Node.js v20 or latest LTS
- PostgreSQL v15 or v16 running locally
- `logs/` and `storage/` directories in project root (auto-generated if missing)

### Installation Procedure
1. Clone repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust values:
   ```bash
   cp .env.example .env
   ```
3. Set `DATABASE_URL` to your local PostgreSQL.
4. Run Prisma migrations to initialize database schema:
   ```bash
   npm run db:migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

---

## 2. Database Schema & Migration Management

When making database schema changes, follow this workflow:

1. **Edit Schema**: Edit `prisma/schema.prisma`.
2. **Create & Apply Migration (LOCAL)**: Run the following to generate SQL migration and apply it to your local DB:
   ```bash
   npm run db:migrate
   ```
   *Prisma detects differences, creates a new SQL file in `prisma/migrations/`, and automatically applies it to your local DB.*
3. **Sync Kysely**: After migration completes, update Kysely types in `src/lib/server/db/schema.ts` to match the new database structure.

### `migrate dev` vs `migrate deploy`

| Command | Environment | Function |
|---------|-------------|----------|
| `npx prisma migrate dev` | **Local (Dev)** | Reads schema, creates new `.sql` files in migrations folder, and applies directly to local DB interactively. |
| `npx prisma migrate deploy` | **Production / CI-CD** | Reads existing `.sql` files in migrations folder and applies them to production DB non-interactively. |

---

## 3. Local Database Reconstruction (Clean Reset)

To completely reset your local database:

```bash
# If a reset script exists, it will drop all schemas, re-run all migrations, and execute seed data
# Otherwise: manually drop and recreate, then run migrations
npm run db:migrate
```

---

## 4. Troubleshooting Procedures

### Case A: PostgreSQL Connection Failure (`Connection Refused`)
**Symptoms**: Server startup fails with `pg` connection error.

**Mitigation Steps**:
1. Verify PostgreSQL service is running:
   ```bash
   pg_isready -h localhost
   ```
2. Validate `DATABASE_URL` in `.env` file (host, user, password, port).
3. If using Docker, verify container network configuration.

---

### Case B: `MODULE_NOT_VISIBLE` or `PERMISSION_DENIED` on New Features
**Symptoms**: Access denied errors ("You don't have access") when accessing new modules.

**Mitigation Steps**:
1. Verify the new module is registered in `MODULE_IDS` at `src/lib/shared/permissions.ts`.
2. Verify seed scripts include the new module and permission definitions.
3. Run seed update to sync the database.
4. Logout and login again to regenerate session with updated `accessPayload`.

---

### Case C: Build Bundling Failure (`npm run build`)
**Symptoms**: Vite/Rollup shows `Module level directives cause errors when bundled` or server-only code leaking into client bundle.

**Mitigation Steps**:
1. Audit route files (`.tsx`). Ensure no **static imports** at top level from server-only directories (`@/backend/*` or `@/lib/server/*`).
2. Convert static imports to async **dynamic imports** inside function handlers:
   ```ts
   // ❌ ILLEGAL
   import { getDb } from "@/lib/server/db/kysely"
   
   // ✅ LEGAL
   const { getDb } = await import("@/lib/server/db/kysely")
   ```
3. Verify `routeFileIgnorePattern` in `vite.config.ts` ensures `query.ts` and `server-action.ts` files are ignored by the router generator.

---

### Case D: SQLite Database Lock (`Database Locked`)
**Symptoms**: `SQLITE_BUSY` error when writing system action logs to `logs/system-action.db`.

**Mitigation Steps**:
1. SQLite locks the entire database file during high-frequency concurrent writes.
2. Ensure `logs/system-action.db` is not opened by external database editors (DB Browser for SQLite, VSCode extensions).
3. Close external connections and restart the dev server.
