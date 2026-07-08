import { createFileRoute, Outlet } from "@tanstack/react-router"

export type AppSearch = {
  q?: string
}

export const Route = createFileRoute("/(app)")({
  validateSearch: (search: Record<string, unknown>): AppSearch => {
    return {
      q: (search.q as string) || undefined,
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="h-screen bg-background flex text-foreground overflow-hidden">
      <main className="flex-1 h-full relative flex flex-col min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
