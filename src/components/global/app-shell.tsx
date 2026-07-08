import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { useTheme } from "next-themes"
import { Undo2 } from "lucide-react"
import { Sidebar } from "./sidebar"
import { Topbar } from "./topbar"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet"
import { AiSidebar } from "@/components/ui/custom/minimal-tiptap/components/section/ai"
import { aiStore } from "@/lib/client/ai-store"
import { Button } from "@/components/ui/button"
import { appToast } from "@/lib/client/toast"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import {
  getFirstVisibleModulePathByGroup,
  getVisibleModulesByGroup,
  moduleConfig,
  moduleGroups,
  type ModuleGroup,
} from "@/router/module-config"
import { returnToOriginalAccount as runReturnToOriginalAccount } from "@/routes/(auth)/server-action"

const loadUserData = createServerFn({ method: "GET" }).handler(async () => {
  const { getServerSession } = await import("@/lib/server/session")
  const session = await getServerSession()
  if (!session.actor) {
    return { modules: [], user: null }
  }

  const authService = await import("@/backend/auth/auth.service")
  const accessPayload = await authService.loadAccessPayload(session.actor.id)

  return {
    modules: accessPayload.visibleModules,
    user: {
      id: session.actor.id,
      name: session.actor.name || "User",
      impersonation: session.impersonation?.isImpersonating
        ? {
            isImpersonating: true,
            impersonatorName: session.impersonation.impersonatorName ?? null,
          }
        : null,
    },
  }
})

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [visibleModules, setVisibleModules] = useState<string[]>([])
  const [user, setUser] = useState<{
    id: string
    name: string
    impersonation: { isImpersonating: boolean; impersonatorName: string | null } | null
  } | null>(null)
  const [isReturningAccount, setIsReturningAccount] = useState(false)
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    loadUserData().then((data) => {
      setVisibleModules(data.modules)
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    aiStore.setIsOpen(false)
  }, [location.pathname])

  const toggleTheme = (event?: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "light" ? "dark" : "light"

    if (!event || typeof document === "undefined" || !document.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    document.documentElement.style.setProperty("--x", `${x}px`)
    document.documentElement.style.setProperty("--y", `${y}px`)
    document.documentElement.style.setProperty("--r", `${endRadius}px`)

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
      })
    })
  }

  const handleModuleChange = (path: string) => {
    const normalizedPath = `/${String(path ?? "")
      .replace(/^\/*/, "")
      .replace(/[?#].*$/, "")
      .replace(/\/{2,}/g, "/")}`

    if (location.pathname === normalizedPath) {
      return
    }

    navigate({ href: normalizedPath })
  }

  const activeModuleConfig = moduleConfig.find((moduleItem) =>
    location.pathname === moduleItem.path || location.pathname.startsWith(`${moduleItem.path}/`)
  )
  const activeModule = activeModuleConfig?.id
  const activeGroup: ModuleGroup = activeModuleConfig?.group ?? ""

  const [selectedGroup, setSelectedGroup] = useState<ModuleGroup>(activeGroup)

  useEffect(() => {
    setSelectedGroup(activeGroup)
  }, [activeGroup])

  const availableGroups = moduleGroups.filter((group) => getVisibleModulesByGroup(visibleModules, group).length > 0)

  const handleGroupChange = (group: ModuleGroup) => {
    flushSync(() => {
      setSelectedGroup(group)
    })
    const targetPath = getFirstVisibleModulePathByGroup(visibleModules, group)
    if (!targetPath) return
    handleModuleChange(targetPath)
  }

  useEffect(() => {
    if (visibleModules.length === 0) return
    if (location.pathname === "/maintenance" || location.pathname === "/maintenance/") return

    if (activeModuleConfig && visibleModules.includes(activeModuleConfig.visibilityRule)) {
      return
    }

    const fallback = getFirstVisibleModulePathByGroup(visibleModules, moduleGroups[0])
    if (fallback && fallback !== location.pathname) {
      navigate({ to: fallback })
    }
  }, [activeModuleConfig, location.pathname, navigate, visibleModules])

  const handleTopbarSearch = (rawValue: string) => {
    const q = rawValue.trim()
    navigate({
      search: { q } as any,
    })
  }

  const handleReturnOriginalAccount = async () => {
    try {
      setIsReturningAccount(true)
      await runReturnToOriginalAccount()
      window.location.href = "/"
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Gagal kembali ke akun asli"
      appToast.error(msg)
    } finally {
      setIsReturningAccount(false)
    }
  }

  return (
    <div className="h-screen bg-background flex text-foreground overflow-hidden">
      <div className="hidden md:block h-full relative z-20">
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          visibleModules={visibleModules}
          activeGroup={activeGroup}
          user={user}
        />
      </div>

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-[280px] max-w-[280px] sm:w-[280px] border-r-0 bg-background"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigasi Sidebar</SheetTitle>
          <SheetDescription className="sr-only">Menu navigasi perangkat mobile</SheetDescription>
          <Sidebar
            isOpen={true}
            activeModule={activeModule}
            onModuleChange={(id) => {
              handleModuleChange(id)
              setIsMobileOpen(false)
            }}
            visibleModules={visibleModules}
            activeGroup={selectedGroup}
            user={user}
          />
        </SheetContent>
      </Sheet>

      <main className="flex-1 h-full relative flex flex-col min-w-0">
        <Topbar
          onSidebarToggle={() => setIsMobileOpen(true)}
          activeModule={activeModule}
          activePath={location.pathname}
          theme={mounted ? (theme as "light" | "dark") : "dark"}
          onThemeToggle={toggleTheme}
          onSearchSubmit={handleTopbarSearch}
          onCommandNavigate={handleModuleChange}
          visibleModules={visibleModules}
          activeGroup={selectedGroup}
          availableGroups={availableGroups}
          onGroupChange={handleGroupChange}
        />

        <div className="flex-1 min-h-0 w-full flex overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {user?.impersonation?.isImpersonating ? (
              <div className="mx-10 mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
                <p className="text-sm text-amber-900">
                  Kamu sedang Login As.
                  {user.impersonation.impersonatorName ? ` Akun asli: ${user.impersonation.impersonatorName}.` : ""}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReturnOriginalAccount}
                  disabled={isReturningAccount}
                >
                  <Undo2 className="h-4 w-4 mr-2" />
                  Kembali ke akun asli
                </Button>
              </div>
            ) : null}
            <div className="flex-1 min-h-0 w-full overflow-y-auto">
              <div className="p-10 max-w-7xl mx-auto min-h-full flex flex-col">{children}</div>
            </div>
          </div>
          <AiSidebar />
        </div>
      </main>
    </div>
  )
}
