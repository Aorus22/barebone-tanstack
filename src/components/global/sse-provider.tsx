import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { connectSse, type ClientSseEvent, type ClientSseJob } from "@/lib/client/sse"

type ConnectionState = "connecting" | "open" | "error"
const ACTIVE_JOB_STALE_MS = 90_000

type SseContextValue = {
  jobs: ClientSseJob[]
  activeJobs: ClientSseJob[]
  activeCount: number
  connectionState: ConnectionState
  lastEventAt?: string
  reconnect: () => void
}

const SseContext = createContext<SseContextValue | undefined>(undefined)

function reduceJobs(current: ClientSseJob[], event: ClientSseEvent): ClientSseJob[] {
  if (event.type === "snapshot") {
    return [...event.jobs].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }
  if (event.type === "job") {
    const map = new Map(current.map((job) => [job.id, job]))
    map.set(event.job.id, event.job)
    return Array.from(map.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }
  return current
}

export function SseProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<ClientSseJob[]>([])
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting")
  const [lastEventAt, setLastEventAt] = useState<string>()
  const [connectionAttempt, setConnectionAttempt] = useState(0)

  useEffect(() => {
    const disconnect = connectSse(
      (event) => {
        setLastEventAt(new Date().toISOString())
        setJobs((prev) => reduceJobs(prev, event))
      },
      setConnectionState
    )
    return disconnect
  }, [connectionAttempt])

  const value = useMemo<SseContextValue>(() => {
    const now = Date.now()
    const activeJobs = jobs.filter((job) => {
      if (job.status !== "queued" && job.status !== "running") return false
      const updatedAt = Date.parse(job.updatedAt)
      if (!Number.isFinite(updatedAt)) return true
      return now - updatedAt <= ACTIVE_JOB_STALE_MS
    })
    return {
      jobs,
      activeJobs,
      activeCount: activeJobs.length,
      connectionState,
      lastEventAt,
      reconnect: () => setConnectionAttempt((prev) => prev + 1),
    }
  }, [jobs, connectionState, lastEventAt])

  return <SseContext.Provider value={value}>{children}</SseContext.Provider>
}

export function useSseContext() {
  const value = useContext(SseContext)
  if (!value) {
    throw new Error("useSseContext must be used inside <SseProvider>")
  }
  return value
}
