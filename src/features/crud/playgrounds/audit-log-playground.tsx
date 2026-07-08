import { useState, useEffect, useCallback } from "react"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import { RefreshCw, AlertCircle } from "lucide-react"

import { DataTable } from "@/components/global/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getAuditLogPage } from "@/routes/(app)/admin/audit-log/query"
import type { SystemLogListItem, SystemLogStatus } from "@/lib/server/system-action-logger"

const statusBadgeClass: Record<SystemLogStatus, string> = {
  SUCCESS: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  ERROR: "bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30",
}

const columns: Array<ColumnDef<SystemLogListItem>> = [
  {
    accessorKey: "actionName",
    header: "Action",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono text-xs font-medium">{row.getValue("actionName")}</span>
    ),
  },
  { accessorKey: "module", header: "Module", enableSorting: true },
  { accessorKey: "actorName", header: "Actor", enableSorting: true },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.getValue("status") as SystemLogStatus
      return (
        <Badge variant="outline" className={statusBadgeClass[status]}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-xs text-muted-foreground">{row.getValue("createdAt")}</span>
    ),
  },
]

export function AuditLogPlayground() {
  const [data, setData] = useState<SystemLogListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sorting, setSorting] = useState<SortingState>([])
  const [totalRows, setTotalRows] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setIsLoading(true)
    setError(null)

    const sortParam = sorting.length > 0
      ? { sortBy: sorting[0].id, sortDir: sorting[0].desc ? "desc" : "asc" }
      : {}

    try {
      const result = await getAuditLogPage({
        data: { page: pageIndex + 1, pageSize, ...sortParam },
      })
      setData(result.rows)
      setTotalRows(result.pagination.total)
      setPageCount(result.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat audit log.")
      setData([])
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }, [pageIndex, pageSize, sorting])

  useEffect(() => {
    let cancelled = false
    loadData().then(() => { if (cancelled) return })
    return () => { cancelled = true }
  }, [loadData])

  const handleRefresh = () => loadData(true)
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPageIndex(0)
  }, [])

  const successCount = data.filter((r) => r.status === "SUCCESS").length
  const errorCount = data.filter((r) => r.status === "ERROR").length

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Audit Log</h3>
          <p className="text-sm text-muted-foreground">
            Mencatat {totalRows} aktivitas sistem. Data disimpan di SQLite (logs/system-action.db).
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isLoading && !error && totalRows > 0 && (
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                {successCount} success
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-red-500" />
                {errorCount} error
              </span>
            </div>
          )}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing} className="gap-1.5">
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
          <Button variant="outline" size="xs" onClick={handleRefresh} className="ml-auto">Coba Lagi</Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data}
        isLoading={isLoading}
        manualPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        totalRows={totalRows}
        onPageChange={setPageIndex}
        onPageSizeChange={handlePageSizeChange}
        manualSorting
        sorting={sorting}
        onSortingChange={setSorting}
        enableGlobalFilter={false}
        showTopControls={false}
      />
    </div>
  )
}
