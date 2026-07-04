import {
  Menu,
  Search,
  Sun,
  Moon,
  LoaderCircle,
  Activity,
  LayoutGrid,
  ChevronDown,
  Settings2,
} from "lucide-react"
import { useMemo, useState } from "react"
import { useSseJobs } from "@/hooks/use-sse-jobs"
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { moduleConfig, type ModuleGroup } from "@/router/module-config"

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {}

interface TopbarProps {
  onSidebarToggle: () => void
  activeModule?: string
  activePath?: string
  theme?: "light" | "dark"
  onThemeToggle: (event: React.MouseEvent<HTMLButtonElement>) => void
  onSearchSubmit?: (value: string) => void
  onCommandNavigate?: (path: string) => void
  visibleModules?: string[]
  activeGroup?: ModuleGroup
  availableGroups?: ModuleGroup[]
  onGroupChange?: (group: ModuleGroup) => void
}

export function Topbar({
  onSidebarToggle,
  activeModule,
  activePath,
  theme = "dark",
  onThemeToggle,
  onSearchSubmit,
  onCommandNavigate,
  visibleModules,
  activeGroup,
  availableGroups = [],
  onGroupChange,
}: TopbarProps) {
  const { activeJobs, activeCount, connectionState } = useSseJobs()
  const [commandOpen, setCommandOpen] = useState(false)

  const filteredModules = visibleModules
    ? moduleConfig.filter((module) => visibleModules.includes(module.visibilityRule))
    : moduleConfig
  const filteredModulesByGroup = activeGroup
    ? filteredModules.filter((module) => module.group === activeGroup)
    : filteredModules
  const [query, setQuery] = useState("")
  const trimmedQuery = query.trim()
  const searchLabel = useMemo(
    () => (trimmedQuery ? `Cari: "${trimmedQuery}"` : "Ketik kata kunci untuk mencari"),
    [trimmedQuery]
  )
  const breadcrumbItems = useMemo(() => {
    const resolvedPath = activePath ? String(activePath) : `/${activeModule ?? ""}`
    const segments = resolvedPath
      .split("?")[0]
      .split("/")
      .filter(Boolean)

    if (segments.length === 0) {
      return ["Home"]
    }

    return [
      "Home",
      ...segments.map((segment) =>
        segment
          .split("-")
          .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
          .join(" ")
      ),
    ]
  }, [activePath, activeModule])
  const breadcrumbPaths = useMemo(() => {
    const resolvedPath = activePath ? String(activePath) : `/${activeModule ?? ""}`
    const segments = resolvedPath
      .split("?")[0]
      .split("/")
      .filter(Boolean)

    if (segments.length === 0) {
      return ["/"]
    }

    return ["/", ...segments.map((_, index) => `/${segments.slice(0, index + 1).join("/")}`)]
  }, [activePath, activeModule])

  const groupMeta: Record<ModuleGroup, { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; description: string }> = {}

  const ActiveGroupIcon = activeGroup && groupMeta[activeGroup]?.icon ? groupMeta[activeGroup].icon : LayoutGrid

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/40 px-4 md:px-10 py-4 md:py-5 flex items-center justify-between">
      <div className="flex items-center gap-2 md:gap-8">
        <button
          onClick={onSidebarToggle}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all md:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="hidden md:flex items-center min-h-10">
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-2">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1
              const targetPath = breadcrumbPaths[index]

              return (
                <div
                  key={`${item}-${index}`}
                  className={cn(
                    "flex items-center gap-2 shrink-0",
                    !isLast && "hidden md:flex"
                  )}
                >
                  {isLast ? (
                    <span className="text-xs font-bold text-foreground whitespace-nowrap">{item}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCommandNavigate?.(targetPath)}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                    >
                      {index > 0 ? (
                        <>
                          <span className="hidden md:inline">{item}</span>
                          <span className="inline md:hidden">...</span>
                        </>
                      ) : (
                        item
                      )}
                    </button>
                  )}
                  {!isLast ? <span className="text-[10px] text-muted-foreground/60">/</span> : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden lg:block">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="w-64 pl-11 py-2.5 pr-4 bg-muted/40 border border-border/50 rounded-full text-sm font-medium text-left text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={16} />
            Search anything...
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3 pl-0 md:pl-6 border-l-0 md:border-l border-border/40">
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="lg:hidden w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            <Search size={18} />
          </button>

          {activeCount > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="h-10 w-10 md:w-auto md:px-4 rounded-full bg-primary/10 text-primary flex items-center justify-center gap-2 border border-primary/20 hover:bg-primary/20 transition-all cursor-pointer">
                  <LoaderCircle size={16} className="animate-spin shrink-0" />
                  <span className="text-xs font-bold hidden md:inline">{activeCount} Proses</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 md:w-96 p-0 rounded-2xl shadow-lg border-border/50 overflow-hidden">
                <div className="bg-muted/30 border-b border-border/50 px-4 py-3 flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">Running Jobs</p>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", connectionState === "open" ? "bg-green-400" : "bg-yellow-400")}></span>
                      <span className={cn("relative inline-flex rounded-full h-2 w-2", connectionState === "open" ? "bg-green-500" : "bg-yellow-500")}></span>
                    </span>
                    <p className="text-[10px] font-semibold uppercase text-muted-foreground">{connectionState}</p>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                  {activeJobs.map((job) => (
                    <div key={job.id} className="mb-2 last:mb-0 bg-background border border-border/50 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">{job.type}</span>
                        <span className="text-xs font-bold text-muted-foreground">{job.progress}%</span>
                      </div>
                      <p className="text-sm font-medium text-foreground/80">{job.message ?? job.stage}</p>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300" style={{ width: `${job.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="h-10 w-10 md:w-auto md:px-4 rounded-full bg-muted/30 border border-border/40 flex items-center justify-center gap-2 text-muted-foreground/50 cursor-default">
               <Activity size={16} className="shrink-0" />
               <span className="text-xs font-bold tracking-wide hidden md:inline">Idle</span>
            </div>
          )}
          
          <button
            onClick={onThemeToggle}
            className="w-10 h-10 rounded-full bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {availableGroups.length > 0 && Object.keys(groupMeta).length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "h-10 w-10 md:w-auto md:px-3 rounded-full text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer",
                    "border border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-border/80",
                    "text-foreground"
                  )}
                >
                  <ActiveGroupIcon size={14} className="text-primary shrink-0" />
                  <span className="hidden md:inline">{activeGroup && groupMeta[activeGroup] ? groupMeta[activeGroup].label : "Pilih Grup"}</span>
                  <ChevronDown size={12} className="text-muted-foreground ml-0.5 hidden md:inline" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="end"
                sideOffset={10}
                className="p-3 rounded-2xl shadow-xl border-border/50 w-auto"
              >
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-1 mb-2">Pilih Grup</p>
                <div
                  className={cn(
                    "grid gap-2",
                    availableGroups.length <= 3 ? "grid-cols-2" : "grid-cols-3"
                  )}
                >
                  {availableGroups.map((group) => {
                    const meta = groupMeta[group]
                    if (!meta) return null
                    const GroupIcon = meta.icon
                    const isActive = group === activeGroup
                    return (
                      <PopoverClose key={group} asChild>
                        <button
                          type="button"
                          onClick={() => onGroupChange?.(group)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 rounded-xl p-3 w-24 h-20 transition-all cursor-pointer",
                            isActive
                              ? "bg-primary text-white shadow-sm"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center",
                            isActive ? "bg-white/20" : "bg-background border border-border/50"
                          )}>
                            <GroupIcon size={18} />
                          </div>
                          <span className="text-[11px] font-semibold leading-none text-center">{meta.label}</span>
                        </button>
                      </PopoverClose>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      </div>

      <CommandDialog
        open={commandOpen}
        onOpenChange={setCommandOpen}
        title="Quick Search"
        description="Cari data atau pindah menu cepat"
      >
        <Command>
          <CommandInput placeholder="Cari..." value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>Tidak ada hasil.</CommandEmpty>
            <CommandGroup heading="Aksi">
              <CommandItem
                value={searchLabel}
                disabled={!trimmedQuery}
                onSelect={() => {
                  if (!trimmedQuery) return
                  onSearchSubmit?.(trimmedQuery)
                  setCommandOpen(false)
                  setQuery("")
                }}
              >
                <Search size={14} />
                {searchLabel}
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Menu">
              {filteredModulesByGroup.map((module) => {
                const IconComponent = iconMap[module.id]
                return (
                  <CommandItem
                    key={module.id}
                    value={module.label}
                    onSelect={() => {
                      onCommandNavigate?.(module.path)
                      setCommandOpen(false)
                    }}
                  >
                    {IconComponent && <IconComponent size={14} />}
                    {module.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </header>
  )
}
