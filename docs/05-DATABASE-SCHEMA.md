# Database Schema — Funnel Flow

## Status Saat Ini

Belum ada skema database aplikasi yang didefinisikan di repo `funnel-flow`.

Yang belum ditemukan di codebase saat ini:

- ORM setup
- migration files
- query layer
- model/domain entity persistence
- environment database connection

## Tooling Database yang Direncanakan

### Prisma sebagai Source of Truth Schema

Saat persistence mulai ditambahkan, `schema.prisma` akan menjadi sumber utama untuk:

- definisi model tabel
- relasi
- enum
- migration history

Direktori yang diharapkan:

```txt
prisma/
  schema.prisma
  migrations/
```

### Kysely sebagai Query Layer

Kysely direncanakan dipakai untuk:

- query list dengan filter dinamis
- pagination
- sorting multi-kolom
- query join/reporting yang lebih eksplisit

Artinya, dokumentasi tabel di sini nantinya perlu berguna untuk dua hal sekaligus:

- konsistensi schema Prisma
- akurasi kolom/relasi untuk query Kysely

## Implikasi

- Tidak ada tabel runtime yang perlu didokumentasikan saat ini.
- Dokumen ini dipertahankan untuk menjaga struktur docs konsisten ketika fase persistence dimulai.

## Saat Database Mulai Ditambahkan

Dokumen ini perlu diisi minimal dengan:

- daftar tabel utama,
- relasi kunci,
- enum penting,
- aturan naming,
- contoh pola query atau akses data.

## Konvensi yang Disarankan

- nama tabel gunakan bentuk plural yang konsisten
- foreign key diberi nama eksplisit dan stabil
- semua perubahan schema dilakukan lewat migration Prisma
- query runtime yang kompleks ditulis di repository berbasis Kysely
- hindari duplikasi definisi struktur tabel di banyak tempat dokumentasi
