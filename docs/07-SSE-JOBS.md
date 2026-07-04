# SSE Job System — Bare Bone

Real-time async progress tracking system based on **Server-Sent Events (SSE)** using an **in-memory job store**.

> **Architecture Note**: The job store is implemented entirely in-memory. State is volatile and resets on server restart. This is by design — the SSE job system is purely an **interactive UX feedback** mechanism, not a persistent audit data store.

---

## Architecture

```
Server Action (e.g. long-running operation)
  │
  ├─→ sse.createJob({ actorId, type, message })
  │      ↓ broadcast to SSE subscriber (actorId)
  │
  ├─→ [Execute intensive/async logic...]
  │
  ├─→ sse.updateJobStage({ jobId, stage, progress, message })
  │      ↓ broadcast progress update
  │
  └─→ sse.completeJob(jobId, message, meta)  ← or failJob
         ↓ broadcast final status

Client (Browser)
  └─→ SseProvider (Opens EventSource to /sse)
        ↓ Receives stream events
        → useSseJobs() hook → React state sync
```

---

## Files

| File | Description |
|------|-------------|
| `src/backend/sse/sse.service.ts` | In-memory job store + subscribe/emit logic |
| `src/backend/sse/sse.types.ts` | Type definitions |
| `src/backend/sse/index.ts` | Re-export |
| `src/routes/sse.ts` | SSE HTTP endpoint (`/sse`) |
| `src/components/global/sse-provider.tsx` | Client-side EventSource connection |
| `src/hooks/use-sse-jobs.ts` | React hook subscribing to job list |

---

## Types

```ts
// Job type — category of operation with SSE progress
type SseJobType =
  | "module.operation"
  // Add domain-specific job types here

// Status lifecycle
type SseJobStatus = "queued" | "running" | "completed" | "failed"

// Stage detail per operation
type SseJobStage =
  | "queued"
  | "processing"
  | "validating"
  | "saving"
  | "finalizing"
  | "done"
  | "error"

// Job object
type SseJob = {
  id: string
  actorId: string
  type: SseJobType
  status: SseJobStatus
  stage: SseJobStage
  progress: number      // 0-100
  message?: string
  meta?: Record<string, unknown>
  startedAt: string     // ISO string
  updatedAt: string     // ISO string
  endedAt?: string
}

// Stream event from server to client
type SseStreamEvent =
  | { type: "snapshot"; jobs: SseJob[] }  // snapshot on connect
  | { type: "job"; job: SseJob }           // per-job update
  | { type: "heartbeat"; timestamp: string }
```

---

## Server-Side API

Import from `@/backend/sse`:

```ts
const sse = await import("@/backend/sse")

// 1. Create new job
const job = await sse.createJob({
  actorId: ctx.actor.id,
  type: "module.operation",
  message: "Operation started.",
  meta: { totalItems: 1000 }  // optional
})
const jobId = job.id

// 2. Update progress
sse.updateJobStage({
  jobId,
  stage: "processing",
  progress: 30,
  message: "Processing items...",
})

sse.updateJobStage({
  jobId,
  stage: "validating",
  progress: 65,
  message: "Validating data...",
})

// 3a. Complete
sse.completeJob(jobId, "Complete!", { result: "ok" })

// 3b. Fail
sse.failJob(jobId, "An error occurred during processing.")
```

---

## Progress Stages Example

For a generic import/processing operation:

| Stage | Progress | Description |
|-------|----------|-------------|
| `queued` | 0 | Job created |
| `processing` | 10–40 | Processing data |
| `validating` | 40–80 | Step-by-step validation |
| `saving` | 80–95 | Saving to database |
| `finalizing` | 95 | Finalization |
| `done` | 100 | Complete (via completeJob) |

---

## Client-Side Usage

### SseProvider

Already wrapped in layout `(app)/route.tsx`. No manual setup needed.

### Hook

```ts
import { useSseJobs } from "@/hooks/use-sse-jobs"

function MyComponent() {
  const { jobs, activeJobs } = useSseJobs()

  // jobs = all jobs for this user
  // activeJobs = jobs with status "queued" or "running"

  const importJob = jobs.find(j => j.type === "module.operation")
  if (importJob?.status === "running") {
    return <ProgressBar value={importJob.progress} label={importJob.message} />
  }
}
```

---

## Limitations & Notes

- **Max jobs per actor**: 200 (oldest overflow auto-pruned)
- **Not persistent**: server restart = jobs lost
- **Single process**: in-memory storage is not suitable for multi-instance deployment without a shared store
- **Heartbeat**: server sends heartbeat every N seconds for keep-alive

---

## Adding a New Job Type

1. Add new type to `SseJobType` union in `src/backend/sse/sse.types.ts`
2. Add new stage to `SseJobStage` if needed
3. Create job in server action with `createJob({ type: "module.operation.new" })`
4. On client, filter `useSseJobs()` based on `job.type`
