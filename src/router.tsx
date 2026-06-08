import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: () => (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    ),
    defaultErrorComponent: () => (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Terjadi Kesalahan dari Server.</h1>
          <p className="text-muted-foreground max-w-md">
            Silakan coba lagi nanti atau laporkan temuan ini.
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Coba Lagi
        </Button>
      </div>
    ),
  })

  if (typeof window !== "undefined") {
    void import("nprogress").then((mod) => {
      const NProgress = mod.default
      NProgress.configure({ showSpinner: false })

      router.subscribe("onBeforeLoad", (event) => {
        if (event.fromLocation && event.fromLocation.pathname !== event.toLocation.pathname) {
          NProgress.start()
        }
      })

      router.subscribe("onResolved", () => {
        NProgress.done()
      })
    })
  }

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
