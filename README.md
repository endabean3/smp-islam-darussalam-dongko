# Selaras

Workspace beta Selaras, sistem informasi sekolah untuk intervensi dini. Implementasi mengikuti
arsitektur modular monolith, Parent PWA, dan design system di folder `docs/`.

## Mulai lokal

Prasyarat: Node.js 24+ dan pnpm 11+.

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Layanan awal:

- School Web: `http://localhost:3000`
- Parent PWA: `http://localhost:3001`
- API health check: `http://localhost:4000/api/v1/health`

Semua data lokal wajib berupa data demo/anonymized. Jangan memasukkan identitas
siswa atau kredensial produksi ke repository.

## Struktur

```text
apps/       aplikasi yang dapat dijalankan atau di-deploy
packages/   kontrak, model, validasi, observability, dan UI bersama
services/   modul domain di dalam modular monolith
tests/      contract, integration, E2E, performance, dan security
infra/      konfigurasi deployment; bukan tempat menyimpan secret
scripts/    automasi operasional yang aman dan dapat diulang
docs/       sumber keputusan produk, UX, arsitektur, keamanan, dan operasi
```

Lihat [Workspace Guide](docs/08-engineering/workspace-and-tooling.md) untuk
aturan dependency dan perintah lengkap.
