import { useState, useEffect } from "react"
import { Play, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable } from "@/components/global/data-table"
import { ShowcaseSection } from "../showcase-section"
import type { ColumnDef, SortingState } from "@tanstack/react-table"

type AgentData = {
  id: string
  task: string
  status: string
  runtime: string
}

const demoData: AgentData[] = [
  { id: "agent-01", task: "Database Seeding", status: "Completed", runtime: "24s" },
  { id: "agent-02", task: "Browser Subagent Testing", status: "Active", runtime: "1m 15s" },
  { id: "agent-03", task: "Linter Corrections", status: "Queued", runtime: "0s" },
  { id: "agent-04", task: "API Integration Tests", status: "Active", runtime: "3m 42s" },
  { id: "agent-05", task: "Deploy to Staging", status: "Completed", runtime: "18s" },
  { id: "agent-06", task: "Database Backup", status: "Completed", runtime: "45s" },
  { id: "agent-07", task: "Security Audit", status: "Active", runtime: "2m 10s" },
  { id: "agent-08", task: "Cache Warmup", status: "Queued", runtime: "0s" },
  { id: "agent-09", task: "Report Generation", status: "Pending", runtime: "0s" },
  { id: "agent-10", task: "Log Rotation", status: "Completed", runtime: "12s" },
  { id: "agent-11", task: "Health Check Monitoring", status: "Active", runtime: "5m 0s" },
  { id: "agent-12", task: "Dependency Updates", status: "Queued", runtime: "0s" },
]

const defaultColumns: Array<ColumnDef<AgentData>> = [
  {
    accessorKey: "id",
    header: "Agent ID",
    cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
  },
  {
    accessorKey: "task",
    header: "Task Assignment",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
          status === "Active" ? "text-primary" : status === "Completed" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
        }`}>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "runtime",
    header: "Runtime",
    cell: ({ row }) => <span className="text-right block">{row.getValue("runtime")}</span>,
  },
]

export function AccordionPlayground() {
  const singleCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Google Antigravity?</AccordionTrigger>
    <AccordionContent>
      Google Antigravity is a suite of advanced developer tools.
    </AccordionContent>
  </AccordionItem>
</Accordion>`

  const multipleCode = `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

<Accordion type="multiple" className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section One</AccordionTrigger>
    <AccordionContent>Content here.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section Two</AccordionTrigger>
    <AccordionContent>Content here.</AccordionContent>
  </AccordionItem>
</Accordion>`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#accordion-single" className="hover:text-foreground hover:underline transition-colors">Single (Collapsible)</a>
        <a href="#accordion-multiple" className="hover:text-foreground hover:underline transition-colors">• Multiple</a>
      </div>

      <ShowcaseSection
        id="accordion-single"
        eyebrow="Data / Surface"
        title="Single (Collapsible)"
        description="Only one panel open at a time. Collapsible allows closing the open panel."
        code={singleCode}
      >
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Google Antigravity?</AccordionTrigger>
            <AccordionContent>
              Google Antigravity is a suite of advanced developer tools designed to automate software engineering, pair programming, and repository modifications seamlessly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Can I customize my dev environment?</AccordionTrigger>
            <AccordionContent>
              Yes! You can define custom rules, agent behaviors, and configure workspace sidecars or MCP servers inside configuration subdirectories.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>

      <ShowcaseSection
        id="accordion-multiple"
        eyebrow="Data / Surface"
        title="Multiple"
        description="Allows opening multiple panels simultaneously — great for documentation indexes."
        code={multipleCode}
      >
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does project setup work?</AccordionTrigger>
            <AccordionContent>
              Clone the repository and run <code className="bg-muted px-1 rounded text-xs font-mono">bun install</code> from the root directory to install all dependencies.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Where do I configure agents?</AccordionTrigger>
            <AccordionContent>
              Custom agent definitions live inside <code className="bg-muted px-1 rounded text-xs font-mono">.opencode/agents/</code>. You can define spawn rules, file permissions, and model assignments there.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I extend the UI library?</AccordionTrigger>
            <AccordionContent>
              Yes! Components are inside <code className="bg-muted px-1 rounded text-xs font-mono">src/components/ui/</code>. Each file is self-contained and ready to customize.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ShowcaseSection>
    </div>
  )
}

export function TabsPlayground() {
  const [, setVariant] = useState("all")

  const code = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="all" className="w-full">
  <TabsList>
    <TabsTrigger value="all">All Campaigns</TabsTrigger>
    <TabsTrigger value="active">Active</TabsTrigger>
  </TabsList>
  <TabsContent value="all">Showing all items...</TabsContent>
</Tabs>`

  return (
    <ShowcaseSection
      id="tabs"
      eyebrow="Data / Surface"
      title="Tabs"
      description="Content compartments toggled via clean button selectors, ideal for dashboard sections."
      code={code}
    >
      <Tabs defaultValue="all" className="w-full" onValueChange={setVariant}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All Logs</TabsTrigger>
          <TabsTrigger value="errors">Errors only</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
        <div className="mt-4 rounded-xl border border-border p-4 bg-muted/20 text-sm">
          <TabsContent value="all">
            <span className="font-semibold text-foreground">All Logs:</span> Showing 1,024 events in real-time stream.
          </TabsContent>
          <TabsContent value="errors">
            <span className="font-semibold text-destructive">Errors only:</span> 0 database issues detected in the past 24 hours.
          </TabsContent>
          <TabsContent value="archived">
            <span className="font-semibold text-muted-foreground">Archived:</span> 14 documents compressed and stored in GCS.
          </TabsContent>
        </div>
      </Tabs>
    </ShowcaseSection>
  )
}

export function TablePlayground() {
  const clientCode = `import { DataTable } from "@/components/global/data-table"
import type { ColumnDef } from "@tanstack/react-table"

// Define columns
const columns: Array<ColumnDef<Agent>> = [
  { accessorKey: "id", header: "Agent ID" },
  { accessorKey: "task", header: "Task Assignment" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "runtime", header: "Runtime" },
]

// Pass all data — client-side
<DataTable
  columns={columns}
  data={agents}
  searchPlaceholder="Cari agent..."
  emptyMessage="Tidak ada agent."
/>`

  const serverCode = `import { DataTable } from "@/components/global/data-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { useState } from "react"

const [sorting, setSorting] = useState<SortingState>([])
const [pageIndex, setPageIndex] = useState(0)

// Pass pagination/sorting state — server-side
<DataTable
  columns={columns}
  data={pageData}
  manualPagination
  pageIndex={pageIndex}
  pageSize={10}
  pageCount={totalPages}
  totalRows={totalCount}
  onPageChange={setPageIndex}
  manualSorting
  sorting={sorting}
  onSortingChange={setSorting}
  enableGlobalFilter={false}
  showTopControls={false}
/>`

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-xs text-muted-foreground border-b border-border/40 pb-4">
        <span className="font-semibold text-foreground mr-1">Jump to:</span>
        <a href="#table-client" className="hover:text-foreground hover:underline transition-colors">Client-Side</a>
        <a href="#table-server" className="hover:text-foreground hover:underline transition-colors">• Server-Side</a>
      </div>

      <ShowcaseSection
        id="table-client"
        eyebrow="Data / Surface"
        title="Client-Side Table"
        description="All data loaded upfront. Search, sort, and pagination handled entirely in the browser via @tanstack/react-table."
        code={clientCode}
      >
        <DataTable
          columns={defaultColumns}
          data={demoData}
          searchPlaceholder="Cari agent atau task..."
          emptyMessage="Tidak ada agent."
        />
      </ShowcaseSection>

      <ShowcaseSection
        id="table-server"
        eyebrow="Data / Surface"
        title="Server-Side Table"
        description="Pagination, sorting, and search controlled externally. Each interaction triggers a new data fetch (simulated with local data here)."
        code={serverCode}
      >
        <ServerSimulatedTable />
      </ShowcaseSection>
    </div>
  )
}

function ServerSimulatedTable() {
  const [pageIndex, setPageIndex] = useState(0)
  const [sorting, setSorting] = useState<SortingState>([])
  const pageSize = 5

  const sorted = [...demoData].sort((a, b) => {
    if (sorting.length === 0) return 0
    const { id, desc } = sorting[0]
    const aVal = String(a[id as keyof AgentData])
    const bVal = String(b[id as keyof AgentData])
    return desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal)
  })

  const paged = sorted.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
  const totalPages = Math.ceil(demoData.length / pageSize)

  return (
    <DataTable
      columns={defaultColumns}
      data={paged}
      manualPagination
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={totalPages}
      totalRows={demoData.length}
      onPageChange={setPageIndex}
      manualSorting
      sorting={sorting}
      onSortingChange={setSorting}
      enableGlobalFilter={false}
      showTopControls={false}
    />
  )
}

export function CarouselPlayground() {
  const code = `import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

<Carousel className="w-full max-w-xs">
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`

  return (
    <ShowcaseSection
      id="carousel"
      eyebrow="Data / Surface"
      title="Carousel"
      description="A motion slider utilizing Embla Carousel. Best for sliding galleries or reviews."
      code={code}
    >
      <div className="w-full px-12">
        <Carousel className="w-full max-w-xs mx-auto">
          <CarouselContent>
            {[1, 2, 3].map((num) => (
              <CarouselItem key={num}>
                <div className="p-1">
                  <Card className="border border-border/80 bg-background/80 shadow-none">
                    <CardContent className="flex aspect-video items-center justify-center p-6 select-none">
                      <div className="text-center space-y-1">
                        <span className="text-2xl font-bold text-primary">Slide {num}</span>
                        <p className="text-xs text-muted-foreground">Swipe or use arrows to navigate</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </ShowcaseSection>
  )
}

export function ProgressPlayground() {
  const [progress, setProgress] = useState(33)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning) return
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsRunning(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
    return () => clearInterval(timer)
  }, [isRunning])

  const handleStart = () => {
    if (progress >= 100) setProgress(0)
    setIsRunning(true)
  }

  const code = `import { Progress } from "@/components/ui/progress"

<Progress value={${progress}} />`

  return (
    <ShowcaseSection
      id="progress"
      eyebrow="Data / Surface"
      title="Progress Bar"
      description="Simple and smooth loading progress track indicator. Click below to simulate progress."
      code={code}
    >
      <div className="w-full max-w-xs flex flex-col gap-4">
        <Progress value={progress} className="h-2" />
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground font-semibold">
            Status: {progress}% {progress === 100 ? "Finished" : isRunning ? "Loading..." : "Idle"}
          </span>
          <div className="flex gap-2">
            <Button size="xs" variant="outline" onClick={handleStart} disabled={isRunning} className="gap-1">
              <Play className="size-3" />
              {progress >= 100 ? "Re-run" : "Run"}
            </Button>
            <Button size="xs" variant="ghost" onClick={() => { setProgress(0); setIsRunning(false) }} className="size-6 p-0">
              <RotateCcw className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </ShowcaseSection>
  )
}

export function SkeletonPlayground() {
  const [loading, setLoading] = useState(true)

  const code = `import { Skeleton } from "@/components/ui/skeleton"

{loading ? (
  <div className="flex items-center gap-3">
    <Skeleton className="size-10 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[150px]" />
      <Skeleton className="h-3 w-[100px]" />
    </div>
  </div>
) : (
  <ActualContent />
)}`

  return (
    <ShowcaseSection
      id="skeleton"
      eyebrow="Data / Surface"
      title="Skeleton Loader"
      description="Placeholder boxes indicating content loading states. Switch states below."
      code={code}
      knobs={
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Skeleton Loading</span>
          <input
            type="checkbox"
            checked={loading}
            onChange={(e) => setLoading(e.target.checked)}
            className="h-4 w-4 rounded-sm border-border bg-background accent-primary"
          />
        </div>
      }
    >
      <div className="w-full max-w-xs p-4 rounded-2xl border border-border/80 bg-background/50 transition-all duration-300">
        {loading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Jane Doe</span>
              <span className="text-xs text-muted-foreground">System Architect</span>
            </div>
          </div>
        )}
      </div>
    </ShowcaseSection>
  )
}
