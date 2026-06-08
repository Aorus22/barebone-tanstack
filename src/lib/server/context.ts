import type { ActorWithAccess } from "@/lib/server/module-rules"

export type BackendActor = ActorWithAccess & {
  id: string
  name?: string
}

export type BackendContext = {
  actor?: BackendActor
  requestId: string
  now: Date
}

export async function getServerActionContext(): Promise<BackendContext> {
  const [{ getServerSession }, { randomUUID }] = await Promise.all([
    import("@/lib/server/session"),
    import("node:crypto"),
  ])

  const session = await getServerSession()

  return {
    actor: session.actor,
    requestId: randomUUID(),
    now: new Date(),
  }
}
