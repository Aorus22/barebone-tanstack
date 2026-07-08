"use client"

import { useCallback, useEffect, useState } from "react"

const STORAGE_KEY = "theme-custom-colors"

// ─── types ───────────────────────────────────────────────────────
export type ThemePresetId = "default" | "emerald" | "violet" | "rose" | "amber" | "slate"

export interface ThemeOverrides {
  preset: ThemePresetId
  primary?: string
  primaryHex?: string
  radius?: string
}

// ─── storage ─────────────────────────────────────────────────────
function readStorage(): ThemeOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ThemeOverrides
  } catch { /* ignore */ }
  return { preset: "default" }
}

function writeStorage(v: ThemeOverrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
}

// ─── preset palettes ────────────────────────────────────────────
interface PresetPalette {
  label: string
  vars: Array<{ name: string; light: string; dark: string }>
}

const PRESETS: Record<ThemePresetId, PresetPalette> = {
  default: {
    label: "Default",
    vars: [],
  },
  emerald: {
    label: "Emerald",
    vars: [
      { name: "--primary",           light: "oklch(0.58 0.18 158)",   dark: "oklch(0.68 0.18 158)" },
      { name: "--primary-foreground", light: "oklch(0.98 0 0)",       dark: "oklch(0.15 0 0)" },
      { name: "--ring",              light: "oklch(0.58 0.18 158)",   dark: "oklch(0.68 0.18 158)" },
      { name: "--chart-1",           light: "oklch(0.62 0.15 158)",   dark: "oklch(0.7 0.15 158)" },
      { name: "--chart-2",           light: "oklch(0.55 0.1 175)",    dark: "oklch(0.65 0.1 175)" },
      { name: "--chart-3",           light: "oklch(0.48 0.08 190)",   dark: "oklch(0.58 0.08 190)" },
      { name: "--chart-4",           light: "oklch(0.65 0.12 140)",   dark: "oklch(0.72 0.12 140)" },
      { name: "--chart-5",           light: "oklch(0.55 0.18 145)",   dark: "oklch(0.65 0.18 145)" },
      { name: "--sidebar-primary",   light: "oklch(0.58 0.18 158)",   dark: "oklch(0.68 0.18 158)" },
    ],
  },
  violet: {
    label: "Violet",
    vars: [
      { name: "--primary",           light: "oklch(0.52 0.22 285)",   dark: "oklch(0.62 0.22 285)" },
      { name: "--primary-foreground", light: "oklch(0.98 0 0)",       dark: "oklch(0.15 0 0)" },
      { name: "--ring",              light: "oklch(0.52 0.22 285)",   dark: "oklch(0.62 0.22 285)" },
      { name: "--chart-1",           light: "oklch(0.6 0.18 285)",    dark: "oklch(0.68 0.18 285)" },
      { name: "--chart-2",           light: "oklch(0.55 0.14 270)",   dark: "oklch(0.63 0.14 270)" },
      { name: "--chart-3",           light: "oklch(0.5 0.12 295)",    dark: "oklch(0.58 0.12 295)" },
      { name: "--chart-4",           light: "oklch(0.65 0.15 260)",   dark: "oklch(0.72 0.15 260)" },
      { name: "--chart-5",           light: "oklch(0.58 0.2 280)",    dark: "oklch(0.65 0.2 280)" },
      { name: "--sidebar-primary",   light: "oklch(0.52 0.22 285)",   dark: "oklch(0.62 0.22 285)" },
    ],
  },
  rose: {
    label: "Rose",
    vars: [
      { name: "--primary",           light: "oklch(0.58 0.2 20)",     dark: "oklch(0.68 0.2 20)" },
      { name: "--primary-foreground", light: "oklch(0.98 0 0)",       dark: "oklch(0.15 0 0)" },
      { name: "--ring",              light: "oklch(0.58 0.2 20)",     dark: "oklch(0.68 0.2 20)" },
      { name: "--chart-1",           light: "oklch(0.6 0.16 20)",     dark: "oklch(0.7 0.16 20)" },
      { name: "--chart-2",           light: "oklch(0.55 0.12 350)",   dark: "oklch(0.65 0.12 350)" },
      { name: "--chart-3",           light: "oklch(0.48 0.1 15)",     dark: "oklch(0.58 0.1 15)" },
      { name: "--chart-4",           light: "oklch(0.63 0.14 30)",    dark: "oklch(0.72 0.14 30)" },
      { name: "--chart-5",           light: "oklch(0.55 0.18 10)",    dark: "oklch(0.65 0.18 10)" },
      { name: "--sidebar-primary",   light: "oklch(0.58 0.2 20)",     dark: "oklch(0.68 0.2 20)" },
    ],
  },
  amber: {
    label: "Amber",
    vars: [
      { name: "--primary",           light: "oklch(0.68 0.18 85)",    dark: "oklch(0.74 0.18 85)" },
      { name: "--primary-foreground", light: "oklch(0.15 0 0)",       dark: "oklch(0.15 0 0)" },
      { name: "--ring",              light: "oklch(0.68 0.18 85)",    dark: "oklch(0.74 0.18 85)" },
      { name: "--chart-1",           light: "oklch(0.7 0.15 85)",     dark: "oklch(0.76 0.15 85)" },
      { name: "--chart-2",           light: "oklch(0.62 0.12 70)",    dark: "oklch(0.7 0.12 70)" },
      { name: "--chart-3",           light: "oklch(0.55 0.1 55)",     dark: "oklch(0.62 0.1 55)" },
      { name: "--chart-4",           light: "oklch(0.72 0.14 95)",    dark: "oklch(0.78 0.14 95)" },
      { name: "--chart-5",           light: "oklch(0.65 0.16 80)",    dark: "oklch(0.72 0.16 80)" },
      { name: "--sidebar-primary",   light: "oklch(0.68 0.18 85)",    dark: "oklch(0.74 0.18 85)" },
    ],
  },
  slate: {
    label: "Slate",
    vars: [
      { name: "--primary",           light: "oklch(0.35 0.02 260)",   dark: "oklch(0.75 0.02 260)" },
      { name: "--primary-foreground", light: "oklch(0.98 0 0)",       dark: "oklch(0.15 0 0)" },
      { name: "--ring",              light: "oklch(0.35 0.02 260)",   dark: "oklch(0.75 0.02 260)" },
      { name: "--chart-1",           light: "oklch(0.5 0.03 260)",    dark: "oklch(0.78 0.03 260)" },
      { name: "--chart-2",           light: "oklch(0.45 0.02 275)",   dark: "oklch(0.72 0.02 275)" },
      { name: "--chart-3",           light: "oklch(0.4 0.02 250)",    dark: "oklch(0.65 0.02 250)" },
      { name: "--chart-4",           light: "oklch(0.55 0.04 270)",   dark: "oklch(0.8 0.04 270)" },
      { name: "--chart-5",           light: "oklch(0.48 0.04 255)",   dark: "oklch(0.75 0.04 255)" },
      { name: "--sidebar-primary",   light: "oklch(0.35 0.02 260)",   dark: "oklch(0.75 0.02 260)" },
    ],
  },
}

// ─── CSS variable applicator ─────────────────────────────────────
function applyOverrides(o: ThemeOverrides) {
  const d = document.documentElement.style

  if (o.primary) {
    const isDarkFg = o.primary.includes("0.68 0.18 85") || o.primary.includes("0.74 0.18 85")
    const fg = isDarkFg ? "oklch(0.15 0 0)" : "oklch(0.98 0 0)"
    d.setProperty("--primary", o.primary)
    d.setProperty("--primary-foreground", fg)
    d.setProperty("--ring", o.primary)
    d.setProperty("--sidebar-primary", o.primary)
  }

  if (o.radius) {
    d.setProperty("--radius", o.radius)
  }

  if (o.preset !== "default") {
    const palette = PRESETS[o.preset]
    for (const v of palette.vars) {
      d.setProperty(v.name, v.light)
    }
  }
}

// ─── hook ────────────────────────────────────────────────────────
export function useThemeCustomizer() {
  const [overrides, setOverrides] = useState<ThemeOverrides>(() => readStorage())

  useEffect(() => { applyOverrides(overrides) }, [overrides])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setOverrides(readStorage())
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  const setPreset = useCallback((preset: ThemePresetId) => {
    setOverrides(prev => { const next = { ...prev, preset, primaryHex: undefined }; writeStorage(next); return next })
  }, [])

  const setPrimary = useCallback((color: string, hex?: string) => {
    setOverrides(prev => { const next = { ...prev, primary: color, primaryHex: hex }; writeStorage(next); return next })
  }, [])

  const setRadius = useCallback((r: string) => {
    setOverrides(prev => { const next = { ...prev, radius: r }; writeStorage(next); return next })
  }, [])

  const reset = useCallback(() => {
    const s = document.documentElement.style
    s.removeProperty("--primary")
    s.removeProperty("--primary-foreground")
    s.removeProperty("--ring")
    s.removeProperty("--sidebar-primary")
    s.removeProperty("--radius")
    ;["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"].forEach((v) => s.removeProperty(v))
    writeStorage({ preset: "default" })
    setOverrides({ preset: "default", primaryHex: undefined })
  }, [])

  return { overrides, presets: PRESETS, setPreset, setPrimary, setRadius, reset }
}
