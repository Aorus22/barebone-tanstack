import * as React from "react"
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isValid,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { id } from "date-fns/locale"
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  name?: string
  id?: string
  min?: string
  max?: string
}

export function DatePicker({
  className,
  disabled,
  value,
  onChange,
  placeholder = "Pilih tanggal",
  name,
  id: inputId,
  min,
  max,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value ?? "")
  const internalRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value)
    }
  }, [value])

  const selectedDate = React.useMemo(() => {
    if (!internalValue) return undefined
    const parsed = parseISO(internalValue)
    return isValid(parsed) ? parsed : undefined
  }, [internalValue])

  const today = React.useMemo(() => new Date(), [])
  const [viewDate, setViewDate] = React.useState<Date>(selectedDate ?? today)

  React.useEffect(() => {
    if (selectedDate) {
      setViewDate(selectedDate)
    }
  }, [selectedDate])

  const monthOptions = React.useMemo(
    () =>
      Array.from({ length: 12 }, (_, monthIndex) => {
        const optionDate = new Date(viewDate.getFullYear(), monthIndex, 1)
        return {
          value: String(monthIndex),
          label: format(optionDate, "MMMM", { locale: id }),
        }
      }),
    [viewDate],
  )

  const YEAR_OPTIONS = React.useMemo(() => {
    return Array.from({ length: 201 }, (_, index) => 1900 + index)
  }, [])

  const WEEKDAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"]

  const weeks = React.useMemo(() => {
    const monthStart = startOfMonth(viewDate)
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calendarEnd = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 })
    const days: Date[] = []

    let current = calendarStart
    while (current <= calendarEnd || days.length < 42) {
      days.push(current)
      current = addDays(current, 1)
    }

    return Array.from({ length: 6 }, (_, weekIndex) =>
      days.slice(weekIndex * 7, weekIndex * 7 + 7),
    )
  }, [viewDate])

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const month = Number(event.target.value)
    setViewDate(new Date(viewDate.getFullYear(), month, 1))
  }

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const year = Number(event.target.value)
    setViewDate(new Date(year, viewDate.getMonth(), 1))
  }

  const handlePrevMonth = () => {
    setViewDate((prev) => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setViewDate((prev) => addMonths(prev, 1))
  }

  const handleDateSelect = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd")
    setInternalValue(formattedDate)
    onChange?.(formattedDate)
    setViewDate(date)
    setOpen(false)
  }

  return (
    <div className="relative w-full">
      <input
        type="date"
        className="sr-only"
        tabIndex={-1}
        ref={internalRef}
        name={name}
        id={inputId ? `${inputId}-hidden` : undefined}
        disabled={disabled}
        value={internalValue || ""}
        min={min}
        max={max}
        readOnly
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            id={inputId}
            disabled={disabled}
            className={cn(
              "flex h-9 w-full min-w-0 items-center justify-start rounded-4xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-normal cursor-pointer",
              !selectedDate && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">
              {selectedDate ? (
                format(selectedDate, "d MMMM yyyy", { locale: id })
              ) : (
                <span>{placeholder}</span>
              )}
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-auto rounded-xl border border-slate-200 bg-white p-3 shadow-md dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-[1.5] items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  onClick={handlePrevMonth}
                  disabled={disabled}
                >
                  <ChevronLeft className="h-4 w-4 text-slate-500" />
                </Button>
                <div className="relative min-w-0 flex-1">
                  <select
                    aria-label="Pilih bulan"
                    value={String(viewDate.getMonth())}
                    onChange={handleMonthChange}
                    className="h-8 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-2 pr-7 text-sm font-medium capitalize text-slate-900 outline-none transition focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950"
                    disabled={disabled}
                  >
                    {monthOptions.map((month) => (
                      <option key={month.value} value={month.value} className="dark:bg-zinc-950">
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  onClick={handleNextMonth}
                  disabled={disabled}
                >
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </Button>
              </div>

              <div className="relative min-w-0 flex-1">
                <select
                  aria-label="Pilih tahun"
                  value={String(viewDate.getFullYear())}
                  onChange={handleYearChange}
                  className="h-8 w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 px-2 pr-7 text-sm font-medium text-slate-900 outline-none transition focus:border-primary focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950"
                  disabled={disabled}
                >
                  {YEAR_OPTIONS.map((year) => (
                    <option key={year} value={year} className="dark:bg-zinc-950">
                      {year}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1">
              {WEEKDAY_LABELS.map((day) => (
                <div
                  key={day}
                  className="flex h-8 w-8 items-center justify-center text-center text-xs font-semibold text-slate-500"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-y-1">
                  {week.map((date) => {
                    const isSelected = selectedDate
                      ? isSameDay(date, selectedDate)
                      : false
                    const isCurrentMonth = isSameMonth(date, viewDate)
                    const isToday = isSameDay(date, today)

                    const dateStr = format(date, "yyyy-MM-dd")
                    const isDisabledByMinMax = Boolean((min && dateStr < String(min)) || (max && dateStr > String(max)))
                    const isBtnDisabled = disabled || isDisabledByMinMax

                    return (
                      <div
                        key={date.toISOString()}
                        className="flex h-8 w-8 items-center justify-center"
                      >
                        <button
                          type="button"
                          onClick={() => handleDateSelect(date)}
                          disabled={isBtnDisabled}
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium outline-none transition cursor-pointer",
                            isCurrentMonth
                              ? "text-slate-900 hover:bg-slate-100 dark:text-zinc-100 dark:hover:bg-zinc-800"
                              : "text-slate-300 hover:bg-slate-50 hover:text-slate-400 dark:text-zinc-700 dark:hover:bg-zinc-900",
                            isToday && !isSelected && "bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-zinc-100",
                            isSelected &&
                            "bg-primary text-primary-foreground shadow-xs hover:bg-primary hover:text-primary-foreground",
                            isBtnDisabled && "cursor-not-allowed opacity-50 pointer-events-none",
                          )}
                        >
                          {format(date, "d")}
                        </button>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
