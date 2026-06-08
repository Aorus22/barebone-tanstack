export interface ServerActionResult<TData = unknown> {
  ok: boolean
  data?: TData
  toast?: {
    message: string
  }
  error?: {
    message: string
  }
}

type RunServerActionWithLogInput<TData> = {
  actionName: string
  payload?: unknown
  run: (ctx: { requestId: string; actorId: string | null; actorName: string | null; sessionId: string | null }) => Promise<TData>
}

function parseActionName(actionName: string) {
  const [module = "unknown", operation = "unknown"] = actionName.split(".")
  return { module, operation }
}

function normalizeErrorForLog(error: unknown) {
  if (error && typeof error === "object" && "code" in error && "message" in error) {
    const err = error as { code?: unknown; message?: unknown }
    return {
      errorCode: typeof err.code === "string" ? err.code : "APP_ERROR",
      errorMessageSafe: typeof err.message === "string" ? err.message : "Terjadi kesalahan.",
    }
  }

  return {
    errorCode: "UNKNOWN_ERROR",
    errorMessageSafe: "Terjadi kesalahan. Silakan coba lagi.",
  }
}

export async function runServerActionWithLog<TData>(input: RunServerActionWithLogInput<TData>): Promise<TData> {
  const startedAt = Date.now()
  const [{ getServerActionContext }, { getServerSession }, { writeSystemActionLog }] = await Promise.all([
    import("@/lib/server/context"),
    import("@/lib/server/session"),
    import("@/lib/server/system-action-logger"),
  ])

  const [{ requestId, actor }, session] = await Promise.all([getServerActionContext(), getServerSession()])
  const { module, operation } = parseActionName(input.actionName)

  try {
    const result = await input.run({
      requestId,
      actorId: actor?.id ?? null,
      actorName: actor?.name ?? null,
      sessionId: session.sessionId ?? null,
    })

    writeSystemActionLog({
      requestId,
      actionName: input.actionName,
      module,
      operation,
      actorId: actor?.id ?? null,
      actorName: actor?.name ?? null,
      sessionId: session.sessionId ?? null,
      status: "SUCCESS",
      durationMs: Date.now() - startedAt,
      errorCode: null,
      errorMessageSafe: null,
      payload: input.payload,
    })
    return result
  } catch (error) {
    const normalized = normalizeErrorForLog(error)
    writeSystemActionLog({
      requestId,
      actionName: input.actionName,
      module,
      operation,
      actorId: actor?.id ?? null,
      actorName: actor?.name ?? null,
      sessionId: session.sessionId ?? null,
      status: "ERROR",
      durationMs: Date.now() - startedAt,
      errorCode: normalized.errorCode,
      errorMessageSafe: normalized.errorMessageSafe,
      payload: input.payload,
    })
    throw error
  }
}
