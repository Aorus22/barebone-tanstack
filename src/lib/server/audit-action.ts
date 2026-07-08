import { createServerFn } from "@tanstack/react-start"
import { writeSystemActionLog, type SystemLogStatus } from "./system-action-logger"

type AuditInput = {
  actionName: string
  module: string
  operation: string
  actorName: string | null
  status: SystemLogStatus
  errorMessage?: string | null
  payload?: unknown
}

export const logAudit = createServerFn({ method: "POST" })
  .validator((data: AuditInput) => data)
  .handler(async ({ data }) => {
    const { getServerSession } = await import("@/lib/server/session")
    const session = await getServerSession()

    writeSystemActionLog({
      requestId: `req-${crypto.randomUUID().slice(0, 8)}`,
      actionName: data.actionName,
      module: data.module,
      operation: data.operation,
      actorId: session?.actor?.id ?? null,
      actorName: data.actorName ?? session?.actor?.name ?? null,
      sessionId: session?.sessionId ?? null,
      status: data.status,
      durationMs: 0,
      errorCode: data.status === "ERROR" ? "ERR" : null,
      errorMessageSafe: data.errorMessage ?? null,
      payload: data.payload ?? {},
    })

    return { success: true }
  })
