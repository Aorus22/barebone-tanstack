import { createServerFn } from "@tanstack/react-start"

export const getAuditLogPage = createServerFn({ method: "GET" })
  .validator((data: { page?: number; pageSize?: number; sortBy?: string; sortDir?: string }) => data)
  .handler(async ({ data }) => {
    const { listSystemActionLogs, writeSystemActionLog } = await import("@/lib/server/system-action-logger")

    // Seed some demo data if empty
    const result = listSystemActionLogs(data)
    if (result.rows.length === 0) {
      const actors = ["System", "Admin User", "Super Admin"]
      const actions = [
        { actionName: "user.login", module: "Auth", operation: "login" },
        { actionName: "user.logout", module: "Auth", operation: "logout" },
        { actionName: "user.create", module: "Users", operation: "create" },
        { actionName: "user.update", module: "Users", operation: "update" },
        { actionName: "role.create", module: "Roles", operation: "create" },
        { actionName: "role.assign", module: "Roles", operation: "assign" },
        { actionName: "settings.update", module: "Settings", operation: "update" },
        { actionName: "report.generate", module: "Reports", operation: "generate" },
      ]

      for (let i = 0; i < 150; i++) {
        const act = actions[Math.floor(Math.random() * actions.length)]
        const isError = Math.random() < 0.1
        writeSystemActionLog({
          requestId: `req-${crypto.randomUUID().slice(0, 8)}`,
          actionName: act.actionName,
          module: act.module,
          operation: act.operation,
          actorId: `usr-${String(Math.floor(Math.random() * 10)).padStart(3, "0")}`,
          actorName: actors[Math.floor(Math.random() * actors.length)],
          sessionId: `sess-${crypto.randomUUID().slice(0, 8)}`,
          status: isError ? "ERROR" : "SUCCESS",
          durationMs: Math.floor(Math.random() * 5000),
          errorCode: isError ? "ERR_500" : null,
          errorMessageSafe: isError ? "Internal server error occurred" : null,
          payload: { timestamp: new Date(Date.now() - i * 3600000).toISOString() },
        })
      }
    }

    return listSystemActionLogs(data)
  })
