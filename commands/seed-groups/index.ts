import pg from "pg"
import { env } from "node:process"

const { Pool } = pg

const SUPERADMIN_GROUP_ID = "00000000-0000-0000-0000-000000000001"

const groupSeeds = [
  { id: SUPERADMIN_GROUP_ID, name: "Superadmin", description: "Full system access", is_default: true },
]

async function main() {
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL is required")

  const pool = new Pool({ connectionString: databaseUrl })
  const now = new Date()

  for (const g of groupSeeds) {
    await pool.query(
      `INSERT INTO group_accesses (id, name, description, is_active, is_default, created_at, updated_at, deleted_at)
       VALUES ($1, $2, $3, true, $4, $5, $5, null)
       ON CONFLICT (id) DO UPDATE SET
         name = $2, description = $3, is_active = true, is_default = $4, updated_at = $5, deleted_at = null`,
      [g.id, g.name, g.description, g.is_default, now]
    )
  }
  console.log(`  ${groupSeeds.length} groups upserted`)

  const { rows: modules } = await pool.query<{ id: string; key: string }>(
    `SELECT id, key FROM app_modules`
  )
  const { rows: permissions } = await pool.query<{ id: string; key: string }>(
    `SELECT id, key FROM permissions`
  )
  const moduleByKey = new Map(modules.map((m) => [m.key, m.id]))
  const permByKey = new Map(permissions.map((p) => [p.key, p.id]))

  for (const [groupId] of Object.entries({ [SUPERADMIN_GROUP_ID]: [] })) {
    await pool.query(
      `DELETE FROM group_module_visibilities WHERE group_id = $1`, [groupId]
    )

    const moduleIds = modules
      .map((m) => moduleByKey.get(m.key))
      .filter(Boolean) as string[]

    if (!moduleIds.length) continue

    const values = moduleIds.map((moduleId) => `('${crypto.randomUUID()}', '${groupId}', '${moduleId}', $1)`).join(",")
    await pool.query(
      `INSERT INTO group_module_visibilities (id, group_id, module_id, created_at) VALUES ${values}`,
      [now]
    )
  }
  console.log(`  Group module visibilities synced`)

  for (const [groupId] of Object.entries({ [SUPERADMIN_GROUP_ID]: [] })) {
    await pool.query(
      `DELETE FROM group_permissions WHERE group_id = $1`, [groupId]
    )

    const permIds = permissions
      .map((p) => permByKey.get(p.key))
      .filter(Boolean) as string[]

    if (!permIds.length) continue

    const values = permIds.map((permId) => `('${crypto.randomUUID()}', '${groupId}', '${permId}', $1)`).join(",")
    await pool.query(
      `INSERT INTO group_permissions (id, group_id, permission_id, created_at) VALUES ${values}`,
      [now]
    )
  }
  console.log(`  Group permissions synced`)

  await pool.end()
  console.log("seed-groups done!")
}

main().catch((err) => {
  console.error("seed-groups failed:", err)
  process.exit(1)
})
