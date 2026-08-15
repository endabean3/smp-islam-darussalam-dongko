# Workspace and Tooling

| Field | Value |
|---|---|
| Status | Beta baseline v0.1 |
| Owner | Engineering |
| Review trigger | Sebelum implementasi modul attendance |

## Keputusan

Workspace memakai pnpm dan Turborepo. Dua aplikasi Next.js menyediakan permukaan
staf dan orang tua. Satu NestJS/Fastify API menjadi deployment unit modular
monolith. Folder `services/*` adalah batas domain di dalam aplikasi tersebut,
bukan microservice yang dideploy sendiri.

## Toolchain

| Kebutuhan | Tool | Alasan |
|---|---|---|
| Package/workspace | pnpm | Instalasi deterministik dan hemat disk |
| Task graph | Turborepo | Build, test, dan typecheck lintas package |
| Web/PWA | Next.js + React | Responsive web dan route splitting |
| API | NestJS + Fastify | Modul domain eksplisit dengan HTTP adapter ringan |
| Styling | Tailwind CSS v4 | Token-first dan bundle CSS kecil |
| UI primitives | shadcn/ui, bertahap | Komponen dimiliki workspace; jangan dipasang massal |
| Schema | Zod | Validasi environment dan boundary API |
| Format/lint | Biome | Satu tool cepat untuk workspace TypeScript |
| Unit/integration | Vitest | Runner TypeScript cepat |
| Browser/UAT | Playwright | Desktop dan Android viewport |

## Aturan beta

1. Data beta hanya demo/anonymized. `DEMO_DATA_ONLY=true` menjadi guard awal API.
2. Parent surface tetap PWA sampai kebutuhan native Tahap 4 disetujui.
3. Safe Journey tidak masuk scaffold beta sebelum keputusan discovery Q8.
4. Modul baru masuk ke `services/<domain>` dan diekspor ke `apps/api`; jangan
   membuat deployment service baru tanpa ADR.
5. Komponen UI domain masuk ke `packages/ui-components`; app hanya menyusun layar.

## Perintah

```bash
pnpm dev
pnpm check
pnpm test:e2e
pnpm build
```

`pnpm check` wajib lulus sebelum perubahan digabungkan. E2E ditambahkan per
acceptance criteria, dimulai dari alur konfirmasi kehadiran kelas.
