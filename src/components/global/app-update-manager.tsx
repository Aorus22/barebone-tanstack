import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type UpdateState = {
  available: boolean
  reloading: boolean
}

function isServiceWorkerSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator
}

export function AppUpdateManager() {
  const [updateState, setUpdateState] = useState<UpdateState>({
    available: false,
    reloading: false,
  })
  const waitingWorkerRef = useRef<ServiceWorker | null>(null)
  const hasTriggeredReloadRef = useRef(false)

  useEffect(() => {
    if (!isServiceWorkerSupported()) return

    let isDisposed = false
    let updateInterval: NodeJS.Timeout | null = null

    const showUpdateBanner = (worker: ServiceWorker | null | undefined) => {
      if (!worker || !navigator.serviceWorker.controller || isDisposed) return
      waitingWorkerRef.current = worker
      setUpdateState({
        available: true,
        reloading: false,
      })
    }

    const handleControllerChange = () => {
      if (hasTriggeredReloadRef.current) return
      hasTriggeredReloadRef.current = true
      window.location.reload()
    }

    const watchInstallingWorker = (registration: ServiceWorkerRegistration) => {
      const installingWorker = registration.installing
      if (!installingWorker) return

      installingWorker.addEventListener("statechange", () => {
        if (installingWorker.state === "installed") {
          showUpdateBanner(registration.waiting ?? installingWorker)
        }
      })
    }

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange)

    navigator.serviceWorker
      .register("/sw", { scope: "/" })
      .then((registration) => {
        if (isDisposed) return

        // If there is already a waiting worker, show the banner
        if (registration.waiting) {
          showUpdateBanner(registration.waiting)
        }

        // Listen for new updates
        registration.addEventListener("updatefound", () => {
          watchInstallingWorker(registration)
        })

        watchInstallingWorker(registration)

        // Check for updates initially
        registration.update().catch(() => {})

        // Setup periodic check every 5 minutes (300,000 ms)
        updateInterval = setInterval(() => {
          registration.update().catch(() => {})
        }, 5 * 60 * 1000)
      })
      .catch(() => {})

    const handleBeforeUnload = () => {
      if (waitingWorkerRef.current) {
        hasTriggeredReloadRef.current = true
        waitingWorkerRef.current.postMessage({ type: "SKIP_WAITING" })
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      isDisposed = true
      if (updateInterval) clearInterval(updateInterval)
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const handleReload = () => {
    const waitingWorker = waitingWorkerRef.current
    if (!waitingWorker) {
      window.location.reload()
      return
    }

    setUpdateState((prev) => ({
      ...prev,
      reloading: true,
    }))
    waitingWorker.postMessage({ type: "SKIP_WAITING" })
  }

  if (!updateState.available) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 right-6 z-[100000] max-w-sm overflow-hidden rounded-2xl border border-primary/20 bg-background/80 p-5 shadow-2xl shadow-primary/10 backdrop-blur-xl md:p-6"
      >
        {/* Sleek Golden Glow Accent */}
        <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>

          <div className="flex-1 space-y-1 pr-6">
            <h3 className="font-semibold text-foreground text-sm tracking-wide">
              Pembaruan Aplikasi!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Versi baru aplikasi sudah siap. Silakan muat ulang halaman untuk memperbarui ke versi terbaru.
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2 relative">
          <Button
            size="sm"
            onClick={handleReload}
            disabled={updateState.reloading}
            className="w-full sm:w-auto font-medium gap-2 shadow-lg shadow-primary/25 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <RefreshCcw className={`h-3.5 w-3.5 ${updateState.reloading ? "animate-spin" : ""}`} />
            {updateState.reloading ? "Memuat ulang..." : "Muat Ulang Sekarang"}
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
