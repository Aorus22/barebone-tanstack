type SystemLogActorOverride = {
  actorId?: string | null
  actorName?: string | null
}

export async function withSystemLog<TData>(
  actionName: string,
  payload: unknown,
  run: () => Promise<TData>,
  options?: { actorOverride?: SystemLogActorOverride },
) {
  const startedAt = Date.now()
  const [{ getServerActionContext }, { getServerSession }, { writeSystemActionLog }] = await Promise.all([
    import("@/lib/server/context"),
    import("@/lib/server/session"),
    import("@/lib/server/system-action-logger"),
  ])

  const [{ requestId, actor }, session] = await Promise.all([getServerActionContext(), getServerSession()])
  const [module = "unknown", operation = "unknown"] = actionName.split(".")
  const actorId = actor?.id ?? options?.actorOverride?.actorId ?? null
  const actorName = actor?.name ?? options?.actorOverride?.actorName ?? null

  try {
    const result = await run()
    writeSystemActionLog({
      requestId,
      actionName,
      module,
      operation,
      actorId,
      actorName,
      sessionId: session.sessionId ?? null,
      status: "SUCCESS",
      durationMs: Date.now() - startedAt,
      errorCode: null,
      errorMessageSafe: null,
      payload,
    })
    return result
  } catch (error) {
    const normalized =
      error && typeof error === "object" && "code" in error && "message" in error
        ? {
            errorCode: typeof (error as { code?: unknown }).code === "string" ? (error as { code: string }).code : "APP_ERROR",
            errorMessageSafe:
              typeof (error as { message?: unknown }).message === "string"
                ? (error as { message: string }).message
                : "Terjadi kesalahan. Silakan coba lagi.",
          }
        : {
            errorCode: "UNKNOWN_ERROR",
            errorMessageSafe: "Terjadi kesalahan. Silakan coba lagi.",
          }

    writeSystemActionLog({
      requestId,
      actionName,
      module,
      operation,
      actorId,
      actorName,
      sessionId: session.sessionId ?? null,
      status: "ERROR",
      durationMs: Date.now() - startedAt,
      errorCode: normalized.errorCode,
      errorMessageSafe: normalized.errorMessageSafe,
      payload,
    })
    throw error
  }
}
