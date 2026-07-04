"use client"

import type { MouseEvent as ReactMouseEvent } from "react"
import { useRef, useState } from "react"
import { Eye, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
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

type DragState = {
  startX: number
  startY: number
  scrollLeft: number
  scrollTop: number
}

export function PdfPreviewModal({ fileUrl, fileName }: Props) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [scale, setScale] = useState(0.75)
  const [dragging, setDragging] = useState(false)
  const [docHeight, setDocHeight] = useState<number | null>(null)
  const dragStateRef = useRef<DragState | null>(null)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current
    if (!container) return
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      scrollLeft: container.scrollLeft,
      scrollTop: container.scrollTop,
    }
    setDragging(true)
  }

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const container = scrollRef.current
    const dragState = dragStateRef.current
    if (!container || !dragState) return
    container.scrollLeft = dragState.scrollLeft - (e.clientX - dragState.startX)
    container.scrollTop = dragState.scrollTop - (e.clientY - dragState.startY)
  }

  const stopDragging = () => {
    dragStateRef.current = null
    setDragging(false)
  }

  const handleIframeLoad = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
    try {
      const iframe = e.target as HTMLIFrameElement
      if (iframe.contentWindow) {
        const height = iframe.contentWindow.document.documentElement.scrollHeight
        if (height > 0) setDocHeight(height)
      }
    } catch {
      // cross-origin
    }
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog
        open={previewOpen}
        onOpenChange={(open) => {
          if (!open) {
            stopDragging()
            setDocHeight(null)
          }
          setPreviewOpen(open)
        }}
      >
        <DialogContent
          showCloseButton
          className="flex h-[calc(100vh-1.5rem)] w-[calc(100vw-1.5rem)] max-w-none flex-col overflow-hidden p-0 sm:max-w-none gap-0"
        >
          <DialogHeader className="flex-row items-center justify-between border-b px-6 py-3">
            <DialogTitle>{fileName}</DialogTitle>
            <div className="flex items-center gap-2 mr-8">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setScale((s) => Math.max(0.3, +(s - 0.1).toFixed(1)))}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm w-12 text-center font-mono">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setScale((s) => Math.min(1.5, +(s + 0.1).toFixed(1)))}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setScale(0.75)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div
            ref={scrollRef}
            className={`flex-1 overflow-scroll bg-slate-200 p-6 select-none ${
              dragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={stopDragging}
            onMouseLeave={stopDragging}
          >
            <div
              className="mx-auto overflow-hidden rounded-md bg-white shadow-xl transition-all duration-200"
              style={{
                width: `${210 * scale}mm`,
                minWidth: `${210 * scale}mm`,
                height: docHeight ? `${docHeight * scale}px` : `${297 * scale}mm`,
                minHeight: docHeight ? `${docHeight * scale}px` : `${297 * scale}mm`,
              }}
            >
              <iframe
                key={fileUrl}
                title={fileName}
                src={fileUrl}
                scrolling="no"
                onLoad={handleIframeLoad}
                className="block border-0 pointer-events-none"
                style={{
                  width: "210mm",
                  height: docHeight ? `${docHeight}px` : "297mm",
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
