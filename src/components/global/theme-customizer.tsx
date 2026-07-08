"use client"

import { Paintbrush, RotateCcw } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { useThemeCustomizer, type ThemePresetId } from "@/hooks/use-theme-customizer"

const PRESET_SWATCHES: Record<ThemePresetId, string> = {
  default: "oklch(0.488 0.243 264.376)",
  emerald: "oklch(0.58 0.18 158)",
  violet: "oklch(0.52 0.22 285)",
  rose: "oklch(0.58 0.2 20)",
  amber: "oklch(0.68 0.18 85)",
  slate: "oklch(0.35 0.02 260)",
}

export function ThemeCustomizer() {
  const {
    overrides,
    presets,
    setPreset,
    setPrimary,
    setRadius,
    reset,
  } = useThemeCustomizer()

  const isCustom = !!overrides.primary
  const activePreset = isCustom ? null : overrides.preset

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-10 h-10 rounded-lg bg-background border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer relative"
          aria-label="Customize Theme"
        >
          <Paintbrush size={16} />
          {(activePreset !== "default" && activePreset !== null) && (
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-primary border-2 border-background" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-72 p-4 rounded-2xl shadow-xl border-border/50"
      >
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Theme Colors
            </span>
            {(activePreset !== "default" || isCustom) && (
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <RotateCcw className="size-3" />
                Reset
              </button>
            )}
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Presets
            </span>
            <div className="grid grid-cols-6 gap-2">
              {(Object.entries(PRESET_SWATCHES) as [ThemePresetId, string][]).map(([id, swatch]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPreset(id)}
                  title={presets[id].label}
                  className={`relative size-8 rounded-xl border-2 transition-all cursor-pointer ${
                    activePreset === id
                      ? "border-foreground scale-110 shadow-md"
                      : "border-border/60 hover:border-foreground/40"
                  }`}
                  style={{ backgroundColor: swatch }}
                >
                  {activePreset === id && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="size-2 rounded-full bg-white/80" />
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-2 text-[9px] text-center text-muted-foreground font-medium">
              {(["default", "emerald", "violet", "rose", "amber", "slate"] as ThemePresetId[]).map((id) => (
                <span key={id}>{presets[id].label}</span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border/40" />

          {/* Custom Primary */}
          <div className="space-y-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Custom Accent
            </span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={overrides.primaryHex ?? "#3b82f6"}
                onChange={(e) => {
                  const hex = e.target.value
                  const oklch = hexToOklch(hex)
                  setPrimary(oklch, hex)
                  if (overrides.preset !== "default") {
                    setPreset("default")
                  }
                }}
                className="size-9 rounded-xl border border-border/60 cursor-pointer bg-background p-0.5"
              />
              <div className="flex-1 space-y-0.5">
                <span className="text-xs font-medium text-foreground block">
                  Accent Color
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Affects primary, rings, badges
                </span>
              </div>
            </div>
          </div>

          {/* Radius */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Border Radius
              </span>
              <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                {overrides.radius ?? "0.625rem"}
              </span>
            </div>
            <Slider
              value={[parseFloat(overrides.radius ?? "0.625")]}
              onValueChange={([val]) => setRadius(`${val}rem`)}
              min={0}
              max={1.5}
              step={0.05}
              className="w-full"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── color conversion helpers ────────────────────────────────────

function hexToOklch(hex: string): string {
  // Strip #
  hex = hex.replace(/^#/, "")

  // Parse RGB
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

  // sRGB → Linear sRGB
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)

  const rLin = linearize(r)
  const gLin = linearize(g)
  const bLin = linearize(b)

  // Linear sRGB → LMS
  const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin
  const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin
  const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin

  // LMS → Oklab
  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  // Oklab → Oklch
  const C = Math.sqrt(a * a + b_ * b_)
  const h = (Math.atan2(b_, a) * 180) / Math.PI
  const hNormalized = ((h % 360) + 360) % 360

  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${hNormalized.toFixed(3)})`
}


