import { z } from "zod"

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.url().startsWith("postgresql://"),
  HRIS_API_URL: z.url().optional(),
  HRIS_API_KEY: z.string().min(1).optional(),
  DEPLOY_OPS_TOKEN: z.string().min(16).optional(),
  SESSION_COOKIE_NAME: z.string().min(1).default("app_session"),
  SESSION_COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  SESSION_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
  MINIO_ENDPOINT: z.string().optional(),
  MINIO_ACCESS_KEY: z.string().optional(),
  MINIO_SECRET_KEY: z.string().optional(),
  MINIO_BUCKET: z.string().optional(),
  SSE_SHARED_SECRET: z.string().min(16),
  SSE_DAEMON_URL: z.string().url().optional().default("http://127.0.0.1:7001"),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

let cachedEnv: ServerEnv | undefined

export function getServerEnv() {
  cachedEnv ??= serverEnvSchema.parse(process.env)

  return cachedEnv
}

export function getRequiredServerEnv(name: string) {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}
