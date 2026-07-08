"use client"

import { useEffect, useState } from "react"
import { FileImage, Paperclip } from "lucide-react"

import { AttachmentFileRow } from "@/components/global/attachment-file-row"
import { ImagePreviewWrapper } from "@/components/global/image-preview-wrapper"
import { DocxPreviewModal } from "@/components/global/docx-preview-modal"
import { PdfPreviewModal } from "@/components/global/pdf-preview-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShowcaseSection } from "../showcase-section"

const pdfBase64 =
  "JVBERi0xLjQKMSAwIG9iajw8IC9UeXBlIC9DYXRhbG9nIC9QYWdlcyAyIDAgUiA+PmVuZG9iagoyIDAgb2JqPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj5lbmRvYmoKMyAwIG9iajw8IC9UeXBlIC9QYWdlIC9QYXJlbnQgMiAwIFIgL01lZGlhQm94IFswIDAgNTk1IDg0Ml0gL0NvbnRlbnRzIDQgMCBSIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+ID4+ZW5kb2JqCjQgMCBvYmo8PCAvTGVuZ3RoIDExNyA+PnN0cmVhbQpCVAovRjEgMjQgVGYKNzIgNzYwIFRkCihCYXJlYm9uZSBQREYgcHJldmlldyBkZW1vKSBUagowIC0zNiBUZAovRjEgMTQgVGYKKFpvb20sIGRyYWcsIGFuZCBmdWxsLXNjcmVlbiBkaWFsb2cgYmVoYXZpb3JzIGNhbiBiZSB0ZXN0ZWQgaGVyZS4pIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iajw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0hlbHZldGljYSA+PmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDQwOSAwMDAwMCBuIAp0cmFpbGVyPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNDc5CiUlRU9G"

const docxBase64 =
  "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"

const imageSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="sky" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="50%" stop-color="#dbeafe" />
        <stop offset="100%" stop-color="#bfdbfe" />
      </linearGradient>
      <linearGradient id="card" x1="0%" x2="100%" y1="0%" y2="100%">
        <stop offset="0%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#1d4ed8" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#sky)" rx="32" />
    <circle cx="915" cy="195" r="84" fill="#fef3c7" />
    <path d="M0 625 L240 410 L430 555 L645 290 L860 510 L1010 380 L1200 610 V800 H0 Z" fill="#93c5fd" />
    <path d="M0 705 L210 560 L360 650 L600 430 L780 565 L930 470 L1200 715 V800 H0 Z" fill="#3b82f6" opacity="0.92" />
    <rect x="122" y="104" width="480" height="256" rx="28" fill="url(#card)" opacity="0.97" />
    <text x="162" y="180" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="28">Global Preview Demo</text>
    <text x="162" y="236" fill="#ffffff" font-family="Arial, sans-serif" font-size="54" font-weight="700">Image Preview Wrapper</text>
    <text x="162" y="292" fill="#bfdbfe" font-family="Arial, sans-serif" font-size="24">Click the thumbnail to test zoom, backdrop, and close interactions.</text>
  </svg>
`

function base64ToBlob(base64: string, mimeType: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
  return new Blob([bytes], { type: mimeType })
}

function useBlobUrlFromText(content: string, mimeType: string) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    const objectUrl = URL.createObjectURL(new Blob([content], { type: mimeType }))
    setUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [content, mimeType])

  return url
}

function useBlobUrlFromBase64(base64: string, mimeType: string) {
  const [url, setUrl] = useState("")

  useEffect(() => {
    const objectUrl = URL.createObjectURL(base64ToBlob(base64, mimeType))
    setUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [base64, mimeType])

  return url
}

export function FilePreviewPlayground() {
  const imageUrl = useBlobUrlFromText(imageSvg, "image/svg+xml")
  const pdfUrl = useBlobUrlFromBase64(pdfBase64, "application/pdf")
  const docxUrl = useBlobUrlFromBase64(docxBase64, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

  const imageCode = `import { ImagePreviewWrapper } from "@/components/global/image-preview-wrapper"
import { Button } from "@/components/ui/button"

<ImagePreviewWrapper src={imageUrl}>
  <Button variant="outline">Preview image</Button>
</ImagePreviewWrapper>`

  const pdfCode = `import { PdfPreviewModal } from "@/components/global/pdf-preview-modal"

<PdfPreviewModal
  fileUrl={pdfUrl}
  fileName="global-preview-demo.pdf"
/>`

  const docxCode = `import { DocxPreviewModal } from "@/components/global/docx-preview-modal"

<DocxPreviewModal
  fileUrl={docxUrl}
  fileName="global-preview-demo.docx"
/>`

  const attachmentCode = `import { AttachmentFileRow } from "@/components/global/attachment-file-row"

<AttachmentFileRow
  fileUrl={pdfUrl}
  originalName="Q3-planning-packet.pdf"
  fileSize={2_621_440}
  mimeType="application/pdf"
/>`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 border-b border-border/40 pb-4 text-xs text-muted-foreground">
        <span className="mr-1 font-semibold text-foreground">Jump to:</span>
        <a href="#image-preview" className="transition-colors hover:text-foreground hover:underline">Image</a>
        <a href="#pdf-preview" className="transition-colors hover:text-foreground hover:underline">• PDF</a>
        <a href="#docx-preview" className="transition-colors hover:text-foreground hover:underline">• DOCX</a>
        <a href="#attachment-row" className="transition-colors hover:text-foreground hover:underline">• Attachment Row</a>
      </div>

      <ShowcaseSection
        id="image-preview"
        eyebrow="Global / Preview"
        title="Image Preview Wrapper"
        description="Wraps any trigger element with a zoomable lightbox preview powered by react-photo-view."
        code={imageCode}
      >
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden border-dashed">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <Badge variant="secondary">SVG asset via object URL</Badge>
                  <p className="max-w-xl text-sm text-muted-foreground">
                    The preview opens from a regular button, so you can reuse the same wrapper around thumbnails, icons, or inline actions.
                  </p>
                </div>
                <ImagePreviewWrapper src={imageUrl}>
                  <Button variant="outline" className="gap-2">
                    <FileImage className="size-4" />
                    Preview image
                  </Button>
                </ImagePreviewWrapper>
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="pdf-preview"
        eyebrow="Global / Preview"
        title="PDF Preview Modal"
        description="Opens a full-screen dialog with zoom controls and draggable canvas scrolling for embedded PDF files."
        code={pdfCode}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Inline blob PDF</Badge>
          <PdfPreviewModal fileUrl={pdfUrl} fileName="global-preview-demo.pdf" />
          <span className="text-sm text-muted-foreground">
            Try zoom in, zoom out, then drag the document area to test panning behavior.
          </span>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="docx-preview"
        eyebrow="Global / Preview"
        title="DOCX Preview Modal"
        description="Fetches a Word document, renders it client-side with docx-preview, and supports zoom plus loading states."
        code={docxCode}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Generated DOCX blob</Badge>
          <DocxPreviewModal fileUrl={docxUrl} fileName="global-preview-demo.docx" />
          <span className="text-sm text-muted-foreground">
            This is useful for approval flows, attachments, or internal document review screens.
          </span>
        </div>
      </ShowcaseSection>

      <ShowcaseSection
        id="attachment-row"
        eyebrow="Global / Preview"
        title="Attachment File Row"
        description="Bundles icon, size metadata, preview action, and download action into one reusable attachment line item."
        code={attachmentCode}
      >
        <div className="grid gap-3">
          <AttachmentFileRow
            fileUrl={imageUrl}
            originalName="launch-poster.svg"
            fileSize={184_320}
            mimeType="image/svg+xml"
          />
          <AttachmentFileRow
            fileUrl={pdfUrl}
            originalName="Q3-planning-packet.pdf"
            fileSize={2_621_440}
            mimeType="application/pdf"
          />
          <AttachmentFileRow
            fileUrl={docxUrl}
            originalName="meeting-notes.docx"
            fileSize={512_000}
            mimeType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          <Card className="border-dashed">
            <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
              <Paperclip className="size-4 shrink-0" />
              <div>
                <span className="font-medium text-foreground">Why this matters:</span>{" "}
                one row component keeps preview behavior consistent across upload lists, detail pages, and audit screens.
              </div>
            </CardContent>
          </Card>
        </div>
      </ShowcaseSection>
    </div>
  )
}
