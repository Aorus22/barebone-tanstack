import { createFileRoute, Outlet, Link, useLocation, redirect } from "@tanstack/react-router"
import { ArrowLeft, Shield, ScrollText, LogOut, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { DemoNav } from "@/components/global/demo-nav"
import { ThemeCustomizer } from "@/components/global/theme-customizer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { checkSession } from "@/routes/(auth)/server-action"

const adminLinks = [
  { to: "/admin/user-management", label: "User Management", icon: Shield },
  { to: "/admin/audit-log", label: "Audit Log", icon: ScrollText },
]

export const Route = createFileRoute("/(app)/admin")({
  beforeLoad: async () => {
    const session = await checkSession()
    if (!session.isAuthenticated) {
      throw redirect({ to: "/login" as any })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const { pathname } = useLocation()

  return (
    <div className="h-full flex flex-col">
      <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Home</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeCustomizer />
          <DemoNav />
        </div>
      </header>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border/50 bg-background">
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50">
              Admin
            </p>
            {adminLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname.startsWith(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span className="truncate">{link.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Nav (bottom) */}
          <AdminUserNav />
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

function AdminUserNav() {
  // We'll just render a simple logout button for now
  return (
    <div className="border-t border-border/50 p-3">
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="size-4" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">Administrator</p>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-56 p-1.5">
          <a
            href="/logout"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-destructive/90 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut className="size-4" />
            Sign Out
          </a>
        </PopoverContent>
      </Popover>
    </div>
  )
}
