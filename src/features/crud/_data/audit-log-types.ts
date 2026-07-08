export type AuditLogEntry = {
  id: string
  action: string
  module: string
  actor: string
  target: string
  status: "SUCCESS" | "ERROR" | "WARNING"
  ipAddress: string
  timestamp: string
  details: string
}

export type AuditLogPage = {
  rows: AuditLogEntry[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

export type AuditLogSort = {
  field: keyof AuditLogEntry
  dir: "asc" | "desc"
}
