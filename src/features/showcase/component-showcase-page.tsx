import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Link, useNavigate } from "@tanstack/react-router"
import {
  Menu,
  Sun,
  Moon,
  Laptop,
  Layers,
  LayoutGrid,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  MousePointerClick,
  Columns2,
  ToggleLeft,
  Grid2x2,
  Tag,
  Type,
  FormInput,
  CheckSquare,
  ChevronDown,
  Calendar,
  Sliders,
  ChevronsUpDown,
  SquareTerminal,
  CheckCircle2,
  BellRing,
  PanelRight,
  Info,
  AlertTriangle,
  PanelBottom,
  MessageSquare,
  ChevronsDownUp,
  FolderClosed,
  Table,
  Images,
  Percent,
  Loader2,
  LineChart,
  FileSearch,
  User,
  LogOut,
} from "lucide-react"

const GithubIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeCustomizer } from "@/components/global/theme-customizer"
import { DemoNav } from "@/components/global/demo-nav"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { checkSession } from "@/routes/(auth)/server-action"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

import { componentRegistry } from "./component-registry"
import { componentCatalogGroups } from "./component-catalog"

const componentIconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  button: MousePointerClick,
  "button-group": Columns2,
  toggle: ToggleLeft,
  "toggle-group": Grid2x2,
  badge: Tag,
  input: Type,
  field: FormInput,
  "checkbox-switch": CheckSquare,
  select: ChevronDown,
  "date-picker": Calendar,
  slider: Sliders,
  combobox: ChevronsUpDown,
  dialog: SquareTerminal,
  "confirm-modal": CheckCircle2,
  sonner: BellRing,
  sheet: PanelRight,
  tooltip: Info,
  "alert-dialog": AlertTriangle,
  drawer: PanelBottom,
  popover: MessageSquare,
  "file-preview": FileSearch,
  accordion: ChevronsDownUp,
  tabs: FolderClosed,
  table: Table,
  carousel: Images,
  progress: Percent,
  skeleton: Loader2,
  charts: LineChart,
}

export function ComponentShowcasePage({ slug }: { slug?: string }) {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toc, setToc] = useState<{ id: string; label: string }[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Handle mounting state for hydration safe themes
  useEffect(() => {
    setMounted(true)
    checkSession().then((s) => setIsAuthenticated(s.isAuthenticated))
  }, [])

  // Build Table of Contents dynamically based on page headers
  useEffect(() => {
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll("main section[id]")
      const items: { id: string; label: string }[] = []
      sections.forEach((section) => {
        const header = section.querySelector("h3")
        if (header) {
          items.push({
            id: section.id,
            label: header.innerText.replace("#", "").trim(),
          })
        }
      })
      setToc(items)
    }, 150)

    return () => clearTimeout(timer)
  }, [slug])

  // Track active section on scroll using IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0.1 }
    )

    toc.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [toc])

  // Setup Cmd+K keybinding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const activeComponent = slug
    ? componentRegistry.flatMap((g) => g.items).find((item) => item.id === slug)
    : undefined

  const activeGroup = slug
    ? componentRegistry.find((g) => g.items.some((item) => item.id === slug))
    : undefined

  const otherComponentsInGroup = activeGroup
    ? activeGroup.items.filter((item) => item.id !== slug)
    : []

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-background">
      {/* Brand Header */}
      <div className="flex h-14 items-center border-b border-border/60 px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold hover:opacity-90 transition-opacity">
          <Layers className="size-5 text-foreground" />
          <span className="font-heading text-sm tracking-tight text-foreground font-bold">
            demo/ui
          </span>
        </Link>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-6">
        {componentRegistry.map((category) => {
          return (
            <div key={category.group} className="space-y-1">
              <h4 className="px-4 text-[10px] font-bold tracking-widest uppercase text-muted-foreground/50 mb-2">
                {category.group}
              </h4>
              <div className="flex flex-col space-y-0.5">
                {category.items.map((item) => {
                  const Icon = componentIconMap[item.id] || LayoutGrid
                  const isActive = slug === item.id
                  return (
                    <Link
                      key={item.id}
                      to="/demo/component/$slug"
                      params={{ slug: item.id }}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <Icon className={`size-4 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bottom Section — Theme + User */}
      <div className="border-t border-border/50 p-3 space-y-3">
        {/* Theme Toggle */}
        {mounted && (
          <div className="flex items-center justify-between rounded-xl bg-muted/20 px-3 py-2">
            <span className="text-[11px] font-medium text-muted-foreground">Theme</span>
            <div className="flex items-center gap-0.5">
              {[
                { mode: "light", icon: Sun },
                { mode: "dark", icon: Moon },
                { mode: "system", icon: Laptop },
              ].map(({ mode, icon: Icon }) => (
                <button
                  key={mode}
                  onClick={() => setTheme(mode)}
                  className={`size-7 rounded-md flex items-center justify-center transition-colors ${
                    theme === mode ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* User Nav — only shown when logged in */}
        {isAuthenticated && (
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <User className="size-4" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">Admin</p>
                  <p className="text-[10px] text-muted-foreground truncate">Administrator</p>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-56 p-1.5">
              <a
                href="/logout"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-destructive/90 hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="size-4" />
                Sign Out
              </a>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  )

  // ----------------------------------------------------
  // CASE A: RENDER SHADCN-STYLE HOMEPAGE INDEX
  // ----------------------------------------------------
  if (!slug || !activeComponent) {
    return (
      <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden md:flex w-56 flex-col border-r border-border/60 shrink-0 bg-background/50 backdrop-blur-md relative z-20">
          <SidebarContent />
        </aside>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
          {/* Header Toolbar */}
          <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex h-9 w-40 sm:w-64 items-center justify-between rounded-md border border-input bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/65 transition-colors text-left"
              >
                <span className="truncate">Search components...</span>
                <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <ThemeCustomizer />
              <DemoNav />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden size-8">
                    <Menu className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SheetHeader className="sr-only">
                    <SheetTitle>Navigation Menu</SheetTitle>
                  </SheetHeader>
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-12 relative z-10">
            {/* Minimal Shadcn Header Block */}
            <div className="space-y-4 max-w-3xl pt-4">
              <h1 className="font-heading text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-none">
                Build your component library.
              </h1>
              <p className="text-lg text-muted-foreground font-normal leading-relaxed">
                Beautifully designed components built with Radix UI and Tailwind CSS.
                Accessible. Customizable. Open Source. Select a component to check the live playground.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild>
                  <Link to="/demo/component/$slug" params={{ slug: "button" }}>
                    Browse Components
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://github.com/dua-naga" target="_blank" rel="noreferrer">
                    <GithubIcon className="size-4 mr-2" />
                    GitHub
                  </a>
                </Button>
              </div>
            </div>

            <div className="w-full h-px bg-border/60" />

            {/* Categorized Layout Grid */}
            <div className="space-y-8">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Components
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">
                {componentRegistry.map((category) => (
                  <Card key={category.group} className="border border-border/60 bg-card/45 shadow-none">
                    <CardHeader className="pb-3 border-b border-border/40">
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-foreground">
                        {category.group}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1 leading-normal">
                        {category.group === "Actions" && "Buttons, toggles, groups, and status badges."}
                        {category.group === "Forms" && "Fields, checkboxes, switches, selects, date-pickers, and sliders."}
                        {category.group === "Feedback" && "Alerts, toasts, dialogs, drawers, tooltips, and popovers."}
                        {category.group === "Data & Surface" && "Accordions, tables, tabs, carousels, progress, and skeletons."}
                        {category.group === "Utilities" && "Data visualizations and charts."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-3 divide-y divide-border/40">
                      {category.items.map((item) => {
                        const Icon = componentIconMap[item.id] || LayoutGrid
                        return (
                          <Link
                            key={item.id}
                            to="/demo/component/$slug"
                            params={{ slug: item.id }}
                            className="flex items-center justify-between py-3 hover:text-primary transition-colors group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                              <div className="space-y-1">
                                <span className="text-sm font-semibold text-foreground group-hover:text-foreground/95 transition-colors">
                                  {item.label}
                                </span>
                                <p className="text-xs text-muted-foreground leading-normal max-w-sm">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </Link>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Index Checklist Block */}
            <section className="rounded-2xl border border-border/60 bg-muted/20 p-6 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4.5 text-foreground" />
                <h3 className="font-heading text-sm font-bold text-foreground">
                  Component Registry Index ({componentCatalogGroups.reduce((acc, g) => acc + g.items.length, 0)} packages)
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                All component templates configured in <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-[11px] text-foreground">components.json</code>.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-1">
                {componentCatalogGroups.map((group) => (
                  <div key={group.title} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{group.title}</h4>
                      <p className="text-[10px] text-muted-foreground leading-normal mt-0.5">{group.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="rounded-md px-1.5 py-0 text-[9px] font-normal text-muted-foreground bg-muted/20 border-border/50"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>

        {/* Command Search Palette Dialog */}
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
          <Command>
            <CommandInput placeholder="Search components (e.g. Button, Dialog)..." />
            <CommandList>
              <CommandEmpty>No component matches found.</CommandEmpty>
              {componentRegistry.map((category) => (
                <CommandGroup key={category.group} heading={category.group}>
                  {category.items.map((item) => {
                    const Icon = componentIconMap[item.id] || LayoutGrid
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.label}
                        onSelect={() => {
                          setSearchOpen(false)
                          navigate({ to: "/demo/component/$slug", params: { slug: item.id } })
                        }}
                      >
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <Icon className="size-4 text-muted-foreground" />
                            <span>{item.label}</span>
                          </div>
                          <kbd className="pointer-events-none inline-flex select-none items-center gap-0.5 text-[9px] text-muted-foreground font-mono">
                            View
                          </kbd>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </CommandDialog>
      </div>
    )
  }

  // ----------------------------------------------------
  // CASE B: RENDER DYNAMIC SLUG PLAYGROUND
  // ----------------------------------------------------
  const PlaygroundComponent = activeComponent.playground

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border/60 shrink-0 bg-background/50 backdrop-blur-md">
        <SidebarContent />
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
        {/* Header Toolbar */}
        <header className="flex h-14 items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </Link>
            <div className="w-px h-3 bg-border shrink-0 self-center" />
            <span className="text-muted-foreground">{activeGroup?.group}</span>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="font-semibold text-foreground">{activeComponent.label}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-32 sm:w-48 items-center justify-between rounded-md border border-input bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted/65 transition-colors text-left"
            >
              <span className="truncate">Search...</span>
              <kbd className="pointer-events-none hidden sm:inline-flex h-4.5 select-none items-center gap-0.5 rounded border bg-background px-1.5 font-mono text-[9px] font-medium opacity-100">
                ⌘K
              </kbd>
            </button>
            <ThemeCustomizer />
            <DemoNav />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden size-8">
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto scroll-smooth flex justify-center items-start gap-10 p-6 sm:p-10">
          <div className="flex-1 max-w-3xl min-w-0 space-y-8">
            {/* Header info */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {activeComponent.label}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeComponent.description}
              </p>
            </div>

            {/* Render active playground */}
            <PlaygroundComponent />

            {/* Quick links to same category */}
            {otherComponentsInGroup.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-border/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Other {activeGroup?.group} Components
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {otherComponentsInGroup.map((item) => (
                    <Link
                      key={item.id}
                      to="/demo/component/$slug"
                      params={{ slug: item.id }}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-card/35 hover:border-border hover:bg-muted/20 transition-all group"
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar TOC */}
          {toc.length > 0 && (
            <>
              <aside className="hidden xl:block fixed right-6 top-24 w-44 space-y-3 pt-1 z-10">
                <span className="text-[11px] font-bold uppercase tracking-wider text-foreground/80 block">
                  On This Page
                </span>
                <ul className="space-y-2.5 text-[11px] text-muted-foreground border-l border-border/40 overflow-y-auto max-h-[calc(100vh-8rem)]">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className={`hover:text-foreground transition-colors block py-0.5 truncate pl-4 border-l -ml-px ${
                          activeId === item.id
                            ? "text-primary border-primary font-medium"
                            : "border-transparent hover:border-muted-foreground/30"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
              <div className="hidden xl:block w-44 shrink-0" aria-hidden="true" />
            </>
          )}
        </main>
      </div>

      {/* Command Search Palette Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <Command>
          <CommandInput placeholder="Search components (e.g. Button, Dialog)..." />
          <CommandList>
            <CommandEmpty>No component matches found.</CommandEmpty>
            {componentRegistry.map((category) => (
              <CommandGroup key={category.group} heading={category.group}>
                {category.items.map((item) => {
                  const Icon = componentIconMap[item.id] || LayoutGrid
                  return (
                    <CommandItem
                      key={item.id}
                      value={item.label}
                      onSelect={() => {
                        setSearchOpen(false)
                        navigate({ to: "/demo/component/$slug", params: { slug: item.id } })
                      }}
                    >
                      <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Icon className="size-4 text-muted-foreground" />
                          <span>{item.label}</span>
                        </div>
                        <kbd className="pointer-events-none inline-flex select-none items-center gap-0.5 text-[9px] text-muted-foreground font-mono">
                          View
                        </kbd>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
