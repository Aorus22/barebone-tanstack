# Code Patterns — Funnel Flow

## Import & Alias

Gunakan alias `@/` untuk import dari `src`.

Contoh:
```tsx
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/global/data-table"
import { cn } from "@/lib/utils"
import { appToast } from "@/lib/client/toast"
import { formatCurrency } from "@/utils/client-utils/format"
import { confirmModal } from "@/lib/client/confirm-modal"
```

## Utility Class Merge

Gunakan `cn(...)` dari `src/lib/utils.ts` untuk menggabungkan class Tailwind.

## Struktur Komponen

- `components/ui` — primitive/preset UI (shadcn)
- `components/global` — reusable component level aplikasi
- `hooks/` — custom React hooks
- `lib/client/` — client-side libraries
- `lib/server/` — server-only libraries
- `lib/shared/` — shared libraries (client + server)
- `utils/client-utils/` — client formatting utilities
- `utils/server-utils/` — server formatting utilities
- `backend/` — backend service modules

## Pattern Routing

- `src/routes/__root.tsx` — root shell dengan ThemeProvider, ConfirmModalProvider, Toaster
- `src/routes/(app)/route.tsx` — app layout group (authenticated)
- `src/routes/(auth)/route.tsx` — auth layout group (login/logout)
- `src/routes/(landing)/route.tsx` — landing layout group (public)
- `createRootRoute(...)` — shell global
- `createFileRoute(...)` — page route
- router instance terpusat di `src/router.tsx` dengan default pending/error components

## Pattern Imperative Confirm

Gunakan `confirmModal()` dari `@/lib/client/confirm-modal` untuk konfirmasi dialog.

```ts
const ok = await confirmModal("Yakin ingin melanjutkan?", {
  title: "Konfirmasi",
  confirmText: "Lanjutkan",
  cancelText: "Batal",
  destructive: false,
})
if (!ok) return
```

Pastikan `ConfirmModalProvider` sudah terpasang di root shell (`__root.tsx`).

## Pattern Toast Notification

Gunakan `appToast` dari `@/lib/client/toast` untuk notifikasi.

```ts
appToast.success("Data berhasil disimpan")
appToast.error("Gagal menghubungi server")
appToast.info("Proses sedang berjalan")
```

## Pattern Date/Formatting

Semua formatting menggunakan utilities dari `@/utils/client-utils/`.

```ts
import { formatCurrency, formatDate } from "@/utils/client-utils/format"
import { formatJakartaDateTime } from "@/utils/client-utils/date"

formatCurrency(1000000)   // "Rp1.000.000"
formatDate(new Date())    // "17 Juni 2026"
formatJakartaDateTime(ts) // "17 Jun 2026 14:30"
```

## Pattern Reusable Table

`DataTable` di `src/components/global/data-table.tsx` adalah pattern utama untuk list/grid tabular.

Props penting:
- `columns`, `data`, `isLoading`, `errorMessage`, `emptyMessage`
- `manualPagination`, `manualSorting`
- `sorting`, `onSortingChange`
- `searchValue`, `onSearchValueChange`, `onSearchSubmit`

## Pattern Dynamic Import untuk Server-Only Modules

Di dalam handler `createServerFn`, semua modul server-only WAJIB di-import secara dinamis:

```ts
const service = await import("@/backend/module/module.service")
```

Static import server-only modules di top-level file route dilarang karena akan merusak client-side bundle.

## Anti-Pattern

- jangan taruh logic bisnis berat di `components/ui`
- jangan impor path relatif panjang jika alias `@/` tersedia
- jangan duplikasi logic tabel jika `DataTable` bisa dipakai
- jangan memperlakukan `routeTree.gen.ts` sebagai file edit manual
- jangan hardcode format currency/date — pakai utilities dari `utils/`
- jangan panggil `toast()` langsung dari sonner — pakai `appToast` wrapper
- jangan buat confirm dialog manual — pakai `confirmModal()`
