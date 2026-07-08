import { createFileRoute } from "@tanstack/react-router"
import { AuditLogPlayground } from "@/features/crud/playgrounds/audit-log-playground"

export const Route = createFileRoute("/(app)/admin/audit-log")({
  component: AuditLog,
})

function AuditLog() {
  return <AuditLogPlayground />
}
