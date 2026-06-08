import { mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { randomUUID } from "node:crypto"

const STORAGE_ROOT = path.join(process.cwd(), "storage")

type SaveStorageFileInput = {
  file: Blob | ArrayBuffer | Uint8Array
  directory: string
  fileName?: string
}

type SavedStorageFile = {
  path: string
}

function sanitizePathSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-")
}

function assertSafeStoragePath(storagePath: string) {
  const normalizedPath = path.normalize(storagePath)

  if (path.isAbsolute(normalizedPath) || normalizedPath.startsWith("..")) {
    throw new Error("Invalid storage path")
  }

  return normalizedPath
}

async function toBuffer(file: Blob | ArrayBuffer | Uint8Array) {
  if (file instanceof Uint8Array) return Buffer.from(file)
  if (file instanceof ArrayBuffer) return Buffer.from(file)

  return Buffer.from(await file.arrayBuffer())
}

export async function saveStorageFile({
  file,
  directory,
  fileName,
}: SaveStorageFileInput): Promise<SavedStorageFile> {
  const safeDirectory = directory
    .split(/[/]+/)
    .filter(Boolean)
    .map(sanitizePathSegment)
    .join("/")
  const safeFileName = sanitizePathSegment(fileName ?? randomUUID())
  const storagePath = assertSafeStoragePath(path.join(safeDirectory, safeFileName))
  const fullPath = path.join(STORAGE_ROOT, storagePath)

  await mkdir(path.dirname(fullPath), { recursive: true })
  await writeFile(fullPath, await toBuffer(file))

  return { path: storagePath.replaceAll("\\", "/") }
}

export async function deleteStorageFile(storagePath: string) {
  const safePath = assertSafeStoragePath(storagePath)

  await rm(path.join(STORAGE_ROOT, safePath), { force: true })
}
