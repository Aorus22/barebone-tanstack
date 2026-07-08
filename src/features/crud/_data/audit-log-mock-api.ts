import type { AuditLogEntry, AuditLogPage, AuditLogSort } from "./audit-log-types"

const modules = ["Users", "Roles", "Settings", "Reports", "Auth", "System"]
const actors = ["Alice Wijaya", "Bob Santoso", "Charlie Lim", "Dewi Putri", "System"]
const statuses: Array<AuditLogEntry["status"]> = ["SUCCESS", "ERROR", "WARNING"]
const actions = [
  "user.login", "user.logout", "user.create", "user.update", "user.delete",
  "role.create", "role.update", "role.assign",
  "settings.update", "report.generate", "report.export",
  "permission.grant", "permission.revoke",
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomIp(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

function randomTimestamp(index: number): string {
  const date = new Date("2024-12-01")
  date.setHours(date.getHours() - index * 2 + Math.floor(Math.random() * 4))
  return date.toISOString().replace("T", " ").slice(0, 19)
}

function generateRow(index: number): AuditLogEntry {
  const action = randomItem(actions)
  return {
    id: `log-${String(index + 1).padStart(4, "0")}`,
    action,
    module: randomItem(modules),
    actor: randomItem(actors),
    target: `${randomItem(["user", "role", "setting", "report"])}-${String(Math.floor(Math.random() * 100)).padStart(3, "0")}`,
    status: randomItem(statuses),
    ipAddress: randomIp(),
    timestamp: randomTimestamp(index),
    details: `${action} operation completed on target`,
  }
}

// Generate 500 rows of mock data
const allRows: AuditLogEntry[] = Array.from({ length: 500 }, (_, i) => generateRow(i))

/** Simulate a server-side paginated query with optional sorting. */
export function fetchAuditLogPage(opts: {
  page: number
  pageSize: number
  sort?: AuditLogSort
}): Promise<AuditLogPage> {
  const { page, pageSize, sort } = opts

  // Simulate network latency (300-800ms)
  const delay = 300 + Math.random() * 500

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional error (5% chance)
      if (Math.random() < 0.05) {
        reject(new Error("Failed to fetch audit log. Server timeout."))
        return
      }

      let sorted = [...allRows]

      // Apply sorting
      if (sort) {
        sorted.sort((a, b) => {
          const aVal = String(a[sort.field])
          const bVal = String(b[sort.field])
          const cmp = aVal.localeCompare(bVal)
          return sort.dir === "desc" ? -cmp : cmp
        })
      }

      const total = sorted.length
      const totalPages = Math.ceil(total / pageSize)
      const start = (page - 1) * pageSize
      const rows = sorted.slice(start, start + pageSize)

      resolve({
        rows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      })
    }, delay)
  })
}
