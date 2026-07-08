import { createFileRoute } from "@tanstack/react-router"
import { ComponentShowcasePage } from "@/features/showcase/component-showcase-page"

export type HomeSearch = {
  q?: string
}

export const Route = createFileRoute("/(app)/")({
  validateSearch: (search: Record<string, unknown>): HomeSearch => {
    return {
      q: (search.q as string) || undefined,
    }
  },
  component: AppHome,
})

function AppHome() {
  return <ComponentShowcasePage />
}
