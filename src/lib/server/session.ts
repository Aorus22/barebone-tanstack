import type { BackendActor } from "@/lib/server/context"
import { getSessionCookie } from "./cookie"

export type ServerSession = {
  sessionId?: string
  userId?: string
  actor?: BackendActor
  expiresAt?: Date
  impersonation?: {
    isImpersonating: boolean
    impersonatorUserId: string
    impersonatorName?: string
    originalSessionId: string | null
    impersonationStartedAt: Date | null
  }
}

type ServerSessionResolver = () => Promise<ServerSession>

let serverSessionResolver: ServerSessionResolver | undefined

export function setServerSessionResolver(resolver: ServerSessionResolver | undefined) {
  serverSessionResolver = resolver
}

async function defaultSessionResolver(): Promise<ServerSession> {
  const sessionToken = getSessionCookie()
  if (!sessionToken) {
    return { actor: undefined }
  }

  try {
    const { getSessionByToken } = await import("@/backend/auth/auth.service")
    const session = await getSessionByToken(sessionToken)

    if (!session) {
      return { actor: undefined }
    }

    return {
      sessionId: session.sessionId,
      userId: session.userId,
      actor: session.actor,
      expiresAt: session.expiresAt,
      impersonation: session.impersonation,
    }
  } catch {
    return { actor: undefined }
  }
}

export async function getServerSession(): Promise<ServerSession> {
  if (serverSessionResolver) {
    return serverSessionResolver()
  }

  return defaultSessionResolver()
}
