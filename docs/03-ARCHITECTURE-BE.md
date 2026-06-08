# Backend Architecture — Funnel Flow

## Status Saat Ini

Saat ini `funnel-flow` belum memiliki backend aplikasi yang spesifik di repo ini.

Yang sudah ada:

- runtime frontend berbasis TanStack Start,
- route shell dan page rendering di sisi aplikasi React.

Yang belum ada:

- service layer backend,
- repository/database access layer,
- server functions/domain actions,
- auth/session management khusus aplikasi,
- file storage integration,
- queue/job processor.

## Arah Data Layer yang Direncanakan

Saat backend mulai dibangun, proyek ini direncanakan memakai pembagian tanggung jawab berikut:

### Prisma

Peran utama:

- mendefinisikan schema database
- menjalankan migration
- menghasilkan Prisma Client
- menjadi sumber kebenaran struktur tabel, relasi, dan enum

Prisma tidak direncanakan menjadi lapisan utama untuk semua query runtime yang kompleks.

### Kysely

Peran utama:

- menjalankan query runtime di aplikasi
- membangun query yang lebih eksplisit dan composable
- menangani list/filter/sort/pagination dengan kontrol SQL yang lebih jelas
- menjadi abstraction utama untuk repository/query layer

### Boundary yang Diinginkan

- Prisma dipakai untuk DDL dan lifecycle schema
- Kysely dipakai untuk DML dan query aplikasi sehari-hari
- service layer tidak langsung bercampur antara schema concern dan query concern

## Struktur Backend yang Disarankan Saat Mulai Implementasi

Contoh bentuk awal:

```txt
prisma/
  schema.prisma
src/
  server/
    db/
      prisma.ts
      kysely.ts
    modules/
      <feature>/
        repository/
        service/
        server-fn/
```

## Kontrak Integrasi yang Disarankan

- `prisma.ts` hanya mengelola singleton Prisma Client
- `kysely.ts` hanya mengelola instance Kysely + dialect
- repository lebih memilih Kysely untuk query bisnis
- migration dijalankan hanya lewat Prisma
- perubahan schema selalu dimulai dari `schema.prisma`, bukan SQL manual acak

## Implikasi untuk Pengembangan

- Semua dokumentasi backend di proyek ini masih bersifat placeholder dan boundary note.
- Jika nanti backend mulai ditambahkan, dokumen ini harus menjadi lokasi utama untuk menjelaskan:
  - layer service,
  - pattern akses data,
  - integrasi auth,
  - transaction boundary,
  - background processing.

## Rekomendasi Saat Backend Mulai Dibangun

- pisahkan route rendering dan mutasi data,
- definisikan boundary domain lebih awal,
- dokumentasikan kontrak request/response sejak fitur pertama,
- tambahkan bagian baru di dokumen ini per milestone backend,
- jaga disiplin boundary Prisma untuk migration/schema dan Kysely untuk query runtime.
