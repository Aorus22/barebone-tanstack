import { useMemo } from "react"
import { useSseContext } from "@/components/global/sse-provider"
import type { ClientSseJob } from "@/lib/client/sse"

export function useSseJobs() {
  const { jobs, activeJobs, activeCount, connectionState, reconnect } = useSseContext()
  return { jobs, activeJobs, activeCount, connectionState, reconnect }
}

export function useJob(jobId?: string) {
  const { jobs } = useSseContext()
  return useMemo(() => jobs.find((job) => job.id === jobId), [jobs, jobId])
}

export function useJobEvents(filter?: (job: ClientSseJob) => boolean) {
  const { jobs } = useSseContext()
  return useMemo(() => (filter ? jobs.filter(filter) : jobs), [jobs, filter])
}
