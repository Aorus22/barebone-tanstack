import pg from "pg"
import bcrypt from "bcryptjs"
import { env } from "node:process"

const { Pool } = pg

const SUPERADMIN_USER_ID = "11111111-1111-1111-1111-111111111111"

const userSeeds = [
  { id: SUPERADMIN_USER_ID, username: "superadmin", password: "superadmin", displayName: "Super Admin" },
]

async function main() {
  const databaseUrl = env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL is required")

  const pool = new Pool({ connectionString: databaseUrl })
  const now = new Date()

  const passwordHashByUsername = new Map<string, string>()
  for (const user of userSeeds) {
    if (!passwordHashByUsername.has(user.username)) {
      passwordHashByUsername.set(user.username, await bcrypt.hash(user.password, 10))
    }
  }

  for (const user of userSeeds) {
    const passwordHash = passwordHashByUsername.get(user.username)!
    await pool.query(
      `INSERT INTO user_accounts (id, username, password_hash, display_name, group_id, is_active, last_login_at, created_at, updated_at, deleted_at)
       VALUES ($1, $2, $3, $4, $5, true, null, $6, $6, null)
       ON CONFLICT (id) DO UPDATE SET
         username = $2,
         password_hash = $3,
         display_name = $4,
         group_id = $5,
         is_active = true,
         updated_at = $6,
         deleted_at = null`,
      [user.id, user.username, passwordHash, user.displayName, "00000000-0000-0000-0000-000000000001", now]
    )
  }

  console.log(`${userSeeds.length} users seeded`)
  await pool.end()
}

main().catch((err) => {
  console.error("seed-users failed:", err)
  process.exit(1)
})
