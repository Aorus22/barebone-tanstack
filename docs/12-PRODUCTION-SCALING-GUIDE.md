# Production & Scaling Guide — Funnel Flow

## Status Saat Ini

`funnel-flow` belum berada pada tahap produksi penuh.
Dokumen ini berfungsi sebagai checklist kesiapan, bukan panduan deploy final.

## Fondasi yang Sudah Ada

- build pipeline frontend melalui Vite
- route shell yang jelas
- token styling dan shared UI layer
- reusable component awal (`DataTable`)

## Area yang Masih Perlu Dibangun Sebelum Produksi

- environment management yang jelas
- observability/logging
- authentication dan authorization
- data layer/backend integration
- error boundary dan fallback UX yang lebih matang
- test coverage yang relevan
- CI/CD deployment policy

## Checklist Saat Produk Mulai Masuk Tahap Nyata

- tetapkan target runtime/deployment
- definisikan source data dan kontrak API
- audit dependency yang benar-benar dipakai
- pastikan route structure mengikuti domain, bukan starter page
- tambahkan docs backend/database bila sistem persistence mulai aktif
