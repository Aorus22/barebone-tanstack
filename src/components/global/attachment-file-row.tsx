"use client"

import { Download, Eye, File, FileImage } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImagePreviewWrapper } from "@/components/global/image-preview-wrapper"
import { PdfPreviewModal } from "@/components/global/pdf-preview-modal"
import { DocxPreviewModal } from "@/components/global/docx-preview-modal"

type Props = {
  fileUrl: string
  originalName: string
  fileSize: number
  mimeType: string
}

export function AttachmentFileRow({ fileUrl, originalName, fileSize, mimeType }: Props) {
  const isImage = mimeType.startsWith("image/")
  const isPdf = mimeType === "application/pdf"
  const isDocx = mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card/50 p-3 text-sm">
      {isImage ? (
        <FileImage className="h-5 w-5 shrink-0 text-muted-foreground" />
      ) : (
        <File className="h-5 w-5 shrink-0 text-muted-foreground" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{originalName}</p>
        <p className="text-xs text-muted-foreground">
          {(fileSize / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
      <div className="flex items-center gap-1">
        {isImage ? (
          <ImagePreviewWrapper src={fileUrl}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </ImagePreviewWrapper>
        ) : isPdf ? (
          <PdfPreviewModal fileUrl={fileUrl} fileName={originalName} />
        ) : isDocx ? (
          <DocxPreviewModal fileUrl={fileUrl} fileName={originalName} />
        ) : (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </a>
        )}
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  )
}
