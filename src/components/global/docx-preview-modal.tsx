"use client"

import { useEffect, useRef, useState } from "react"
import { Eye, ZoomIn, ZoomOut, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  fileUrl: string
  fileName: string
}

export function DocxPreviewModal({ fileUrl, fileName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState(0.85)

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    let active = true

    async function loadAndRender() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(fileUrl)
        if (!response.ok) throw new Error("Gagal mengunduh file.")

        const arrayBuffer = await response.arrayBuffer()
        if (!active) return

        const { renderAsync } = await import("docx-preview")

        if (containerRef.current) {
          containerRef.current.innerHTML = ""
          await renderAsync(arrayBuffer, containerRef.current, undefined, {
            breakPages: true,
            experimental: true,
            useBase64URL: true,
            renderHeaders: true,
            renderFooters: true,
          })
        }
      } catch (err: unknown) {
        if (active) {
          setError(err instanceof Error ? err.message : "Gagal memproses file.")
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    loadAndRender()

    return () => { active = false }
  }, [isOpen, fileUrl])

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) setError(null); setIsOpen(open) }}>
      <DialogContent
        showCloseButton
        className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-none flex-col overflow-hidden p-0 sm:max-w-none border border-slate-200 shadow-2xl gap-0"
      >
        <DialogHeader className="flex-row items-center justify-between border-b px-6 py-3 shrink-0 bg-white">
          <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
            {fileName}
          </DialogTitle>
          <div className="flex items-center gap-2 mr-8 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.max(0.3, +(s - 0.1).toFixed(2)))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs w-12 text-center font-mono font-semibold text-slate-600">
              {Math.round(scale * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(2)))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setScale(0.85)}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div
          ref={scrollRef}
          className="flex-1 overflow-scroll bg-slate-200 p-6 md:p-8 select-none docx-preview-container relative min-h-[300px]"
        >
          <style>{`
            .docx-preview-container .docx-wrapper {
              background-color: transparent !important;
              padding: 0 !important;
              width: 100% !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
            }
            .docx-preview-container article.docx {
              background: white !important;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05) !important;
              margin-bottom: 24px !important;
              border-radius: 8px !important;
              border: 1px solid #e2e8f0 !important;
              max-width: 100% !important;
              box-sizing: border-box !important;
            }
            .docx-preview-container article.docx section.docx {
              padding: 2.54cm 2.54cm !important;
            }
          `}</style>

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-20 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-semibold text-slate-600">Mengunduh & merender dokumen...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-slate-50">
              <p className="text-sm font-semibold text-destructive">{error}</p>
              <Button variant="outline" size="sm" onClick={() => setIsOpen(false)} className="mt-4">
                Tutup Preview
              </Button>
            </div>
          )}

          <div
            ref={containerRef}
            style={{
              zoom: scale,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}
