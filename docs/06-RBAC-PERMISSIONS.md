# RBAC & Permissions — Funnel Flow

## Status Saat Ini

Belum ada sistem autentikasi atau otorisasi domain-spesifik di codebase `funnel-flow`.

Belum ditemukan:

- user session model aplikasi,
- permission map,
- role matrix,
- route guard berbasis auth,
- backend authorization enforcement.

## Kondisi Sekarang

- semua route yang ada saat ini bersifat publik,
- shell root hanya menangani rendering aplikasi dan devtools,
- belum ada boundary akses pengguna.

## Rekomendasi Saat Auth Ditambahkan

- dokumentasikan perbedaan authentication vs authorization,
- tetapkan satu sumber kebenaran role/permission,
- definisikan guard di level route dan enforcement di level data/backend,
- tambahkan tabel/claim yang relevan ke dokumen database.
