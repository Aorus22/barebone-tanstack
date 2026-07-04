import type { BackendActor } from "@/lib/server/context"

import { AppError } from "@/lib/server/errors"
import { getServerEnv } from "@/lib/server/env"

export const SESSION_TTL_MS = 24 * 60 * 60 * 1000
export const SESSION_COOKIE_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000

export function getSessionCookieConfig() {
  const env = getServerEnv()

  return {
    name: env.SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: env.SESSION_COOKIE_SECURE,
    sameSite: env.SESSION_COOKIE_SAME_SITE,
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  } as const
}

export type AuthActorClaims = {
  id: string
  name?: string
  visibleModules?: ReadonlyArray<string>
  permissions?: ReadonlyArray<string>
}

export type AccessPayload = {
  userId: string
  visibleModules: Array<string>
  permissions: Array<string>
}

type AccessPayloadResolver = (userId: string) => Promise<AccessPayload>

type InvalidateUserSessionsResolver = (userId: string) => Promise<void>

let accessPayloadResolver: AccessPayloadResolver | undefined
let invalidateUserSessionsResolver: InvalidateUserSessionsResolver | undefined

export function setAccessPayloadResolver(resolver: AccessPayloadResolver | undefined) {
  accessPayloadResolver = resolver
}

export function setInvalidateUserSessionsResolver(
  resolver: InvalidateUserSessionsResolver | undefined
) {
  invalidateUserSessionsResolver = resolver
}

export function buildBackendActorFromClaims(claims: AuthActorClaims): BackendActor {
  return {
    id: claims.id,
    name: claims.name,
    visibleModules: claims.visibleModules,
    permissions: claims.permissions,
  }
}

export async function loadAccessPayload(userId: string): Promise<AccessPayload> {
  if (!accessPayloadResolver) {
    throw new AppError(
      "ACCESS_PAYLOAD_RESOLVER_MISSING",
      "Access payload resolver belum dikonfigurasi.",
      { statusCode: 500 }
    )
  }

  return accessPayloadResolver(userId)
}

export async function hydrateActorAccessStrict(
  actor: BackendActor | undefined
): Promise<BackendActor | undefined> {
  if (!actor) return undefined

  const accessPayload = await loadAccessPayload(actor.id)

  return {
    ...actor,
    visibleModules: accessPayload.visibleModules,
    permissions: accessPayload.permissions,
  }
}

export async function invalidateAllUserSessions(userId: string) {
  if (!invalidateUserSessionsResolver) {
    throw new AppError(
      "INVALIDATE_USER_SESSIONS_RESOLVER_MISSING",
      "Invalidate user sessions resolver belum dikonfigurasi.",
      { statusCode: 500 }
    )
  }

  await invalidateUserSessionsResolver(userId)
}

export async function getCurrentAccessPayloadStrict(): Promise<AccessPayload> {
  const { getServerSession } = await import("@/lib/server/session")
  const session = await getServerSession()
  const actor = assertAuthenticatedActor(session.actor)

  return loadAccessPayload(actor.id)
}

export function assertAuthenticatedActor(actor: BackendActor | undefined): BackendActor {
  if (!actor) {
    throw new AppError("UNAUTHENTICATED", "Kamu harus login untuk melanjutkan.", {
      statusCode: 401,
    })
  }

  return actor
}
