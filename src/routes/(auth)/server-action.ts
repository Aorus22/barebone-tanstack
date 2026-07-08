import { createServerFn } from "@tanstack/react-start"
import { setSessionCookie, deleteSessionCookie } from "@/lib/server/cookie"

export const loginUser = createServerFn({ method: "POST" })
  .validator((data: { username: string; password: string }) => data)
  .handler(async ({ data }) => {
    const { login } = await import("@/backend/auth/auth.service")
    const { logAudit } = await import("@/lib/server/audit-action")
    try {
      const result = await login(data.username, data.password)
      setSessionCookie(result.sessionToken, result.expiresAt)
      await logAudit({ data: { actionName: "user.login", module: "Auth", operation: "login", actorName: result.actor.name, status: "SUCCESS" } })
      return { success: true, actor: result.actor }
    } catch (err) {
      await logAudit({ data: { actionName: "user.login", module: "Auth", operation: "login", actorName: data.username, status: "ERROR", errorMessage: err instanceof Error ? err.message : "Login failed" } })
      return { success: false, error: err instanceof Error ? err.message : "Login failed" }
    }
  })

export const logoutUser = createServerFn({ method: "POST" })
  .handler(async () => {
    const { logAudit } = await import("@/lib/server/audit-action")
    const { getServerSession } = await import("@/lib/server/session")
    const session = await getServerSession()
    deleteSessionCookie()
    await logAudit({ data: { actionName: "user.logout", module: "Auth", operation: "logout", actorName: session?.actor?.name ?? null, status: "SUCCESS" } })
    return { success: true }
  })

export const returnToOriginalAccount = createServerFn({ method: "POST" })
  .handler(async () => {
    return { success: true }
  })

export const checkSession = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { getServerSession } = await import("@/lib/server/session")
      const session = await getServerSession()
      return { isAuthenticated: !!session.actor, actor: session.actor ?? null }
    } catch {
      return { isAuthenticated: false, actor: null }
    }
  })
