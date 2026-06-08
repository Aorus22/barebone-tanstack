# Funnel Flow — Knowledge Base Index

## Ringkasan Proyek

`funnel-flow` adalah proyek frontend berbasis TanStack Start + React + TypeScript + shadcn/ui.
Struktur proyek mengikuti pola arsitektur dari `kime-warehouse` dengan layout route groups, backend service skeleton, dan reusable components.

## Daftar Dokumen

- [01-PROJECT-OVERVIEW.md](./01-PROJECT-OVERVIEW.md) — gambaran proyek, stack, struktur direktori, dan script utama.
- [02-ROUTE-MAP.md](./02-ROUTE-MAP.md) — peta route yang aktif, layout groups, dan pola route file.
- [03-ARCHITECTURE-BE.md](./03-ARCHITECTURE-BE.md) — status backend saat ini dan batasan integrasi.
- [04-ARCHITECTURE-FE.md](./04-ARCHITECTURE-FE.md) — arsitektur frontend, router, styling, komponen, hooks, dan utilities.
- [05-DATABASE-SCHEMA.md](./05-DATABASE-SCHEMA.md) — status persistence dan catatan saat belum ada database aplikasi.
- [06-RBAC-PERMISSIONS.md](./06-RBAC-PERMISSIONS.md) — status otorisasi saat ini dan rencana titik masuk jika fitur auth ditambahkan.
- [07-SSE-JOBS.md](./07-SSE-JOBS.md) — status real-time job/SSE saat ini.
- [08-CODE-PATTERNS.md](./08-CODE-PATTERNS.md) — pola coding, alias import, dan reusable component.
- [09-FLOW-DIAGRAMS.md](./09-FLOW-DIAGRAMS.md) — alur render/routing yang aktif sekarang.
- [10-ADR.md](./10-ADR.md) — keputusan arsitektur yang sudah terlihat dari codebase.
- [11-RUNBOOK-TROUBLESHOOTING.md](./11-RUNBOOK-TROUBLESHOOTING.md) — setup lokal dan masalah umum.
- [12-PRODUCTION-SCALING-GUIDE.md](./12-PRODUCTION-SCALING-GUIDE.md) — catatan kesiapan produksi dan area yang belum dibangun.

## Quick Reference

### Entry Point Utama

- `src/router.tsx` — instance router TanStack dengan default pending/error components + NProgress.
- `src/routes/__root.tsx` — shell dokumen HTML dengan ThemeProvider, ConfirmModalProvider, Toaster.
- `src/routes/index.tsx` — halaman `/` saat ini.

### Layout Groups

- `(app)/` — authenticated app layout (masih shell minimal, siap untuk AppShell/Sidebar/Topbar)
- `(auth)/` — auth layout (login/logout halaman)
- `(landing)/` — public landing page

### Komponen Reusable

- `src/components/ui/*` — library komponen UI berbasis shadcn/radix-nova (56+ files)
- `src/components/global/data-table.tsx` — wrapper tabel generik `@tanstack/react-table`
- `src/components/global/confirm-modal-provider.tsx` — imperative confirm dialog via `confirmModal()`
- `src/components/ui/date-picker.tsx` — date picker dengan popover calendar
- `src/lib/client/toast.ts` — `appToast.success/error/info` wrapper untuk sonner
- `src/lib/client/confirm-modal.ts` — imperative API untuk confirm modal
- `src/lib/utils.ts` — helper `cn(...)`
- `src/utils/client-utils/date.ts` — format tanggal Asia/Jakarta
- `src/utils/client-utils/format.ts` — format currency/number IDR
- `src/hooks/use-mobile.ts` — helper responsif `useIsMobile()`

### Path Aliases

- `@/components` → `src/components`
- `@/components/ui` → `src/components/ui`
- `@/lib` → `src/lib`
- `@/hooks` → `src/hooks`
- `@/utils` → `src/utils`
- `@/backend` → `src/backend`

### Status Arsitektur Saat Ini

- Routing dengan layout groups sudah aktif
- Default pending/error components sudah terpasang di router
- NProgress loading bar aktif
- Dark/light theme via next-themes aktif
- Confirm modal system aktif
- Backend service skeleton (`src/backend/`) sudah siap diisi
- Prisma dan Kysely sudah dipilih sebagai arah data layer, tetapi belum diinstal/diimplementasikan

Dokumen dengan topik backend/database tetap disediakan agar struktur knowledge base konsisten sejak awal, tetapi kontennya mencerminkan status proyek yang masih frontend-first.
