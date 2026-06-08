import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import type { ColumnDef, SortingState } from "@tanstack/react-table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type DataTableProps<TData, TValue> = {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData> | undefined | null
  searchPlaceholder?: string
  pageSizeOptions?: Array<number>
  initialPageSize?: number
  isLoading?: boolean
  errorMessage?: string
  loadingMessage?: string
  loadingSkeletonRows?: number
  emptyMessage?: string
  className?: string
  enableGlobalFilter?: boolean
  manualPagination?: boolean
  pageIndex?: number
  pageSize?: number
  pageCount?: number
  totalRows?: number
  onPageChange?: (pageIndex: number) => void
  onPageSizeChange?: (pageSize: number) => void
  showTopControls?: boolean
  manualSorting?: boolean
  sorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void
  autoResetPageIndex?: boolean
  searchValue?: string
  onSearchValueChange?: (value: string) => void
  onSearchSubmit?: () => void
}

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50"

export function DataTable<TData, TValue>({
  columns,
  data,
  searchPlaceholder = "Cari...",
  pageSizeOptions = [10, 20, 50, 100],
  initialPageSize = pageSizeOptions[0] ?? 10,
  isLoading = false,
  errorMessage,
  loadingMessage = "Memuat data...",
  loadingSkeletonRows = 8,
  emptyMessage = "Tidak ada data.",
  className,
  enableGlobalFilter = true,
  manualPagination = false,
  pageIndex = 0,
  pageSize = initialPageSize,
  pageCount = 1,
  totalRows,
  onPageChange,
  onPageSizeChange,
  showTopControls = true,
  manualSorting = false,
  sorting: controlledSorting,
  onSortingChange,
  autoResetPageIndex = true,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
}: DataTableProps<TData, TValue>) {
  const safeData = Array.isArray(data) ? data : []
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const isServerSearch =
    searchValue !== undefined && onSearchValueChange !== undefined

  React.useEffect(() => {
    if (!enableGlobalFilter && !isServerSearch) {
      setGlobalFilter("")
    }
  }, [enableGlobalFilter, isServerSearch])

  const displaySearchValue = isServerSearch ? searchValue : globalFilter

  const handleSearchChange = (value: string) => {
    if (isServerSearch) {
      onSearchValueChange?.(value)
      return
    }

    setGlobalFilter(value)
  }

  const sorting = controlledSorting ?? internalSorting
  const visibleColumnCount = Math.max(columns.length, 1)
  const skeletonRowCount = Math.max(1, loadingSkeletonRows)

  const table = useReactTable({
    data: safeData,
    columns,
    state: {
      sorting,
      globalFilter: enableGlobalFilter ? globalFilter : "",
      ...(manualPagination ? { pagination: { pageIndex, pageSize } } : {}),
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    manualPagination,
    manualSorting,
    pageCount: manualPagination ? pageCount : undefined,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === "function" ? updater(sorting) : updater

      if (controlledSorting === undefined) {
        setInternalSorting(nextSorting)
      }

      onSortingChange?.(nextSorting)
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
  })

  const currentPageIndex = manualPagination
    ? pageIndex
    : table.getState().pagination.pageIndex
  const currentPageSize = manualPagination
    ? pageSize
    : table.getState().pagination.pageSize
  const currentPageCount = manualPagination ? pageCount : table.getPageCount()
  const canPreviousPage = currentPageIndex > 0
  const canNextPage = currentPageIndex < Math.max(currentPageCount - 1, 0)
  const visibleRowsCount = manualPagination
    ? totalRows ?? safeData.length
    : table.getFilteredRowModel().rows.length

  const setPage = (nextIndex: number) => {
    if (manualPagination) {
      onPageChange?.(nextIndex)
      return
    }

    table.setPageIndex(nextIndex)
  }

  const setSize = (nextSize: number) => {
    if (manualPagination) {
      onPageSizeChange?.(nextSize)
      return
    }

    table.setPageSize(nextSize)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {showTopControls ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {enableGlobalFilter || isServerSearch ? (
            <Input
              value={displaySearchValue}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && isServerSearch) {
                  onSearchSubmit?.()
                }
              }}
              placeholder={searchPlaceholder}
              className="max-w-sm"
              type="search"
            />
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Baris per halaman
            </span>
            <div className="w-24">
              <select
                aria-label="Baris per halaman"
                className={cn(selectClassName)}
                value={String(currentPageSize)}
                onChange={(event) => setSize(Number(event.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={String(size)}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : null}

      <div className="max-h-[calc(100vh-320px)] overflow-auto rounded-2xl border border-border bg-card/50 backdrop-blur">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()

                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex w-full select-none items-center gap-2 text-left font-black uppercase transition-colors hover:text-foreground"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {sorted === "asc" ? (
                            <ArrowUpIcon className="size-4 text-muted-foreground" />
                          ) : sorted === "desc" ? (
                            <ArrowDownIcon className="size-4 text-muted-foreground" />
                          ) : null}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <>
                {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`}>
                    {Array.from({ length: visibleColumnCount }).map(
                      (_, cellIndex) => (
                        <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell
                    colSpan={visibleColumnCount}
                    className="py-6 text-center text-sm text-muted-foreground"
                  >
                    {loadingMessage}
                  </TableCell>
                </TableRow>
              </>
            ) : errorMessage ? (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="py-10 text-center text-sm text-destructive"
                >
                  {errorMessage}
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={visibleColumnCount}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? loadingMessage : `${visibleRowsCount} data`}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(0)}
            disabled={!canPreviousPage}
            aria-label="Ke halaman pertama"
          >
            <ChevronsLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPageIndex - 1)}
            disabled={!canPreviousPage}
            aria-label="Ke halaman sebelumnya"
          >
            <ChevronLeftIcon />
          </Button>
          <div className="px-2 text-sm text-muted-foreground">
            Halaman{" "}
            <span className="font-medium text-foreground">
              {currentPageIndex + 1}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">
              {currentPageCount || 1}
            </span>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(currentPageIndex + 1)}
            disabled={!canNextPage}
            aria-label="Ke halaman berikutnya"
          >
            <ChevronRightIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.max(currentPageCount - 1, 0))}
            disabled={!canNextPage}
            aria-label="Ke halaman terakhir"
          >
            <ChevronsRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
