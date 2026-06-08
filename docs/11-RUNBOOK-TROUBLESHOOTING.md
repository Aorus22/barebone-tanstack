# Developer Runbook & Troubleshooting — Funnel Flow

## 1. Setup Lokal

### Prasyarat

- Node.js modern
- npm

### Instalasi

```bash
npm install
```

### Jalankan Dev Server

```bash
npm run dev
```

Default port:

- `3000`

## 2. Quality Checks

### TypeScript

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

### Build

```bash
npm run build
```

## 3. Troubleshooting Umum

### Kasus 0: Prisma/Kysely Belum Tersedia

Saat ini dokumentasi sudah mengasumsikan arah arsitektur Prisma + Kysely, tetapi package dan setup-nya belum ada di repo.

Jadi jika Anda melihat referensi ke Prisma/Kysely di docs:

- itu adalah keputusan arsitektur yang direncanakan,
- bukan indikator bahwa data layer tersebut sudah aktif.

### Kasus A: Alias `@/` Tidak Ter-resolve

Periksa:

- `tsconfig.json` memiliki path `@/* -> ./src/*`
- import memakai ekstensi/pattern yang kompatibel dengan bundler mode

### Kasus B: Style Tidak Muncul

Periksa:

- `src/styles.css` masih direferensikan oleh `src/routes/__root.tsx`
- import `tailwindcss`, `tw-animate-css`, dan `shadcn/tailwind.css` tidak terhapus

### Kasus C: Route Baru Tidak Terbaca

Periksa:

- file route berada di `src/routes`
- route menggunakan `createFileRoute(...)`
- proses dev server/regenerasi route tree berjalan normal

### Kasus D: Komponen Tabel Tidak Berjalan Sesuai Ekspektasi

Periksa:

- kolom menggunakan `ColumnDef` dari `@tanstack/react-table`
- data selalu berupa array atau fallback aman
- mode manual (`manualPagination`, `manualSorting`) diberi callback yang sesuai

### Kasus E: Typecheck Gagal pada Komponen UI Bawaan

Jika error muncul di komponen template bawaan, pisahkan dulu:

- apakah error berasal dari kode baru yang Anda tambahkan,
- atau dari starter/template dependency yang memang belum sepenuhnya sinkron.

Dokumentasikan temuan itu sebelum memperbaiki agar perubahan tetap terukur.
