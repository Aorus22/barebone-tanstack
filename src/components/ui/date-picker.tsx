import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon, X } from "lucide-react"

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({ value, onChange, placeholder = "Pilih tanggal...", className, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const parts = value.split("-")
    if (parts.length !== 3) return undefined
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
    return Number.isNaN(date.getTime()) ? undefined : date
  }, [value])

  const handleSelect = (date: Date | undefined) => {
    if (!date) { onChange?.(""); setOpen(false); return }
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    onChange?.(`${year}-${month}-${day}`)
    setOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => { e.stopPropagation(); onChange?.("") }

  const formattedLabel = React.useMemo(() => {
    if (!selectedDate) return ""
    return selectedDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  }, [selectedDate])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" disabled={disabled}
          className={cn("flex h-9 w-full min-w-0 items-center justify-between rounded-4xl border border-input bg-input/30 px-3 py-1 text-left text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer",
            !value && "text-muted-foreground", className)}>
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{formattedLabel || placeholder}</span>
          </div>
          {value && (
            <span onClick={handleClear} role="button" tabIndex={0}
              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 ml-1 cursor-pointer">
              <X className="h-3 w-3" />
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 rounded-3xl" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} disabled={disabled} />
      </PopoverContent>
    </Popover>
  )
}
