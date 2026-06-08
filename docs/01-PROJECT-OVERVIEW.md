# Project Overview — Funnel Flow

## Tujuan Aplikasi

`funnel-flow` adalah proyek frontend berbasis React yang mengadopsi pola arsitektur dari `kime-warehouse`.
Codebase sudah siap untuk:

- routing file-based dengan TanStack Router + layout groups (`(app)`, `(auth)`, `(landing)`)
- styling dengan Tailwind CSS v4 + shadcn/ui
- default pending/error components + NProgress loading bar
- dark/light theme via next-themes
- imperative confirm modal system
- reusable DataTable, DatePicker, utility formatting
- backend service skeleton (`src/backend/`) untuk pengembangan ke depan

## Tech Stack (Aktual)

- React 19
- TypeScript
- Vite 8
- TanStack Start
- TanStack Router
- Tailwind CSS v4
- shadcn/ui (`style: radix-nova`)
- `lucide-react`
- `@tanstack/react-table`
- `next-themes`
- `sonner`
- `nprogress`

## Data Stack (Direncanakan)

Untuk layer persistence ke depan, proyek ini akan memakai kombinasi:

- Prisma untuk schema, migration, dan client generation
- Kysely untuk query runtime yang lebih eksplisit dan fleksibel

Status saat ini:
- belum ada package `prisma` / `@prisma/client` / `kysely`
- belum ada folder `prisma/` atau file schema database

## Struktur Direktori Utama

```
src/
  backend/                # service skeleton (siap diisi)
  components/
    global/
      data-table.tsx
      confirm-modal-provider.tsx
    ui/                   # shadcn primitives (56+ files)
  hooks/
    use-mobile.ts
  lib/
    client/
      confirm-modal.ts
      toast.ts
    server/               # server utilities (siap diisi)
    shared/               # shared libs (siap diisi)
    utils.ts
  router/                 # module-config skeleton
  routes/
    __root.tsx
    (app)/route.tsx       # app layout group
    (auth)/               # auth layout group (siap diisi)
    (landing)/            # landing layout group (siap diisi)
    api/                  # API routes (siap diisi)
    index.tsx
  ui/custom/icon/         # custom icon patterns
  utils/
    client-utils/
      date.ts
      format.ts
    server-utils/         # server utils (siap diisi)
  router.tsx
  routeTree.gen.ts
  styles.css
docs/
  ...
```

## Scripts NPM

- `npm run dev` — menjalankan dev server pada port `3000`
- `npm run build` — build produksi
- `npm run preview` — preview hasil build
- `npm run test` — menjalankan Vitest
- `npm run lint` — menjalankan ESLint
- `npm run format` — menjalankan Prettier write
- `npm run check` — memeriksa formatting
- `npm run typecheck` — TypeScript type-check tanpa emit

## Styling & Design Tokens

- CSS utama berada di `src/styles.css`
- Tailwind diimport langsung via `@import "tailwindcss"`
- shadcn theme layer aktif via `@import "shadcn/tailwind.css"`
- font default menggunakan `@fontsource-variable/inter`
- CSS variable tema terang/gelap sudah tersedia dan bisa dipakai ulang oleh komponen baru

## Konfigurasi TypeScript

- alias `@/*` diarahkan ke `src/*`
- `moduleResolution` menggunakan `bundler`
- `strict` aktif
- `noEmit` aktif

## Konfigurasi shadcn

`components.json` saat ini memakai:
- style: `radix-nova`
- css: `src/styles.css`
- baseColor: `neutral`
- cssVariables: `true`
- iconLibrary: `lucide`

## Status Implementasi

- Routing dasar + layout groups aktif
- Default pending/error components + NProgress aktif
- Theme provider (dark/light) aktif
- Confirm modal system aktif
- Toast system (sonner + appToast) aktif
- DataTable, DatePicker, date/format utilities tersedia
- Backend service skeleton sudah siap
- Halaman bisnis/domain belum mulai dibangun
