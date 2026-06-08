import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/readyz")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { healthcheckDb } = await import("@/lib/server/db/kysely")
          await healthcheckDb()
          return Response.json({ ok: true })
        } catch (error) {
          const message = error instanceof Error ? error.message : "Readiness check failed"
          return Response.json({ ok: false, message }, { status: 503 })
        }
      },
    },
  },
})
