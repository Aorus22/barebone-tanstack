# Architecture Decision Records — Funnel Flow

## ADR-001 — Gunakan TanStack Start sebagai Fondasi App

Keputusan:
- aplikasi menggunakan TanStack Start + TanStack Router sebagai fondasi routing dan shell rendering.

Alasan:
- cocok untuk file-based routing,
- terintegrasi baik dengan React,
- menyediakan devtools yang langsung berguna saat fase awal.

## ADR-002 — Gunakan shadcn/ui sebagai Shared UI Layer

Keputusan:
- primitive UI ditempatkan di `src/components/ui`.

Alasan:
- mempercepat pembangunan antarmuka,
- konsisten dengan token styling dan komponen generator shadcn,
- mudah diperluas dengan wrapper level aplikasi.

## ADR-003 — Simpan Reusable Domain-Agnostic Component di `components/global`

Keputusan:
- reusable component yang bukan primitive UI disimpan di `src/components/global`.

Contoh saat ini:
- `DataTable`
- `ConfirmModalProvider`

Alasan:
- memisahkan shared UI primitives dari application-level abstractions,
- memudahkan reuse lintas halaman ketika domain bisnis mulai bertambah.

## ADR-004 — Gunakan Alias `@/`

Keputusan:
- semua import internal memakai alias `@/`.

Alasan:
- lebih stabil saat struktur folder bertambah,
- lebih mudah dibaca dibanding import relatif panjang.

## ADR-005 — Adopsi Struktur Direktori dari kime-warehouse

Keputusan:
- struktur direktori `funnel-flow` mengikuti pola yang sudah terbukti di `kime-warehouse`:
  - `src/backend/` untuk service modules
  - `src/router/` untuk module config
  - `src/lib/client/`, `src/lib/server/`, `src/lib/shared/` untuk layer library
  - `src/utils/client-utils/`, `src/utils/server-utils/` untuk formatting
  - `src/ui/custom/` untuk custom UI patterns
  - route layout groups: `(app)`, `(auth)`, `(landing)`

Alasan:
- konsistensi antar proyek memudahkan developer yang bekerja di kedua codebase,
- pola arsitektur kime-warehouse sudah teruji dengan backend services, RBAC, dan SSE,
- memudahkan porting komponen dan utilities antar proyek.

## ADR-006 — Router dengan Default Pending/Error Components + NProgress

Keputusan:
- router memiliki `defaultPendingComponent` (spinner) dan `defaultErrorComponent` (error page with reload),
- NProgress loading bar aktif untuk indikasi navigasi asynchronous.

Alasan:
- memberikan user feedback instan saat navigasi antar halaman,
- error component konsisten di seluruh aplikasi tanpa perlu deklarasi per-route.

## ADR-007 — ThemeProvider + ConfirmModalProvider + Toaster di Root Shell

Keputusan:
- `__root.tsx` membungkus aplikasi dengan:
  - `ThemeProvider` (next-themes) untuk dark/light mode
  - `ConfirmModalProvider` untuk imperative confirm dialog
  - `Toaster` (sonner) untuk notifikasi

Alasan:
- provider ini dibutuhkan di seluruh aplikasi,
- root shell adalah satu-satunya tempat yang menjamin coverage 100%,
- memisahkan concerns: routing vs global providers.
