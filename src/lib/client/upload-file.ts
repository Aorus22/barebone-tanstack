export async function uploadImageFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const { uploadFile } = await import("@/routes/(app)/settings/server-action")
  const result = await uploadFile({ data: formData })
  if (!result?.url) {
    throw new Error("Upload file gagal.")
  }

  return result.url
}
