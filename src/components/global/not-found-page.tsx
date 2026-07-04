import { useNavigate } from "@tanstack/react-router"
import { Sun, Moon, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { flushSync } from "react-dom"

export function NotFoundPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeToggle = (event?: React.MouseEvent<HTMLButtonElement>) => {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={handleThemeToggle}
          className="w-10 h-10 rounded-full bg-card/80 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all backdrop-blur-sm cursor-pointer active:scale-95"
        >
          {mounted && theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.04),transparent_45%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.05),transparent_50%)]" />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(circle_at_50%_50%,var(--foreground)_0%,transparent_100%)] z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-card/90 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md text-center"
      >
        <div className="space-y-2">
          <div className="text-6xl font-bold text-primary/30 select-none">
            404
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-foreground">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            type="button"
            className="w-full gap-2 cursor-pointer py-4 text-xs font-bold transition-all hover:shadow-md hover:shadow-primary/10"
            onClick={() => navigate({ to: "/" })}
          >
            <Home className="h-3.5 w-3.5" />
            Beranda
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 cursor-pointer py-4 text-xs font-bold transition-all hover:bg-muted"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
