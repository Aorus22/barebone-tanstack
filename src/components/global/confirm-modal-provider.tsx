"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { setConfirmModalHandler } from "@/lib/client/confirm-modal"

type ConfirmState = {
  message: string
  title: string
  description?: string
  confirmText: string
  cancelText: string
  destructive: boolean
  resolve: (confirmed: boolean) => void
}

export function ConfirmModalProvider({ children }: { children: React.ReactNode }) {
  const [confirmState, setConfirmState] = React.useState<ConfirmState | null>(null)

  React.useEffect(() => {
    setConfirmModalHandler((message, options) => {
      return new Promise<boolean>((resolve) => {
        setConfirmState({
          message,
          title: options?.title ?? "Konfirmasi",
          description: options?.description,
          confirmText: options?.confirmText ?? "Ya",
          cancelText: options?.cancelText ?? "Batal",
          destructive: options?.destructive ?? false,
          resolve,
        })
      })
    })

    return () => setConfirmModalHandler(undefined)
  }, [])

  function handleClose(confirmed: boolean) {
    confirmState?.resolve(confirmed)
    setConfirmState(null)
  }

  return (
    <>
      {children}
      <Dialog open={Boolean(confirmState)} onOpenChange={(open) => !open && handleClose(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{confirmState?.title}</DialogTitle>
            <DialogDescription>
              {confirmState?.description ?? confirmState?.message}
            </DialogDescription>
          </DialogHeader>
          {confirmState?.description && <p className="text-sm">{confirmState.message}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              {confirmState?.cancelText}
            </Button>
            <Button
              variant={confirmState?.destructive ? "destructive" : "default"}
              onClick={() => handleClose(true)}
            >
              {confirmState?.confirmText}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
