import { mkdirSync } from "node:fs"
import path from "node:path"
import { DatabaseSync } from "node:sqlite"

// ─── Types ───────────────────────────────────────────────────────
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
  status: SystemLogStatus
  durationMs: number
  errorCode: string | null
  errorMessageSafe: string | null
}

// ─── Database ─────────────────────────────────────────────────────
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

// ─── Write ────────────────────────────────────────────────────────
function sanitizePayload(input: unknown): unknown {
  if (input && typeof input === "object" && !Array.isArray(input)) {
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
  if (Array.isArray(input)) return input.map((item) => sanitizePayload(item))
  return input
}

export function writeSystemActionLog(row: SystemActionLogRow) {
  try {
    const payloadJson = JSON.stringify(sanitizePayload(row.payload))
    const stmt = getDb().prepare(`
      INSERT INTO system_action_logs (request_id, action_name, module, operation, actor_id, actor_name, session_id, status, duration_ms, error_code, error_message_safe, payload_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    stmt.run(row.requestId, row.actionName, row.module, row.operation, row.actorId, row.actorName, row.sessionId, row.status, row.durationMs, row.errorCode, row.errorMessageSafe, payloadJson)
  } catch (error) {
    console.error("system action logger write failed:", error)
  }
}

// ─── List ─────────────────────────────────────────────────────────
export function listSystemActionLogs(params: SystemLogListParams) {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = Math.min(100, Math.max(10, params.pageSize ?? 20))
  const offset = (page - 1) * pageSize

  const sortMap: Record<string, string> = {
    createdAt: "created_at",
    actionName: "action_name",
    module: "module",
    status: "status",
    durationMs: "duration_ms",
  }
  const sortBy = sortMap[params.sortBy ?? "createdAt"] ?? "created_at"
  const sortDir = params.sortDir === "asc" ? "ASC" : "DESC"

  const totalRow = getDb()
    .prepare("SELECT COUNT(*) as count FROM system_action_logs")
    .get() as { count: number }
  const total = Number(totalRow?.count ?? 0)

  const rows = getDb()
    .prepare(`
      SELECT id, created_at, request_id, action_name, module, operation, actor_id, actor_name, session_id, status, duration_ms, error_code, error_message_safe
      FROM system_action_logs
      ORDER BY ${sortBy} ${sortDir}, id DESC
      LIMIT ? OFFSET ?
    `)
    .all(pageSize, offset) as Array<{
      id: number; created_at: string; request_id: string; action_name: string
      module: string; operation: string; actor_id: string | null; actor_name: string | null
      session_id: string | null; status: SystemLogStatus; duration_ms: number
      error_code: string | null; error_message_safe: string | null
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
  }))

  return {
    rows: mapped,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  }
}
