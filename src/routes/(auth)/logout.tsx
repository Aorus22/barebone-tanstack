import { createFileRoute, redirect } from "@tanstack/react-router"
import { logoutUser } from "./server-action"

export const Route = createFileRoute("/(auth)/logout")({
  beforeLoad: async () => {
    await logoutUser()
    throw redirect({ to: "/login" })
  },
  component: () => null,
})
