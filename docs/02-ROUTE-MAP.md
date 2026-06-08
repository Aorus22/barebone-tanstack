# Route Map — Funnel Flow

## Ringkasan

Routing menggunakan TanStack file-based routing. Route tree ter-generate ke `src/routeTree.gen.ts`, sementara konfigurasi router ada di `src/router.tsx`.

## Layout Groups

### `(app)` — App Layout

File: `src/routes/(app)/route.tsx`

Peran:
- layout untuk halaman yang membutuhkan sidebar/topbar/shell aplikasi
- saat ini masih shell minimal (`<Outlet />` dalam container flex)
- siap diintegrasikan dengan AppShell, Sidebar, Topbar dari kime-warehouse

### `(auth)` — Auth Layout

Direktori: `src/routes/(auth)/`

Peran:
- layout untuk halaman login/logout
- belum ada route aktif, direktori sudah siap

### `(landing)` — Landing Layout

Direktori: `src/routes/(landing)/`

Peran:
- layout untuk halaman publik/landing
- belum ada route aktif, direktori sudah siap

## Route Aktif

### `/`

File: `src/routes/index.tsx`

Peran:
- halaman starter/default
- menampilkan teks onboarding sederhana
- memverifikasi bahwa stack routing + UI berjalan

## Root Shell

File: `src/routes/__root.tsx`

Peran:
- menyusun dokumen HTML global
- mendaftarkan stylesheet dari `src/styles.css`
- ThemeProvider (next-themes) untuk dark/light mode
- ConfirmModalProvider untuk imperative confirm dialog
- Toaster (sonner) untuk notifikasi
- TanStack Devtools (conditional via env)
- fallback 404 sederhana

## Router Configuration

File: `src/router.tsx`

- `scrollRestoration: true`
- `defaultPreload: "intent"`
- `defaultPreloadStaleTime: 0`
- `defaultPendingComponent` — spinner loading
- `defaultErrorComponent` — error page dengan tombol reload
- NProgress loading bar (onBeforeLoad → start, onResolved → done)

## Pola Route

- `createRootRoute(...)` untuk shell/root
- `createFileRoute("/(group)")` untuk layout group
- `createFileRoute("...")` untuk halaman
- router instance dibuat di `src/router.tsx`
- route tree diambil dari `routeTree.gen.ts`

## Catatan Pengembangan

Saat menambah route baru:

1. Tambahkan file route di `src/routes` yang sesuai dengan layout group-nya.
2. Gunakan alias `@/` untuk import komponen/utilitas.
3. Simpan logic view di file route jika masih kecil.
4. Jika halaman mulai kompleks, pecah ke komponen domain di `src/components` atau folder feature baru.

## Area yang Belum Ada

- dashboard/business pages
- route loader / server data integration
- error boundary khusus per route
- auth protection di `(app)` beforeLoad
