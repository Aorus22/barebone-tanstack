import type { Database } from "@/lib/server/db/schema"

import { getServerEnv } from "@/lib/server/env"
import { Kysely, PostgresDialect } from "kysely"
import { Pool } from "pg"

export type Db = Kysely<Database>

let db: Db | undefined

export function getDb(): Db {
  if (!db) {
    const env = getServerEnv()

    db = new Kysely<Database>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: env.DATABASE_URL,
        }),
      }),
    })
  }

  return db
}

export async function healthcheckDb() {
  const env = getServerEnv()

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
  })

  try {
    await pool.query("SELECT 1")
  } finally {
    await pool.end()
  }
}
