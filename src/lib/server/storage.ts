import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  NoSuchKey,
} from "@aws-sdk/client-s3"
import { s3, getBucket } from "./minio"

type SaveStorageFileInput = {
  file: Blob | ArrayBuffer | Uint8Array
  directory: string
  fileName?: string
}

type SavedStorageFile = {
  path: string
}

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    avif: "image/avif",
  }
  return map[ext ?? ""] ?? "application/octet-stream"
}

function sanitizePathSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-")
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
  const safeFileName = sanitizePathSegment(fileName ?? "file")
  const key = `${safeDirectory}/${safeFileName}`
  const buffer = await toBuffer(file)

  const bucket = getBucket()
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: getContentType(safeFileName),
    })
  )

  return { path: key }
}

export async function deleteStorageFile(storagePath: string) {
  const bucket = getBucket()
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: storagePath,
    })
  )
}

export async function readStorageFile(storagePath: string): Promise<Buffer> {
  const bucket = getBucket()
  try {
    const { Body } = await s3.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: storagePath,
      })
    )

    if (!Body) throw new Error("File not found")

    const bytes = await Body.transformToByteArray()
    return Buffer.from(bytes)
  } catch (err) {
    if (err instanceof NoSuchKey) {
      throw new Error("File not found", { cause: err })
    }
    throw err
  }
}
