import {
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  KeyRound,
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { moduleConfig, type ModuleGroup } from "@/router/module-config"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ResetPasswordDialog } from "./reset-password-dialog"

interface SidebarProps {
  isOpen: boolean
  onToggle?: () => void
  activeModule?: string
  onModuleChange: (moduleId: string) => void
  visibleModules?: string[]
  activeGroup?: ModuleGroup
  user?: { id: string; name: string } | null
}

const iconMap: Record<
  string,
  React.ComponentType<{
    size?: number
    strokeWidth?: number
    className?: string
  }>
> = {}

const groupLabels: Record<string, string> = {}

type ModuleItem = (typeof moduleConfig)[number] & { parentId?: string }

export function Sidebar({
  isOpen,
  onToggle,
  activeModule,
  onModuleChange,
  visibleModules,
  activeGroup,
  user,
}: SidebarProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set()
  )
  const [lastExpandedGroup, setLastExpandedGroup] = useState<string | null>(null)
  const [pendingModulePath, setPendingModulePath] = useState<string | null>(null)

  useEffect(() => {
    setPendingModulePath(null)
  }, [activeModule])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
        setLastExpandedGroup(groupId)
      }
      return next
    })
  }

  const handleNavItemClick = (path: string) => {
    setPendingModulePath(path)
    onModuleChange(path)
  }

  useEffect(() => {
    if (activeModule) {
      const el = document.getElementById(`nav-item-${activeModule}`)
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [activeModule])

  useEffect(() => {
    if (lastExpandedGroup) {
      const el = document.getElementById(`sidebar-group-${lastExpandedGroup}`)
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [lastExpandedGroup])

  const allModules = [...moduleConfig] as ModuleItem[]
  const filteredModules = visibleModules
    ? allModules.filter((module) =>
        visibleModules.includes(module.visibilityRule)
      )
    : allModules
  const filteredModulesByGroup = activeGroup
    ? filteredModules.filter((module) => module.group === activeGroup)
    : filteredModules

  const childModules = filteredModulesByGroup.filter((m) => m.parentId)

  const parentIds = [...new Set(childModules.map((m) => m.parentId!))]

  const childrenByParent = parentIds.reduce(
    (acc, pid) => {
      acc[pid] = childModules.filter((c) => c.parentId === pid)
      return acc
    },
    {} as Record<string, ModuleItem[]>
  )

  const renderNavItem = (
    module: ModuleItem,
    isChild = false
  ) => {
    const Icon = iconMap[module.id]
    const isActive = activeModule === module.id || pendingModulePath === module.path

    return (
      <button
        key={module.id}
        id={`nav-item-${module.id}`}
        onClick={() => handleNavItemClick(module.path)}
        className={cn(
          "group relative flex w-full items-center whitespace-nowrap overflow-hidden",
          isActive ? "transition-none" : "transition-all duration-200",
          isChild
            ? "gap-3 rounded-lg py-2.5"
            : "gap-4 rounded-xl py-3 px-4",
          isChild
            ? isOpen
              ? "pl-3 pr-4"
              : "pl-[18px] pr-0"
            : "",
          isActive
            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/20"
            : "text-muted-foreground hover:bg-muted/50 hover:text-primary"
        )}
      >
        {Icon ? (
          <span
            className={cn(
              "flex-shrink-0",
              isActive
                ? "text-primary-foreground transition-none"
                : "text-muted-foreground group-hover:text-primary transition-colors duration-200",
              isChild && !isActive ? "opacity-80" : ""
            )}
          >
            <Icon size={isChild ? 16 : 20} strokeWidth={isActive ? 2.5 : 2} />
          </span>
        ) : null}
        <span
          className={cn(
            "text-sm transition-opacity duration-300",
            isChild ? "text-xs font-semibold" : "font-semibold",
            isActive ? "text-primary-foreground transition-none" : "",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {module.label}
        </span>
      </button>
    )
  }

  return (
    <>
      <aside
        style={{ width: isOpen ? 280 : 88 }}
        className="relative z-20 flex h-full flex-shrink-0 flex-col border-r border-border/50 bg-background transition-[width] duration-200 ease-out"
      >
        {onToggle && (
          <button
            onClick={onToggle}
            className="absolute top-7 -right-3.5 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
          >
            {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        )}

        <div className="mb-2 flex h-24 w-full flex-shrink-0 items-center justify-center overflow-hidden px-6 py-4">
          {isOpen ? (
            <div className="flex w-full flex-col items-center">
              <div className="h-13 flex items-center text-xl font-bold tracking-tight text-foreground">
                Logo
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
                L
              </div>
            </div>
          )}
        </div>

        <nav className="custom-scrollbar flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-4 py-2">
          <div className="flex w-full flex-col space-y-1.5">
            <p
              className={cn(
                "overflow-hidden px-4 text-[10px] font-bold tracking-widest whitespace-nowrap text-muted-foreground/50 uppercase transition-[opacity] duration-200",
                isOpen ? "mb-3 h-auto opacity-100" : "mb-0 h-0 opacity-0"
              )}
            >
              Navigation
            </p>
            {(() => {
              const renderedParents = new Set<string>()
              return filteredModulesByGroup.map((module) => {
                if (module.parentId) {
                  const parentId = module.parentId
                  if (renderedParents.has(parentId)) return null
                  renderedParents.add(parentId)

                  const children = childrenByParent[parentId]
                  if (!children?.length) return null

                  const label = groupLabels[parentId]
                  const isExpanded = expandedGroups.has(parentId)
                  const isAnyChildActive = children.some(
                    (c) => activeModule === c.id
                  )
                  const GroupIcon = iconMap[parentId]

                  return (
                    <div key={parentId} id={`sidebar-group-${parentId}`} className="space-y-1">
                      <button
                        onClick={() => toggleGroup(parentId)}
                        className={cn(
                          "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl px-4 py-3 border whitespace-nowrap transition-all duration-200 text-muted-foreground hover:text-primary",
                          isAnyChildActive
                            ? "bg-muted/40 border-border/80"
                            : "border-transparent hover:bg-muted/50"
                        )}
                      >
                        {GroupIcon ? (
                          <span className="flex-shrink-0 transition-colors text-muted-foreground group-hover:text-primary">
                            <GroupIcon size={20} strokeWidth={2} />
                          </span>
                        ) : null}
                        <span
                          className={cn(
                            "flex-1 text-left text-sm font-semibold transition-opacity duration-300",
                            isOpen ? "opacity-100" : "opacity-0"
                          )}
                        >
                          {label}
                        </span>
                        {isOpen ? (
                          <span className="flex-shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors">
                            {isExpanded ? (
                              <ChevronDown size={16} strokeWidth={2} />
                            ) : (
                              <ChevronRight size={16} strokeWidth={2} />
                            )}
                          </span>
                        ) : null}
                      </button>

                      {isExpanded && isOpen ? (
                        <div className="relative ml-[25px] pl-[15px] border-l border-border/80 my-1 space-y-1">
                          {children.map((child) => renderNavItem(child, true))}
                        </div>
                      ) : null}
                      {isExpanded && !isOpen ? (
                        <div className="my-1 space-y-1">
                          {children.map((child) => renderNavItem(child, true))}
                        </div>
                      ) : null}
                    </div>
                  )
                }

                return renderNavItem(module)
              })
            })()}
          </div>
        </nav>

        {user && (
          <div className="mt-auto overflow-hidden p-4">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "group flex w-full items-center gap-3 overflow-hidden rounded-2xl border border-transparent p-1.5 whitespace-nowrap transition-colors",
                    "hover:border-border/50 hover:bg-muted"
                  )}
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 to-primary/5 transition-colors group-hover:border-primary/20">
                    <User size={18} className="text-primary" />
                  </div>
                  <div
                    className={cn(
                      "flex min-w-0 flex-1 items-center justify-between pr-1 transition-opacity duration-300",
                      isOpen ? "opacity-100" : "opacity-0"
                    )}
                  >
                    <div className="flex min-w-0 flex-col items-start">
                      <span className="max-w-[130px] truncate text-sm font-bold text-foreground">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                        My Account
                      </span>
                    </div>
                    <ChevronRight
                      size={14}
                      className="flex-shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground"
                    />
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-[248px] gap-0.5 rounded-xl p-1.5 shadow-xl"
              >
                <div className="mb-1 border-b border-border/50 px-2 py-1.5">
                  <p className="truncate text-sm font-bold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    Administrator
                  </p>
                </div>
                <button
                  onClick={() => setResetDialogOpen(true)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/90 transition-colors hover:bg-muted hover:text-foreground"
                >
                  <KeyRound size={16} />
                  <span>Reset Password</span>
                </button>
                <button
                  onClick={() => (window.location.href = "/logout")}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-destructive/90 transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </PopoverContent>
            </Popover>
          </div>
        )}
      </aside>

      <ResetPasswordDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
      />
    </>
  )
}
