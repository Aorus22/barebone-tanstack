import { S3Client } from "@aws-sdk/client-s3"

const globalForMinio = globalThis as unknown as {
  s3: S3Client | undefined
}

function createClient() {
  const endpoint = process.env.MINIO_ENDPOINT
  const accessKey = process.env.MINIO_ACCESS_KEY
  const secretKey = process.env.MINIO_SECRET_KEY

  if (!endpoint || !accessKey || !secretKey) {
    throw new Error(
      "MINIO_ENDPOINT, MINIO_ACCESS_KEY, and MINIO_SECRET_KEY must be set"
    )
  }

  return new S3Client({
    endpoint,
    region: "auto",
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  })
}

export const s3 = globalForMinio.s3 ?? createClient()
if (process.env.NODE_ENV !== "production") globalForMinio.s3 = s3

export function getBucket(): string {
  const bucket = process.env.MINIO_BUCKET
  if (!bucket) throw new Error("MINIO_BUCKET environment variable is not set")
  return bucket
}
