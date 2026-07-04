import { mkdirSync } from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"

export type SystemLogStatus = "SUCCESS" | "ERROR"

export type SystemActionLogRow = {
  requestId: string
  actionName: string
  module: string
  operation: string
  actorId: string | null
  actorName: string | null
  sessionId: string | null
  status: SystemLogStatus
  durationMs: number
  errorCode: string | null
  errorMessageSafe: string | null
  payload: unknown
}

export type SystemLogListParams = {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  module?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortDir?: string
}

export type SystemLogListItem = {
  id: number
  createdAt: string
  requestId: string
  actionName: string
  module: string
  operation: string
  actorId: string | null
  actorName: string | null
  sessionId: string | null
  status: SystemLogStatus
  durationMs: number
  errorCode: string | null
  errorMessageSafe: string | null
  payloadPreview: string
}

export type SystemLogDetailItem = {
  id: number
  createdAt: string
  requestId: string
  actionName: string
  module: string
  operation: string
  actorId: string | null
  actorName: string | null
  sessionId: string | null
  status: SystemLogStatus
  durationMs: number
  errorCode: string | null
  errorMessageSafe: string | null
  payloadJson: string | null
}

let db: DatabaseSync | null = null

function getDb() {
  if (db) return db

  const logDir = path.join(process.cwd(), "logs")
  mkdirSync(logDir, { recursive: true })
  const filePath = path.join(logDir, "system-action.db")

  db = new DatabaseSync(filePath)
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_action_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
      request_id TEXT NOT NULL,
      action_name TEXT NOT NULL,
      module TEXT NOT NULL,
      operation TEXT NOT NULL,
      actor_id TEXT,
      actor_name TEXT,
      session_id TEXT,
      status TEXT NOT NULL CHECK(status IN ('SUCCESS', 'ERROR')),
      duration_ms INTEGER NOT NULL,
      error_code TEXT,
      error_message_safe TEXT,
      payload_json TEXT
    ) STRICT
  `)

  db.exec("CREATE INDEX IF NOT EXISTS idx_system_action_logs_created_at ON system_action_logs(created_at DESC)")
  db.exec("CREATE INDEX IF NOT EXISTS idx_system_action_logs_module ON system_action_logs(module)")
  db.exec("CREATE INDEX IF NOT EXISTS idx_system_action_logs_status ON system_action_logs(status)")
  return db
}

function serializeFormData(formData: FormData) {
  const out: Record<string, unknown> = {}

  for (const [key, value] of formData.entries()) {
    const safeValue =
      value instanceof File
        ? {
            name: value.name,
            type: value.type,
            size: value.size,
          }
        : value

    if (Object.prototype.hasOwnProperty.call(out, key)) {
      const existing = out[key]
      out[key] = Array.isArray(existing) ? [...existing, safeValue] : [existing, safeValue]
      continue
    }

    out[key] = safeValue
  }

  return out
}

function sanitizePayload(input: unknown): unknown {
  if (input instanceof FormData) return serializeFormData(input)
  if (input instanceof File) {
    return {
      name: input.name,
      type: input.type,
      size: input.size,
    }
  }
  if (Array.isArray(input)) return input.map((item) => sanitizePayload(item))
  if (input && typeof input === "object") {
    const record = input as Record<string, unknown>
    const out: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(record)) {
      if (/(password|token|secret|authorization)/i.test(key)) {
        out[key] = "[REDACTED]"
        continue
      }
      out[key] = sanitizePayload(value)
    }

    return out
  }
  return input
}

function toPreview(payloadJson: string | null) {
  if (!payloadJson) return "-"
  if (payloadJson.length <= 280) return payloadJson
  return `${payloadJson.slice(0, 280)}...`
}

export function writeSystemActionLog(row: SystemActionLogRow) {
  try {
    const payloadJson = JSON.stringify(sanitizePayload(row.payload))
    const statement = getDb().prepare(`
      INSERT INTO system_action_logs (
        request_id,
        action_name,
        module,
        operation,
        actor_id,
        actor_name,
        session_id,
        status,
        duration_ms,
        error_code,
        error_message_safe,
        payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    statement.run(
      row.requestId,
      row.actionName,
      row.module,
      row.operation,
      row.actorId,
      row.actorName,
      row.sessionId,
      row.status,
      row.durationMs,
      row.errorCode,
      row.errorMessageSafe,
      payloadJson
    )
  } catch (error) {
    console.error("system action logger write failed:", error)
  }
}

export function getSystemActionLogDbPath() {
  return path.join(process.cwd(), "logs", "system-action.db")
}

export function listSystemActionLogs(params: SystemLogListParams) {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(10, params.pageSize ?? 20))
  const offset = (page - 1) * pageSize

  const whereParts: string[] = []
  const whereArgs: unknown[] = []

  if (params.search?.trim()) {
    const q = `%${params.search.trim()}%`
    whereParts.push("(action_name LIKE ? OR actor_name LIKE ? OR error_message_safe LIKE ? OR payload_json LIKE ?)")
    whereArgs.push(q, q, q, q)
  }

  if (params.status === "SUCCESS" || params.status === "ERROR") {
    whereParts.push("status = ?")
    whereArgs.push(params.status)
  }

  if (params.module?.trim()) {
    whereParts.push("module = ?")
    whereArgs.push(params.module.trim())
  }

  if (params.dateFrom?.trim()) {
    whereParts.push("created_at >= ?")
    whereArgs.push(params.dateFrom.trim())
  }

  if (params.dateTo?.trim()) {
    whereParts.push("created_at <= ?")
    whereArgs.push(params.dateTo.trim())
  }

  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : ""

  const sortMap: Record<string, string> = {
    createdAt: "created_at",
    actionName: "action_name",
    module: "module",
    status: "status",
    durationMs: "duration_ms",
  }
  const sortBy = sortMap[params.sortBy ?? "createdAt"] ?? "created_at"
  const sortDir = params.sortDir === "asc" ? "ASC" : "DESC"

  const baseArgs = [...whereArgs] as Array<string | number | null>
  const totalRow = getDb()
    .prepare(`SELECT COUNT(*) as count FROM system_action_logs ${whereClause}`)
    .get(...baseArgs) as { count: number }
  const total = Number(totalRow?.count ?? 0)

  const rows = getDb()
    .prepare(
      `
      SELECT
        id,
        created_at,
        request_id,
        action_name,
        module,
        operation,
        actor_id,
        actor_name,
        session_id,
        status,
        duration_ms,
        error_code,
        error_message_safe,
        payload_json
      FROM system_action_logs
      ${whereClause}
      ORDER BY ${sortBy} ${sortDir}, id DESC
      LIMIT ?
      OFFSET ?
    `
    )
    .all(...baseArgs, pageSize, offset) as Array<{
    id: number
    created_at: string
    request_id: string
    action_name: string
    module: string
    operation: string
    actor_id: string | null
    actor_name: string | null
    session_id: string | null
    status: SystemLogStatus
    duration_ms: number
    error_code: string | null
    error_message_safe: string | null
    payload_json: string | null
  }>

  const mapped: SystemLogListItem[] = rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    requestId: row.request_id,
    actionName: row.action_name,
    module: row.module,
    operation: row.operation,
    actorId: row.actor_id,
    actorName: row.actor_name,
    sessionId: row.session_id,
    status: row.status,
    durationMs: row.duration_ms,
    errorCode: row.error_code,
    errorMessageSafe: row.error_message_safe,
    payloadPreview: toPreview(row.payload_json),
  }))

  const moduleRows = getDb()
    .prepare("SELECT DISTINCT module FROM system_action_logs ORDER BY module ASC")
    .all() as Array<{ module: string }>

  return {
    rows: mapped,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
    availableFilters: {
      statuses: ["SUCCESS", "ERROR"] as const,
      modules: moduleRows.map((item) => item.module),
    },
  }
}

export function getSystemActionLogDetail(logId: number): SystemLogDetailItem | null {
  const row = getDb()
    .prepare(
      `
      SELECT
        id,
        created_at,
        request_id,
        action_name,
        module,
        operation,
        actor_id,
        actor_name,
        session_id,
        status,
        duration_ms,
        error_code,
        error_message_safe,
        payload_json
      FROM system_action_logs
      WHERE id = ?
      LIMIT 1
    `
    )
    .get(logId) as
    | {
        id: number
        created_at: string
        request_id: string
        action_name: string
        module: string
        operation: string
        actor_id: string | null
        actor_name: string | null
        session_id: string | null
        status: SystemLogStatus
        duration_ms: number
        error_code: string | null
        error_message_safe: string | null
        payload_json: string | null
      }
    | undefined

  if (!row) return null

  return {
    id: row.id,
    createdAt: row.created_at,
    requestId: row.request_id,
    actionName: row.action_name,
    module: row.module,
    operation: row.operation,
    actorId: row.actor_id,
    actorName: row.actor_name,
    sessionId: row.session_id,
    status: row.status,
    durationMs: row.duration_ms,
    errorCode: row.error_code,
    errorMessageSafe: row.error_message_safe,
    payloadJson: row.payload_json,
  }
}
