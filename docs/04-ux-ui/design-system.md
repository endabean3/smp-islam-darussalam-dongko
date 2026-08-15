# Design System

| Field | Value |
|---|---|
| Status | Draft v0.1 |
| Owner | Product / Frontend (Ionowu) |
| Reviewer | To be assigned |
| Next review | Setelah UI shell pertama berjalan |
| Dokumen sumber | [PRD](/docs/02-product/prd.md); Proposal Pengembangan v1.1 |

> Isi dokumen ini menggunakan data demo/anonymized; jangan simpan data produksi atau identitas siswa di repository.

---

## 1. Keputusan Utama

Dua library diadopsi, **dengan pembagian wilayah yang tegas**:

| Library | Lisensi | Dipakai di | TIDAK dipakai di |
|---|---|---|---|
| **shadcn/ui** (Radix + Tailwind) | MIT | Seluruh permukaan aplikasi: dashboard sekolah, portal orang tua, app guru, admin | — |
| **react-bits** | MIT + Commons Clause | Situs marketing/landing produk saja | Seluruh permukaan aplikasi |

> **Aturan satu kalimat:** shadcn/ui membangun produk; react-bits menjual produk.

### 1.1 Mengapa dipisah

Alasannya bukan selera, melainkan konteks pemakaian yang tertulis di PRD:

| Constraint PRD | Konsekuensi UI |
|---|---|
| NF-OPS-02 — sistem harus jalan tanpa smartphone kelas atas | Target perangkat = Android low-end, RAM 2–3 GB |
| NF-OPS-03 — hemat kuota | Bundle JS harus kecil; tidak ada aset dekoratif berat |
| Konektivitas rural Dongko | Halaman harus berguna di jaringan lambat/putus-putus |
| Guru dengan confidence digital rendah (domain Teacher Capital) | Antarmuka harus dapat ditebak, bukan mengejutkan |
| Permukaan utama = tabel absensi, case management, dashboard | Kepadatan data tinggi, bukan storytelling visual |

react-bits adalah koleksi 165+ komponen animasi (text animation, background, UI animation) yang secara eksplisit ditujukan untuk *"memorable websites"* — kategori marketing. Sebagian komponennya memakai WebGL/canvas dan animasi berkelanjutan. Pada dashboard absensi yang dibuka guru 30 kali sehari di HP murah, itu **membakar baterai dan kuota tanpa menambah kejelasan informasi**.

Sebaliknya, react-bits punya rumah yang jelas dan bernilai: **situs penjualan produk**. PRD §11.4 menetapkan jalur pertumbuhan lewat jaringan yayasan dan rujukan antar kepala sekolah — landing page yang meyakinkan adalah aset komersial nyata di jalur itu.

### 1.2 Peringatan lisensi react-bits

react-bits berlisensi **MIT + Commons Clause**, bukan MIT murni. Commons Clause melarang *menjual* perangkat lunak yang nilainya secara substansial berasal dari library tersebut.

| Penggunaan | Status |
|---|---|
| Animasi di landing page produk yang kita jual | **Aman** — nilai produk berasal dari SIS, bukan dari animasinya |
| Komponen dekoratif dalam aplikasi SaaS berbayar | Aman dengan alasan yang sama, tetapi tidak kita lakukan (§1) |
| Menjual kembali komponennya, atau produk yang intinya adalah komponen UI | **Dilarang** |

Karena Selaras adalah produk komersial (PRD §11), catatan ini masuk ke daftar tinjau lisensi sebelum rilis publik. shadcn/ui tidak punya masalah ini — MIT, dan kodenya menjadi milik kita begitu di-*copy* ke repo.

---

## 2. Arsitektur Frontend

```
packages/ui-components/          ← design system bersama (satu-satunya sumber kebenaran)
├── tokens/                      ← CSS variables: warna, spasi, tipografi
├── primitives/                  ← komponen shadcn/ui yang sudah di-copy & disesuaikan
├── patterns/                    ← komposisi khas domain (lihat §6)
└── icons/

apps/school-web/                 ← dashboard sekolah, guru, BK, admin   → shadcn/ui
apps/parent-web-or-pwa/          ← portal orang tua (PWA)               → shadcn/ui
apps/mobile/                     ← React Native                         → lihat §2.1
apps/marketing/  (belum ada)     ← landing page penjualan               → shadcn/ui + react-bits
```

**Satu design system, bukan tiga.** Token dan pattern didefinisikan sekali di `packages/ui-components` dan dikonsumsi semua app. Ini bukan kemewahan arsitektur — PRD §11.4 mensyaratkan onboarding sekolah baru berjalan cepat, dan itu mustahil kalau tiga app punya bahasa visual yang berbeda-beda.

### 2.1 Catatan React Native

shadcn/ui adalah web (Radix + Tailwind DOM) dan **tidak berjalan di React Native**. Untuk `apps/mobile`, yang dibagikan adalah **token, bukan komponen**:

- Token warna/spasi/tipografi diekspor sebagai objek TS netral-platform.
- Komponen RN dibangun terpisah (NativeWind atau StyleSheet) mengonsumsi token yang sama.
- Jangan mencoba memaksa shadcn/ui masuk RN.

Konsekuensi praktis: **prioritaskan PWA lebih dulu**. PRD menargetkan orang tua dengan HP low-end dan kuota terbatas — PWA menghindari unduhan APK 30 MB dan update lewat Play Store, dua hambatan nyata di konteks rural. React Native dikerjakan saat fitur yang benar-benar butuh native (NFC, background location Safe Journey, notifikasi kuat) masuk roadmap Tahap 4.

---

## 3. Design Tokens

Diturunkan dari identitas visual Proposal v1.1 (navy + biru aksen) agar dokumen penawaran dan produk terlihat satu keluarga.

### 3.1 Warna brand

```css
:root {
  /* Brand */
  --brand-navy-900: #0F2440;   /* header, sidebar */
  --brand-navy-700: #1B3A5C;
  --brand-blue-600: #2563EB;   /* aksi utama */
  --brand-blue-500: #3B82F6;
  --brand-blue-50:  #EFF6FF;   /* latar terpilih */

  /* Netral */
  --neutral-900: #111827;      /* teks utama */
  --neutral-600: #4B5563;      /* teks sekunder */
  --neutral-300: #D1D5DB;      /* border */
  --neutral-100: #F3F4F6;      /* latar sekunder */
  --neutral-0:   #FFFFFF;
}
```

### 3.2 Warna status kehadiran

Ini token paling sensitif di produk. Dipakai di tabel absensi, kartu siswa, dan dashboard.

Setiap status punya **tiga** nilai, karena warna dasar dan warna teks tidak boleh sama:

| State | Fill/border (≥3:1) | Teks (≥4.5:1) | Latar badge |
|---|---|---|---|
| Hadir | `--status-present` `#16A34A` — 3.30:1 | `--status-present-text` `#15803D` — 5.02:1 | `#F0FDF4` |
| Terlambat | `--status-late` `#D97706` — 3.19:1 | `--status-late-text` `#B45309` — 5.02:1 | `#FFFBEB` |
| Izin / sakit | `--status-excused` `#0891B2` — 3.68:1 | `--status-excused-text` `#0E7490` — 5.36:1 | `#ECFEFF` |
| Alpa | `--status-unexplained` `#DC2626` — 4.83:1 | `--status-unexplained-text` `#B91C1C` — 6.47:1 | `#FEF2F2` |
| Belum tercatat | `--status-unknown` `#9CA3AF` — 2.54:1 | `--status-unknown-text` `#4B5563` — 7.56:1 | `#F3F4F6` |

Rasio diukur terhadap latar putih dengan rumus WCAG 2.1. **Empat dari lima warna dasar gagal ambang 4.5:1 untuk teks** — hijau 3.30, amber 3.19, sian 3.68, abu 2.54 (yang bahkan gagal ambang 3:1 untuk elemen UI). Karena itu warna dasar hanya boleh dipakai sebagai fill, titik, dan border; label teks wajib memakai varian `-text`. Memakai warna dasar sebagai warna teks adalah bug aksesibilitas, bukan pilihan selera.

Dua keputusan yang mengikat:

1. **"Belum tercatat" tidak boleh berwarna merah.** PRD F-SJ-08 dan risk register menyatakan ketiadaan sinyal bukan bukti bolos. Mewarnainya merah membuat guru mengambil kesimpulan yang sistemnya sendiri larang.
2. **Izin dan alpa harus beda warna dan beda ikon.** Menyatukannya menghapus perbedaan yang justru menjadi inti model intervensi (§5.4 PRD).

### 3.3 Warna tingkat intervensi

Proposal memakai hijau/amber/merah untuk Tingkat 1/2/3. Dipertahankan **untuk dashboard staf saja**.

```css
--tier-1: #16A34A;   /* Universal   */
--tier-2: #D97706;   /* Early Warning / Targeted */
--tier-3: #DC2626;   /* Intensive   */
```

> **Aturan:** warna tier **tidak pernah muncul di portal orang tua atau app siswa.** Anak yang melihat dirinya berlabel merah adalah persis efek stigma yang dilarang PRD (*risk flag menjelaskan observasi, bukan karakter*). Di permukaan keluarga, sampaikan fakta dan langkah — "3 hari tidak hadir bulan ini, wali kelas akan menghubungi" — bukan kode warna penghakiman.

### 3.4 Tipografi

```css
--font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI",
             Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, "SF Mono", Menlo, monospace;  /* NIS, token, ID */
```

**Font sistem, bukan webfont.** Menghindari unduhan 100–300 KB per kunjungan pertama dan menghilangkan FOIT/FOUT di jaringan lambat. Di Android, ini menghasilkan Roboto — tidak istimewa, tetapi terbaca dan gratis. Webfont hanya dipertimbangkan untuk situs marketing, bukan aplikasi.

Skala (mobile-first, minimum 16 px untuk teks isi agar iOS tidak auto-zoom pada input):

| Token | Ukuran | Pemakaian |
|---|---|---|
| `--text-xs` | 12px | Label tabel, metadata |
| `--text-sm` | 14px | Teks sekunder |
| `--text-base` | 16px | Teks isi — **default** |
| `--text-lg` | 18px | Judul kartu |
| `--text-xl` | 20px | Judul halaman |
| `--text-2xl` | 24px | Angka statistik |

### 3.5 Spasi & radius

Skala 4px: `4 / 8 / 12 / 16 / 24 / 32 / 48`. Radius: `--radius-sm: 4px`, `--radius-md: 8px`, `--radius-lg: 12px`.

**Target sentuh minimum 44×44 px** untuk seluruh kontrol interaktif — guru menandai kehadiran sambil berdiri di depan kelas, bukan duduk dengan mouse.

---

## 4. Komponen shadcn/ui yang Diadopsi

Diambil sesuai kebutuhan, bukan diinstal seluruhnya.

### Gelombang 1 — MVP

```bash
npx shadcn@latest add button input label select checkbox \
  card table badge avatar dialog sheet form \
  toast alert skeleton tabs dropdown-menu separator
```

| Komponen | Dipakai untuk (referensi PRD) |
|---|---|
| `table` + `badge` | Tabel absensi harian, status kehadiran (F-AT-03) |
| `form` + `input` + `select` | Master data siswa/wali (F-ID-01), klasifikasi akar masalah (F-EW-05) |
| `dialog` / `sheet` | Konfirmasi kehadiran, detail kasus — `sheet` untuk mobile |
| `card` | Kartu siswa, ringkasan dashboard |
| `toast` | Konfirmasi simpan, status sinkronisasi offline (F-AT-04) |
| `alert` | Banner status koneksi, peringatan data belum tersinkron |
| `skeleton` | Loading state di jaringan lambat — wajib, bukan opsional |
| `tabs` | Navigasi seksi di detail siswa |

### Gelombang 2 — Pilot

`command` (pencarian siswa cepat), `popover`, `calendar` + `date-picker` (rentang laporan), `data-table` (sorting/filter/paginasi), `progress`, `accordion`.

### Tidak diadopsi

`carousel`, `chart` (evaluasi terpisah saat dashboard analitik dibangun), `resizable`, `context-menu` (tidak ada klik kanan di mobile).

### 4.1 Aturan pemakaian

1. **Jangan mengirim shadcn/ui dalam kondisi default.** Token §3 harus dipasang lebih dulu; kalau tidak, produk terlihat seperti setiap template shadcn di internet.
2. **Komponen di-copy ke `packages/ui-components/primitives`**, bukan ke masing-masing app.
3. **Jangan menambal aksesibilitas Radix.** Kalau perlu mengubah perilaku fokus atau ARIA, kemungkinan besar komponennya salah pilih.
4. **Satu sistem.** Tidak mencampur Material UI, Ant Design, atau Chakra ke dalam pohon yang sama.

---

## 5. Anggaran Performa

Bukan aspirasi — ini gerbang rilis. Diukur pada **Android mid/low-end, jaringan 3G ter-throttle**.

| Metrik | Batas | Alasan |
|---|---|---|
| JS awal (gzip, app shell) | **≤ 150 KB** | Kuota dan CPU perangkat murah |
| LCP | **≤ 2.5 s** | Guru menandai absensi di sela mengajar |
| CSS (gzip) | ≤ 30 KB | Tailwind purge menjaga ini |
| Webfont | **0 byte** | §3.4 |
| WebGL/canvas di permukaan aplikasi | **Dilarang** | Baterai + GPU perangkat low-end |
| Animasi berkelanjutan (infinite loop) | **Dilarang** di aplikasi | Membakar baterai tanpa nilai informasi |

Praktik wajib: code-splitting per rute, `content-visibility` untuk tabel panjang, virtualisasi daftar >100 baris, dan **skeleton di setiap permukaan yang menunggu jaringan**.

Aplikasi harus tetap berguna saat jaringan putus — PRD NF-OPS-01 mensyaratkan antrean event offline, jadi UI wajib punya bahasa visual eksplisit untuk *tersimpan lokal / menunggu sinkronisasi / tersinkron*.

---

## 6. Pattern Khas Domain

Komposisi yang dibangun di atas primitif shadcn/ui dan menjadi milik produk ini:

| Pattern | Fungsi |
|---|---|
| `<AttendanceStatusBadge>` | Status kehadiran — warna + **ikon + teks** (§7) |
| `<StudentCard>` | Identitas siswa; **tidak pernah menampilkan skor karakter** |
| `<AttendanceGrid>` | Grid siswa × hari; target sentuh besar, dapat dipakai sambil berdiri |
| `<CaseTimeline>` | Riwayat intervensi: sinyal → tinjau → dukung → evaluasi |
| `<RootCauseSelector>` | 10 pilihan akar masalah (F-EW-05) |
| `<SyncStatusBanner>` | Status antrean offline |
| `<ConsentGate>` | Blokir fitur sampai consent valid — dipakai Safe Journey (F-SJ-07) |
| `<AIDisclosure>` | Pembungkus wajib setiap output AI: alasan, data pendukung, tingkat keyakinan, tombol tinjau (NF-AI-01) |

`<AIDisclosure>` adalah pattern yang menegakkan janji proposal di level kode. Kalau setiap output AI harus melewati komponen ini, mustahil ada saran AI yang tampil polos tanpa penjelasan — pagar kebijakan menjadi pagar teknis.

---

## 7. Aksesibilitas

Detail lengkap di [accessibility-requirements.md](/docs/04-ux-ui/accessibility-requirements.md). Yang mengikat design system:

1. **Warna tidak pernah menjadi satu-satunya pembawa makna** (WCAG 1.4.1). Setiap status kehadiran wajib punya **ikon + label teks**, bukan hanya warna. Ini bukan formalitas: proporsi buta warna merah-hijau pada laki-laki sekitar 8%, dan status hadir/alpa kita justru hijau vs merah.
2. Kontras teks minimum **4.5:1**; komponen UI dan batas input **3:1**.
3. Seluruh alur dapat diselesaikan dengan keyboard; fokus selalu terlihat.
4. Bahasa Indonesia sebagai `lang="id"`.
5. Hormati `prefers-reduced-motion` — di aplikasi, animasi memang sudah minimal.

---

## 8. react-bits: Aturan Main

Berlaku **hanya** di `apps/marketing`.

**Boleh:** animasi teks pada hero, transisi masuk saat scroll, latar gradien halus di section hero, efek hover pada kartu fitur.

**Tidak boleh:**
- Latar WebGL/three.js berat — calon pembeli membuka landing page dari HP juga.
- Animasi yang menunda pembacaan proposisi nilai. Kepala sekolah harus paham produk ini dalam 5 detik.
- Komponen apa pun yang menampilkan **data siswa nyata**, termasuk tangkapan layar dashboard tanpa label **DATA DEMO** (mengikuti disiplin yang sudah dipakai Proposal v1.1).
- Menyalin komponen react-bits ke `packages/ui-components`. Simpan di `apps/marketing` agar batas antara produk dan materi penjualan tidak kabur.

Anggaran performa landing page lebih longgar dari aplikasi, tetapi tetap ada: **LCP ≤ 3 s di 3G**, dan halaman harus terbaca penuh tanpa JavaScript aktif untuk bagian proposisi nilai dan kontak.

---

## 9. Yang Sengaja Dihindari

| Anti-pattern | Alasan |
|---|---|
| Dark mode di MVP | Menggandakan permukaan uji tanpa permintaan pengguna; token sudah siap kalau nanti dibutuhkan |
| Gradien ungu ala AI, glassmorphism generik | Tampilan template; sekolah dan yayasan menilai kredibilitas, bukan tren |
| Skor/ranking siswa dalam bentuk visual apa pun | Dilarang PRD §4.3 |
| Grafik animasi di dashboard | Menambah beban, mengurangi keterbacaan angka |
| Ikon tanpa label teks di navigasi utama | Guru dengan confidence digital rendah menebak-nebak arti ikon |
| Infinite scroll pada daftar siswa | Paginasi lebih dapat diprediksi dan lebih ramah jaringan lambat |

---

## 10. Dokumen Terkait

- [PRD](/docs/02-product/prd.md)
- [Accessibility Requirements](/docs/04-ux-ui/accessibility-requirements.md)
- [Information Architecture](/docs/04-ux-ui/information-architecture.md)
- [Interaction Specifications](/docs/04-ux-ui/interaction-specifications.md)
- [Content and Language Guidelines](/docs/04-ux-ui/content-and-language-guidelines.md)
- [Coding Standards](/docs/08-engineering/coding-standards.md)
