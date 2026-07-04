import pg from "pg"
import bcrypt from "bcryptjs"
import { env } from "node:process"

const { Pool } = pg

const SUPERADMIN_GROUP_ID = "00000000-0000-0000-0000-000000000001"
const SUPERADMIN_USER_ID = "11111111-1111-1111-1111-111111111111"

async function main() {
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL is required")

  const pool = new Pool({ connectionString: databaseUrl })
  const now = new Date()

  const { rows: allModules } = await pool.query<{ id: string }>(
    `SELECT id FROM app_modules`
  )
  const { rows: allPermissions } = await pool.query<{ id: string }>(
    `SELECT id FROM permissions`
  )

  await pool.query(
    `INSERT INTO group_accesses (id, name, description, is_active, is_default, created_at, updated_at, deleted_at)
     VALUES ($1, 'Superadmin', 'Full system access', true, true, $2, $2, null)
     ON CONFLICT (id) DO UPDATE SET
       name = 'Superadmin', description = 'Full system access', is_active = true, is_default = true, updated_at = $2, deleted_at = null`,
    [SUPERADMIN_GROUP_ID, now]
  )

  await pool.query(
    `DELETE FROM group_module_visibilities WHERE group_id = $1`, [SUPERADMIN_GROUP_ID]
  )
  if (allModules.length > 0) {
    const visValues = allModules.map((m) => `('${crypto.randomUUID()}', '${SUPERADMIN_GROUP_ID}', '${m.id}', $1)`).join(",")
    await pool.query(
      `INSERT INTO group_module_visibilities (id, group_id, module_id, created_at) VALUES ${visValues}`,
      [now]
    )
  }

  await pool.query(
    `DELETE FROM group_permissions WHERE group_id = $1`, [SUPERADMIN_GROUP_ID]
  )
  if (allPermissions.length > 0) {
    const permValues = allPermissions.map((p) => `('${crypto.randomUUID()}', '${SUPERADMIN_GROUP_ID}', '${p.id}', $1)`).join(",")
    await pool.query(
      `INSERT INTO group_permissions (id, group_id, permission_id, created_at) VALUES ${permValues}`,
      [now]
    )
  }
  console.log(`  Superadmin group synced (${allModules.length} modules, ${allPermissions.length} permissions)`)

  const passwordHash = await bcrypt.hash("superadmin", 10)
  await pool.query(
    `INSERT INTO user_accounts (id, username, password_hash, display_name, group_id, is_active, last_login_at, created_at, updated_at, deleted_at)
     VALUES ($1, 'superadmin', $2, 'Super Admin', $3, true, null, $4, $4, null)
     ON CONFLICT (id) DO UPDATE SET
       username = 'superadmin',
       password_hash = $2,
       display_name = 'Super Admin',
       group_id = $3,
       is_active = true,
       updated_at = $4,
       deleted_at = null`,
    [SUPERADMIN_USER_ID, passwordHash, SUPERADMIN_GROUP_ID, now]
  )
  console.log("  Superadmin user synced (superadmin / superadmin)")

  await pool.end()
  console.log("seed-core done!")
}

main().catch((err) => {
  console.error("seed-core failed:", err)
  process.exit(1)
})
