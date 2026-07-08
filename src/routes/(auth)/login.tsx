import { useState } from "react"
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router"
import { LogIn, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeCustomizer } from "@/components/global/theme-customizer"
import { checkSession, loginUser } from "./server-action"

export const Route = createFileRoute("/(auth)/login")({
  beforeLoad: async () => {
    const session = await checkSession()
    if (session.isAuthenticated) {
      throw redirect({ to: "/admin/user-management" })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!username.trim() || !password.trim()) {
      setError("Username dan password harus diisi.")
      return
    }

    setLoading(true)
    try {
      const result = await loginUser({ data: { username: username.trim(), password } })
      if (result.success) {
        navigate({ to: "/admin/user-management" })
      } else {
        setError(result.error ?? "Login gagal.")
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background relative">
      <div className="absolute top-4 right-4">
        <ThemeCustomizer />
      </div>
      <div className="w-full max-w-sm space-y-6 p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldAlert className="size-7" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">Masuk untuk mengelola sistem.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            <LogIn className="size-4" />
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Kembali ke{" "}
          <Link to="/" className="text-primary hover:underline">
            Beranda
          </Link>
        </p>
      </div>
    </div>
  )
}
