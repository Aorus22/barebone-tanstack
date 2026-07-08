import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { getDb } from "@/lib/server/db/kysely"

const JWT_ALG = "HS256"

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET environment variable is required")
  return new TextEncoder().encode(secret)
}

export type AuthActor = {
  id: string
  name: string
  username: string
  groupId: string | null
  visibleModules: string[]
}

export type AuthSession = {
  sessionId: string
  userId: string
  actor: AuthActor
  expiresAt: Date
}

/** Generate a JWT token for a given actor. */
async function createJwt(actor: AuthActor): Promise<{ token: string; expiresAt: Date }> {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24) // 24h
  const token = await new SignJWT({ sub: actor.id, actor })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(getJwtSecret())

  return { token, expiresAt }
}

/** Verify a JWT token and return the actor payload. */
async function verifyJwt(token: string): Promise<AuthActor | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: [JWT_ALG] })
    return (payload.actor as AuthActor) ?? null
  } catch {
    return null
  }
}

/** Login with username + password. Returns session or throws. */
export async function login(username: string, password: string): Promise<{ sessionToken: string; expiresAt: Date; actor: AuthActor }> {
  const db = getDb()

  const user = await db
    .selectFrom("user_accounts")
    .selectAll()
    .where("username", "=", username)
    .where("deleted_at", "is", null)
    .executeTakeFirst()

  if (!user) throw new Error("Invalid username or password")
  if (!user.is_active) throw new Error("Account is disabled")
  if (!user.password_hash) throw new Error("Account has no password set")

  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) throw new Error("Invalid username or password")

  // Load group modules/permissions
  let visibleModules: string[] = []
  if (user.group_id) {
    const modules = await db
      .selectFrom("app_modules")
      .innerJoin("group_module_visibilities", "group_module_visibilities.module_id", "app_modules.id")
      .where("group_module_visibilities.group_id", "=", user.group_id)
      .select("app_modules.key")
      .execute()

    visibleModules = modules.map((m) => m.key)
  }

  const actor: AuthActor = {
    id: user.id,
    name: user.display_name ?? user.username,
    username: user.username,
    groupId: user.group_id,
    visibleModules,
  }

  const { token, expiresAt } = await createJwt(actor)

  // Update last login
  await db
    .updateTable("user_accounts")
    .set({ last_login_at: new Date() })
    .where("id", "=", user.id)
    .execute()

  return { sessionToken: token, expiresAt, actor }
}

/** Get session by JWT token (called by session.ts via cookie) */
export async function getSessionByToken(token: string): Promise<{
  sessionId: string
  userId: string
  actor: AuthActor
  expiresAt: Date
} | null> {
  const actor = await verifyJwt(token)
  if (!actor) return null

  return {
    sessionId: token.slice(0, 16),
    userId: actor.id,
    actor,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  }
}

/** Load access payload for a user — checks their group modules */
export async function loadAccessPayload(userId: string): Promise<{ visibleModules: string[] }> {
  try {
    const db = getDb()
    const user = await db
      .selectFrom("user_accounts")
      .select("group_id")
      .where("id", "=", userId)
      .executeTakeFirst()

    if (!user?.group_id) return { visibleModules: [] }

    const modules = await db
      .selectFrom("app_modules")
      .innerJoin("group_module_visibilities", "group_module_visibilities.module_id", "app_modules.id")
      .where("group_module_visibilities.group_id", "=", user.group_id)
      .select("app_modules.key")
      .execute()

    return { visibleModules: modules.map((m) => m.key) }
  } catch {
    return { visibleModules: [] }
  }
}

/** Logout — no-op for JWT (client just clears cookie) */
export async function logout(): Promise<void> {
  // JWT is stateless — just clear the cookie on the client side
}
