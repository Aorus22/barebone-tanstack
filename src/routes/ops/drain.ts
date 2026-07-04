import { createFileRoute } from "@tanstack/react-router"

async function requireOpsToken(request: Request) {
  const { getServerEnv } = await import("@/lib/server/env")
  const expected = getServerEnv().DEPLOY_OPS_TOKEN
  const authorization = request.headers.get("authorization")
  const bearer = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : undefined
  const provided = request.headers.get("x-ops-token") || bearer
  return Boolean(expected && provided === expected)
}

export const Route = createFileRoute("/ops/drain")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!(await requireOpsToken(request))) {
          return Response.json({ message: "Forbidden" }, { status: 403 })
        }

        const body = (await request.json().catch(() => ({}))) as { draining?: unknown }
        const draining = body.draining !== false
        const deployment = await import("@/backend/deployment/deployment-state")
        deployment.setDraining(draining)
        return Response.json({ ok: true, deployment: deployment.getDeploymentState() })
      },
    },
  },
})
