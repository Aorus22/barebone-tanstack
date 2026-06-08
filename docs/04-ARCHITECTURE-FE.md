# Frontend Architecture — Funnel Flow

## Boundary Utama

Frontend terbagi menjadi beberapa area:

- `src/routes` — page dan shell berbasis TanStack Router
- `src/components/ui` — primitive/preset UI dari shadcn
- `src/components/global` — reusable component tingkat aplikasi
- `src/hooks` — custom hooks
- `src/lib` — client/server/shared libraries
- `src/utils` — formatting dan utility functions
- `src/backend` — service skeleton (frontend-adjacent, untuk server functions)
- `src/router` — module config pattern

## Router

`src/router.tsx` membuat router dengan konfigurasi:

- `scrollRestoration: true`
- `defaultPreload: "intent"`
- `defaultPreloadStaleTime: 0`
- `defaultPendingComponent` — spinner `Loader2`
- `defaultErrorComponent` — halaman error dengan `AlertTriangle` + tombol reload
- NProgress — progress bar di top-of-page saat navigasi

`src/routes/__root.tsx` menjadi shell global untuk:

- metadata dasar HTML + stylesheet
- ThemeProvider (next-themes)
- ConfirmModalProvider
- Toaster (sonner)
- TanStack Devtools (conditional via `VITE_ENABLE_TANSTACK_DEVTOOLS`)
- Scripts

### Layout Groups

- `(app)/route.tsx` — app layout (container flex, siap untuk AppShell)
- `(auth)/` — auth layout (belum ada route)
- `(landing)/` — landing layout (belum ada route)

## Styling System

Sumber style utama ada di `src/styles.css`.

Karakteristik:

- Tailwind CSS v4
- `tw-animate-css`
- shadcn theme layer (radix-nova)
- font `Inter Variable`
- CSS variable untuk theme terang/gelap

## Library Komponen UI

`src/components/ui` berisi komponen siap pakai seperti:

- form controls (`input`, `select`, `textarea`, `checkbox`, `radio-group`)
- feedback (`alert`, `progress`, `skeleton`, `sonner`)
- overlays (`dialog`, `drawer`, `popover`, `sheet`, `tooltip`)
- navigasi/layout (`breadcrumb`, `sidebar`, `tabs`, `navigation-menu`)
- data display (`table`, `card`, `chart`, `item`, `date-picker`)

Folder ini diperlakukan sebagai shared UI layer, bukan tempat logic bisnis.

## Komponen Global

### DataTable

Lokasi: `src/components/global/data-table.tsx`

Wrapper reusable untuk `@tanstack/react-table` dengan dukungan:
- sorting internal atau manual
- pencarian/filter global
- loading, error, dan empty state
- pagination internal atau manual
- integrasi kolom generik berbasis `ColumnDef<TData, TValue>`

### ConfirmModalProvider

Lokasi: `src/components/global/confirm-modal-provider.tsx`

Imperative confirm dialog. Dipasang di `__root.tsx`, dipanggil dari mana saja via:

```ts
import { confirmModal } from "@/lib/client/confirm-modal"

const confirmed = await confirmModal("Hapus item ini?", {
  title: "Konfirmasi Hapus",
  confirmText: "Hapus",
  destructive: true,
})
```

### DatePicker

Lokasi: `src/components/ui/date-picker.tsx`

Date picker dengan popover calendar:
- input/output format: `YYYY-MM-DD`
- placeholder kustom
- tombol clear
- disabled state
- locale Indonesia

## Hooks

### `useIsMobile()`

Lokasi: `src/hooks/use-mobile.ts`

Mendeteksi viewport mobile dengan breakpoint `768px`.

## Client Libraries

### Toast

Lokasi: `src/lib/client/toast.ts`

```ts
import { appToast } from "@/lib/client/toast"

appToast.success("Berhasil disimpan")
appToast.error("Gagal memuat data")
appToast.info("Sedang diproses...")
```

### Confirm Modal (Imperative API)

Lokasi: `src/lib/client/confirm-modal.ts`

```ts
const confirmed = await confirmModal(message, options?)
```

## Utilities

### Date Formatting

Lokasi: `src/utils/client-utils/date.ts`

- `formatJakartaDateTime(value)` — "17 Jun 2026 14:30"
- `formatJakartaDate(value)` — "17 Jun 2026"

### Number/Currency Formatting

Lokasi: `src/utils/client-utils/format.ts`

- `formatCurrency(value)` — "Rp1.000.000"
- `formatNumber(value)` — "1.000.000"
- `formatDate(date)` — "17 Juni 2026"
- `formatDateTime(date)` — "17 Juni 2026 14:30"
- `formatTime(date)` — "14:30"

## Prinsip Struktur

- komponen visual murni masuk `components/ui`
- reusable app-level component masuk `components/global`
- route tetap tipis jika logic bertambah
- utilitas class merge tetap menggunakan `cn()`
- formatting logic di `utils/`, bukan di komponen
- custom hooks di `hooks/`, bukan di komponen
