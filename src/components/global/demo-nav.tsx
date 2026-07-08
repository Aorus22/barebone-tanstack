import { useState } from "react"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { cn } from "@/lib/utils"
import { LayoutGrid, Database, ChevronDown } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const groups = [
  { id: "components", label: "Components", icon: LayoutGrid, to: "/" },
  { id: "admin", label: "Admin", icon: Database, to: "/admin/user-management" },
] as const

export function DemoNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  const activeGroup = pathname.startsWith("/admin") ? groups[1] : groups[0]
  const ActiveIcon = activeGroup.icon

  const handleNavigate = (to: string) => {
    setOpen(false)
    navigate({ to: to as any })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "h-9 w-9 md:w-auto md:px-3 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer",
            "border border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-border/80",
            "text-foreground"
          )}
        >
          <ActiveIcon size={14} className="text-primary shrink-0" />
          <span className="hidden md:inline">{activeGroup.label}</span>
          <ChevronDown size={12} className="text-muted-foreground ml-0.5 hidden md:inline" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} className="p-3 rounded-2xl shadow-xl border-border/50 w-auto">
        <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground px-1 mb-2">
          Navigasi
        </p>
        <div className="grid grid-cols-2 gap-2">
          {groups.map((group) => {
            const GroupIcon = group.icon
            const isActive = activeGroup.id === group.id
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleNavigate(group.to)}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl p-3 min-w-24 h-20 transition-all cursor-pointer",
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
                <span className="text-[11px] font-semibold leading-none text-center">{group.label}</span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
