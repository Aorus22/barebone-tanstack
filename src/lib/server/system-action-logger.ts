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

function sanitizePayload(input: unknown): unknown {
  if (input instanceof FormData) {
    const out: Record<string, unknown> = {}
    for (const [key, value] of input.entries()) {
      const safeValue = value instanceof File ? { name: value.name, type: value.type, size: value.size } : value
      if (Object.prototype.hasOwnProperty.call(out, key)) {
        const existing = out[key]
        out[key] = Array.isArray(existing) ? [...existing, safeValue] : [existing, safeValue]
        continue
      }
      out[key] = safeValue
    }
    return out
  }
  if (input instanceof File) return { name: input.name, type: input.type, size: input.size }
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

export function writeSystemActionLog(row: SystemActionLogRow) {
  try {
    const payloadJson = JSON.stringify(sanitizePayload(row.payload))
    const statement = getDb().prepare(`
      INSERT INTO system_action_logs (
        request_id, action_name, module, operation,
        actor_id, actor_name, session_id, status,
        duration_ms, error_code, error_message_safe, payload_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    statement.run(
      row.requestId, row.actionName, row.module, row.operation,
      row.actorId, row.actorName, row.sessionId, row.status,
      row.durationMs, row.errorCode, row.errorMessageSafe, payloadJson
    )
  } catch (error) {
    console.error("system action logger write failed:", error)
  }
}

export function getSystemActionLogDbPath() {
  return path.join(process.cwd(), "logs", "system-action.db")
}
