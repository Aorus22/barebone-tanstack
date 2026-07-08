import { HeadContent, Scripts, createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"
import { useEffect, useState } from "react"
import { ThemeProvider } from "next-themes"

import appCss from "../styles.css?url"

import { ConfirmModalProvider } from "@/components/global/confirm-modal-provider"
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Bare Bone",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        children: "(function(){try{var e=localStorage.getItem('theme-custom-colors');if(!e)return;var t=JSON.parse(e),d=document.documentElement.style;if(t.radius)d.setProperty('--radius',t.radius);var p=t.primary;if(!p&&t.preset&&t.preset!=='default'){var m={emerald:'oklch(0.58 0.18 158)',violet:'oklch(0.52 0.22 285)',rose:'oklch(0.58 0.2 20)',amber:'oklch(0.68 0.18 85)',slate:'oklch(0.35 0.02 260)'};p=m[t.preset]}if(p){d.setProperty('--primary',p);d.setProperty('--ring',p);d.setProperty('--sidebar-primary',p)}}catch(e){}})()",
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  component: RootDocument,
})

function RootDocument() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const enableTanStackDevtools =
    mounted && import.meta.env.DEV && import.meta.env.VITE_ENABLE_TANSTACK_DEVTOOLS === "true"

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ConfirmModalProvider>
            <Outlet />
          </ConfirmModalProvider>
        </ThemeProvider>
        <Toaster />
        {enableTanStackDevtools ? (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
