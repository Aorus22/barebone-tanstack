export type ClientSseJobStatus = "queued" | "running" | "completed" | "failed"

export type ClientSseJob = {
  id: string
  actorId: string
  type: string
  status: ClientSseJobStatus
  stage: string
  progress: number
  message?: string
  meta?: Record<string, unknown>
  startedAt: string
  updatedAt: string
  endedAt?: string
}

export type ClientSseEvent =
  | { type: "snapshot"; jobs: ClientSseJob[] }
  | { type: "job"; job: ClientSseJob }
  | { type: "heartbeat"; timestamp: string }

export function connectSse(
  onEvent: (event: ClientSseEvent) => void,
  onState?: (state: "connecting" | "open" | "error") => void
) {
  let source: EventSource | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectDelayMs = 1000
  let closed = false

  const clearReconnectTimer = () => {
    if (!reconnectTimer) return
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  const connect = () => {
    if (closed) return
    onState?.("connecting")

    fetch("/sse-connect", { credentials: "same-origin" })
      .then((r) => r.json())
      .then(({ token }) => {
        if (closed) return

        source = new EventSource(`/sse?token=${encodeURIComponent(token)}`)
        source.onopen = () => {
          reconnectDelayMs = 1000
          onState?.("open")
        }
        source.onerror = () => {
          onState?.("error")
          source?.close()
          source = null
          if (closed || reconnectTimer) return
          reconnectTimer = setTimeout(() => {
            reconnectTimer = null
            connect()
          }, reconnectDelayMs)
          reconnectDelayMs = Math.min(reconnectDelayMs * 2, 15000)
        }
        source.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as ClientSseEvent
            onEvent(payload)
          } catch {
            // ignore malformed payload
          }
        }
      })
      .catch(() => {
        onState?.("error")
        if (closed || reconnectTimer) return
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null
          connect()
        }, reconnectDelayMs)
        reconnectDelayMs = Math.min(reconnectDelayMs * 2, 15000)
      })
  }

  connect()

  return () => {
    closed = true
    clearReconnectTimer()
    source?.close()
    source = null
  }
}
