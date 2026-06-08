import { z } from "zod"

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  SESSION_COOKIE_NAME: z.string().min(1).default("ff_session"),
  SESSION_COOKIE_SECURE: z
    .enum(["true", "false"])
    .default("false")
    .transform((value) => value === "true"),
  SESSION_COOKIE_SAME_SITE: z.enum(["lax", "strict", "none"]).default("lax"),
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
