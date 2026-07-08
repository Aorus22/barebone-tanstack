import { createFileRoute } from "@tanstack/react-router"
import { ComponentShowcasePage } from "@/features/showcase/component-showcase-page"

export type ComponentSearch = {
  q?: string
}

export const Route = createFileRoute("/(app)/demo/component/$slug")({
  validateSearch: (search: Record<string, unknown>): ComponentSearch => {
    return {
      q: (search.q as string) || undefined,
    }
  },
  component: ComponentShowcase,
})

function ComponentShowcase() {
  const { slug } = Route.useParams()
  return <ComponentShowcasePage slug={slug} />
}
