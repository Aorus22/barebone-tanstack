export type FieldErrors = Record<string, Array<string>>

type AppErrorOptions = {
  cause?: unknown
  fieldErrors?: FieldErrors
  statusCode?: number
}

export class AppError extends Error {
  readonly code: string
  readonly fieldErrors?: FieldErrors
  readonly statusCode?: number

  constructor(code: string, message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = "AppError"
    this.code = code
    this.fieldErrors = options.fieldErrors
    this.statusCode = options.statusCode
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function humanizeUnknownError(error: unknown) {
  if (isAppError(error)) return error.message

  if (typeof process !== "undefined" && process.env?.NODE_ENV !== "production") {
    console.error("[humanizeUnknownError]", error)
  }

  return "Terjadi kesalahan. Silakan coba lagi."
}
