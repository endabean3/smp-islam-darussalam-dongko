# PRD — Selaras

| Field | Value |
|---|---|
| Status | Draft v0.2 |
| Owner | Product (Ionowu) |
| Reviewer | Pimpinan SMP Islam Darussalam Dongko & Yayasan PP Darussalam |
| Next review | Setelah asesmen awal (Tahap 0) selesai |
| Dokumen sumber | Deep Research Report (Ags 2026); Proposal Pengembangan v1.1 (Ags 2026) |

> Isi dokumen ini menggunakan data demo/anonymized; jangan simpan data produksi atau identitas siswa di repository.

---

## 1. Ringkasan Produk

**Selaras** adalah Sistem Informasi Sekolah berbasis **intervensi dini**, bukan aplikasi absensi dan bukan aplikasi tracking siswa.

Tesis produk:

> Sistem yang membuat sekolah mengetahui siapa yang berisiko sebelum terlambat, membuat orang tua mengetahui apa yang terjadi pada anaknya, dan mengubah data pendidikan menjadi tindakan.

Produk terdiri dari tiga lapisan yang dibangun berurutan:

```
SIS Core  →  Attendance & Early Warning  →  Safe Journey & Human Capital Analytics
```

### 1.1 Landasan bukti

Riset menunjukkan pola yang konsisten: teknologi pencatatan kehadiran (QR/NFC/RFID/GPS) berguna untuk menghasilkan **sinyal cepat dan akurat**, tetapi bukan intervensi yang terbukti menurunkan bolos. Bukti kausal yang kuat datang dari komunikasi personal ke orang tua, mentoring siswa berisiko, dan penanganan akar masalah ekonomi/keluarga.

| Sumber | Temuan yang dipakai sebagai dasar desain |
|---|---|
| Rogers & Feller (2018), RCT 28.080 siswa K–12 | Informasi personal berisi **angka konkret ketidakhadiran** menurunkan chronic absenteeism ~10%+ |
| Heppen et al. / IES (2020), ~26.000 siswa SD | SMS adaptif menurunkan chronic absence 2–7 poin persentase; kontak staf manusia lebih efektif untuk siswa risiko tinggi |
| NCRERN / Harvard CEPR, 47 distrik rural | Personalized messaging efektif dengan biaya ~US$4/siswa/tahun; **hambatan utama = data kontak orang tua yang tidak lengkap** |
| Guryan et al., Check & Connect | Mentoring terstruktur menurunkan absensi ~22,9% pada kelas 5–7 |
| Mo et al., rural China | Dropout 13,3% → 5,3% dengan bantuan ekonomi; bolos ≠ kenakalan |
| Yue et al., rural Shaanxi | Pelatihan pendamping dewasa menurunkan tardiness ~18% — teknologi harus memperkuat kapasitas manusia, bukan menggantikannya |

**Konsekuensi desain:** nilai produk bukan "kami punya RFID", melainkan "kami tahu siapa yang mulai berisiko, memberi tahu keluarga pada waktu yang tepat, mengidentifikasi penyebabnya, dan memastikan ada tindakan nyata dari sekolah."

### 1.2 Keputusan arsitektural utama

> **GPS tidak boleh menjadi sumber kebenaran kehadiran.** Kehadiran dibuktikan dengan QR dinamis/NFC + verifikasi guru. GPS hanya dipakai sebagai **Safe Journey**: sesi eksplisit, berdurasi terbatas, berbasis event, dengan consent.

### 1.3 Sekolah Pilot

| Identitas | Nilai |
|---|---|
| Satuan pendidikan | SMP Islam Darussalam Dongko |
| NPSN | 20574648 |
| Status | Swasta, jenjang SMP (Dikdas), akreditasi B |
| Naungan | Yayasan Pondok Pesantren Darussalam Dongko Trenggalek |
| Alamat | RT 01/RW 01, Desa Dongko, Kec. Dongko, Kab. Trenggalek 66363 |
| Berdiri | 16 April 2010 — SK PPD-SK/09/IV/2010 |
| Sarana | Luas tanah 1.035 m²; data referensi mencatat koneksi internet hingga 30 Mb, listrik PLN |

Sumber: Data Referensi Pendidikan Kemendikdasmen. **Jumlah siswa, guru, rombel, dan kondisi sarana wajib dikonfirmasi pada asesmen awal (Tahap 0)** — angka-angka operasional di dokumen ini menggunakan asumsi sampai data riil tersedia.

**Implikasi konteks pesantren terhadap desain produk:**

1. **Safe Journey berpotensi tidak relevan untuk sebagian besar siswa.** Jika mayoritas siswa mondok, perjalanan sekolah–rumah harian tidak terjadi. Konsekuensinya, Safe Journey turun prioritas dan diganti fokus pada *izin keluar pondok* + kepulangan berkala. **Ini harus dijawab di Tahap 0 sebelum satu baris kode Safe Journey ditulis.**
2. **Struktur otoritas berlapis.** Selain wali kelas dan BK, ada pengasuh/musyrif pondok yang secara de facto memegang tanggung jawab harian atas santri. Model peran wajib mengakomodasi ini.
3. **Pembinaan karakter adalah nilai inti lembaga, bukan fitur tambahan.** Modul Perilaku & Konseling perlu selaras dengan nilai pesantren, bukan sekadar impor PBIS mentah.
4. **Skala kecil.** SMP swasta desa umumnya jauh di bawah 500 siswa — ini memengaruhi unit economics (lihat §11.1).

### 1.4 Hubungan dengan Proposal v1.1

Proposal v1.1 sudah diajukan ke pimpinan sekolah dan yayasan. PRD ini adalah **turunan teknis** dari proposal tersebut, bukan penggantinya. Aturan yang dipakai:

- Apa pun yang dijanjikan di proposal **tidak boleh dihilangkan diam-diam** dari PRD. Jika suatu fitur diturunkan prioritasnya, alasannya harus tertulis di sini.
- Proposal berbicara pada level *visi dan komitmen*; PRD berbicara pada level *requirement dan urutan build*.
- Riset mendalam menambahkan basis bukti dan sejumlah **pengetatan** (terutama pada GPS, labeling siswa, dan klaim hukum) yang mengunci implementasi janji proposal.

| Janji proposal | Status di PRD ini |
|---|---|
| 6 modul inti (Portal Ortu, Akademik, Kehadiran, Perilaku & Konseling, Keselamatan, Manajemen Sekolah) | Dipertahankan; dipecah ke P0/P1/P2 (§5) |
| 6 modul AI | Dipertahankan sebagai **Tahap 3**, dengan pagar human-in-the-loop (§5.8) |
| PBIS 3 tingkat | Dipertahankan; dipetakan ke model 4-tier riset (§5.4) |
| Safe Journey + SOS + GPS kendaraan | Dipertahankan sebagai **Tahap 4**, bergantung hasil asesmen boarding (§1.3) |
| Profil Kesiapan SDM 5 dimensi | Dipertahankan; dipetakan ke 6 domain Human Capital Dashboard (§5.7) |
| Menu Keuangan (terlihat di mockup) | **Out of scope MVP** (§4.2) — mockup konseptual, bukan komitmen |

---

## 2. Masalah yang Diselesaikan

Produk pertama hanya menyelesaikan lima masalah berantai:

1. **Hadir / tidak hadir** — sekolah punya data kehadiran yang cepat dan akurat.
2. **Orang tua tahu** — keluarga menerima informasi personal di hari yang sama.
3. **Siswa berisiko terdeteksi** — perubahan pola terdeteksi sebelum menjadi dropout.
4. **Sekolah melakukan intervensi** — kasus masuk ke wali kelas/BK dengan follow-up terstruktur.
5. **Perjalanan pulang yang berisiko bisa diamankan** — tanpa surveillance permanen.

### 2.1 Pain point per aktor

| Aktor | Pain point saat ini |
|---|---|
| Orang tua | Tidak tahu anak hadir/tidak sampai rapor dibagikan; sering meremehkan total ketidakhadiran anak |
| Wali kelas | Rekap absensi manual, lambat, sulit melihat pola lintas minggu |
| BK | Kasus baru diketahui saat sudah parah; tidak ada catatan tindak lanjut terstruktur |
| Kepala sekolah | Tidak punya angka operasional harian untuk mengambil keputusan |
| Dinas / Bapperida | Tidak ada data berfrekuensi tinggi antara periode Rapor Pendidikan |
| Siswa | Perjalanan pulang jauh/berisiko tidak termonitor; risiko dilabeli "nakal" tanpa akar masalah dipahami |

---

## 3. Sasaran Pengguna & Persona

| Persona | Peran di sistem | Kebutuhan inti |
|---|---|---|
| **Orang tua / wali** | Penerima notifikasi + portal | Tahu status anak hari ini; bisa merespons; tidak dibanjiri pesan |
| **Siswa** | Subjek data + pengguna Safe Journey | Diperlakukan adil, tidak dilabeli, tahu kapan lokasinya diakses |
| **Wali kelas** | Pencatat + responder Tier-2 | Konfirmasi kehadiran cepat; daftar siswa berisiko yang actionable |
| **Guru BK / Safety Officer** | Case manager Tier-3/4 | Case management, riwayat intervensi, akar masalah |
| **Admin sekolah** | Operator | Master data, kelas, kalender, kontak wali |
| **Kepala sekolah** | Pengambil keputusan | Dashboard operasional sekolah |
| **Pengasuh / musyrif pondok** | Penanggung jawab harian santri | Status kehadiran & izin santri; koordinasi dengan wali kelas |
| **Pengurus yayasan** | Pemilik keputusan kelembagaan | Ringkasan kinerja sekolah; kepastian nilai & tata kelola data |
| **Dinas / Bapperida** | Konsumen analitik | Data agregat/de-identified tingkat kecamatan |

**Fokus jenjang pilot: SMP.** Alasan: perjalanan mandiri, izin keluar, dan bolos mandiri lebih relevan untuk menguji Safe Journey dibanding menjadikan siswa SD kelompok tracking utama.

**Catatan:** peran pengasuh pondok dan pengurus yayasan **belum tervalidasi** — keduanya diturunkan dari profil kelembagaan sekolah pilot, bukan dari wawancara. Wajib dikonfirmasi di Tahap 0.

---

## 4. Ruang Lingkup

### 4.1 In Scope (MVP)

```
SELARAS MVP
├── Student & Guardian Management
├── Attendance
│   ├── Dynamic QR (signed, rotating token)
│   ├── Manual teacher confirmation
│   └── NFC-ready adapter API
├── Parent Notification (masuk / terlambat / absen / pulang)
├── Early Warning
│   ├── attendance pattern detection
│   ├── intervention case
│   └── mentor / wali kelas assignment
├── Parent Portal (attendance, tugas, nilai, teacher feedback)
├── Safe Journey BETA (explicit start, temporary GPS, geofence, overdue alert, auto stop)
└── Human Capital Dashboard (attendance, learning, safety, parent engagement, intervention effectiveness)
```

### 4.2 Out of Scope (eksplisit, MVP–v1)

Pembayaran SPP, perpustakaan, inventaris, payroll, e-learning lengkap, CBT, marketplace, AI tutor, face recognition, CCTV analytics, GPS hardware buatan sendiri, dan menu administratif massal.

Alasan: memperbesar scope tanpa memperkuat tesis produk.

### 4.3 Non-Goals (permanen)

- Sistem **tidak** memberi skor karakter/"nakal" kepada siswa.
- Sistem **tidak** memakai GPS untuk membuktikan kehadiran.
- Sistem **tidak** menyediakan UI "lihat lokasi semua siswa" untuk peran apa pun.
- Sistem **tidak** memonetisasi data anak (iklan, profiling komersial, penjualan data).
- Sistem **tidak** membuat indikator tandingan Rapor Pendidikan.

---

## 5. Requirement Fungsional

Prioritas: **P0** = wajib MVP, **P1** = pilot, **P2** = pasca-pilot.

### 5.1 Identitas & Master Data

| ID | Requirement | Prioritas |
|---|---|---|
| F-ID-01 | CRUD siswa, kelas, rombel, guru, tahun ajaran, kalender akademik | P0 |
| F-ID-02 | Relasi `guardian ↔ student` dengan jenis relasi dan status verifikasi | P0 |
| F-ID-03 | Verifikasi ulang kontak wali terjadwal (minimal per triwulan) dengan laporan completeness | P0 |
| F-ID-04 | Import massal via CSV dengan validasi dan dry-run | P1 |
| F-ID-05 | Safeguarding flag pada relasi guardian (kasus hak asuh/kekerasan) yang membatasi akses | P0 |

> F-ID-03 adalah **KPI utama**, bukan fitur pendukung. Riset rural AS menunjukkan hambatan terbesar personalized messaging adalah kontak orang tua yang salah/tidak lengkap.

### 5.2 Attendance

| ID | Requirement | Prioritas |
|---|---|---|
| F-AT-01 | Attendance event API yang agnostik terhadap sumber (adapter QR / NFC / RFID / Manual) | P0 |
| F-AT-02 | Dynamic QR terminal: token rotating & signed, validasi sekolah + time window + status siswa | P0 |
| F-AT-03 | Konfirmasi guru di kelas (menangkap kasus "tap di gerbang tapi tidak masuk kelas") | P0 |
| F-AT-04 | Offline event queue di edge + eventual sync tanpa duplikasi | P0 |
| F-AT-05 | Pencatatan izin/sakit dengan bukti opsional dan approval | P1 |
| F-AT-06 | Izin keluar sekolah (early departure) dengan otorisasi | P1 |
| F-AT-07 | NFC/kartu pelajar sebagai sumber tap kedua tanpa perubahan core | P2 |

**Model data adalah event, bukan tabel `student_id | hadir | tanggal`:**

```
STUDENT_ENTERED_SCHOOL       PARENT_NOTIFIED
STUDENT_CONFIRMED_IN_CLASS   PARENT_ACKNOWLEDGED
STUDENT_LATE                 INTERVENTION_CREATED
STUDENT_LEFT_WITH_PERMISSION INTERVENTION_RESOLVED
STUDENT_LEFT_SCHOOL          SAFE_JOURNEY_STARTED
ABSENCE_UNEXPLAINED          SAFE_JOURNEY_DELAYED
                             SAFE_JOURNEY_ARRIVED
```

Event model memungkinkan menjawab: apakah anak tap di gerbang tetapi tidak masuk kelas? Apakah orang tua tahu? Berapa lama sekolah bereaksi? Apakah intervensi wali kelas benar-benar menurunkan ketidakhadiran berikutnya?

### 5.3 Notifikasi Orang Tua

| ID | Requirement | Prioritas |
|---|---|---|
| F-NT-01 | Notifikasi hari-sama untuk unexplained absence | P0 |
| F-NT-02 | Pesan memuat **angka konkret** ("anak Anda tidak hadir 6 hari dalam 30 hari terakhir"), bukan imbauan umum | P0 |
| F-NT-03 | Kanal FCM dengan fallback WhatsApp/SMS + pelacakan delivery status | P0 |
| F-NT-04 | Rate limiting & digest agar keluarga tidak dibanjiri pesan | P0 |
| F-NT-05 | Acknowledgement orang tua tercatat sebagai event | P1 |
| F-NT-06 | Ringkasan bulanan attendance untuk semua siswa (Tier universal) | P1 |

### 5.4 Early Warning & Case Management

| ID | Requirement | Prioritas |
|---|---|---|
| F-EW-01 | Deteksi perubahan pola (kenaikan terlambat/absen dalam jendela 30 hari) | P0 |
| F-EW-02 | Risk flag yang **menjelaskan observasi**, bukan karakter siswa | P0 |
| F-EW-03 | Eskalasi bertingkat: otomatis hanya Tier-1; Tier-2 ke atas wajib ke manusia | P0 |
| F-EW-04 | Case record: penugasan wali kelas/BK, SLA follow-up, catatan tindakan, status resolusi | P0 |
| F-EW-05 | Klasifikasi akar masalah wajib diisi saat case dibuka | P0 |
| F-EW-06 | Rencana intervensi + pengukuran attendance sesudahnya | P1 |
| F-EW-07 | Modul well-being/SEL ringan (tanpa skor yang menghukum atau melabeli permanen) | P2 |

Pilihan akar masalah (F-EW-05):

```
☐ Transportasi        ☐ Kesulitan belajar     ☐ Motivasi
☐ Pekerjaan keluarga  ☐ Bullying/tidak aman   ☐ Pergaulan
☐ Masalah ekonomi     ☐ Konflik keluarga      ☐ Belum diketahui
☐ Kesehatan
```

**Model intervensi bertingkat** — memetakan PBIS 3 tingkat (bahasa proposal, yang dipakai saat bicara dengan sekolah) ke 4 tier operasional (granularitas yang dipakai sistem):

| Tier sistem | PBIS (proposal) | Trigger | Respons sistem | Respons manusia |
|---|---|---|---|---|
| 1. Universal | Tingkat 1 | Semua siswa | Attendance, portal, ringkasan bulanan | Ekspektasi perilaku eksplisit, apresiasi, relasi sekolah–keluarga |
| 2. Early Warning | Tingkat 2 (awal) | Pola terlambat/absen naik | Notifikasi personal + risk flag | Wali kelas kontak keluarga, cari penyebab |
| 3. Targeted | Tingkat 2 (lanjut) | Absensi berulang / perubahan perilaku | Case management + intervention plan | Mentor/BK, target mingguan, parent meeting |
| 4. Intensive | Tingkat 3 | Risiko dropout, masalah ekonomi/safety | Cross-service case record, akses ketat | Rencana dukungan individual, koordinasi keluarga, rujukan |

Pemisahan Tier-2/Tier-3 dari "Tingkat 2" PBIS bersifat teknis: Tier-2 masih bisa diselesaikan satu wali kelas dengan satu panggilan telepon, Tier-3 memerlukan case record dengan SLA. Menggabungkannya membuat SLA follow-up tidak bisa diukur.

Alur penanganan tetap seperti proposal: **Sinyal → Tinjau → Dukung → Evaluasi**, dengan langkah "Tinjau" wajib dilakukan manusia.

### 5.5 Parent Portal

| ID | Requirement | Prioritas |
|---|---|---|
| F-PP-01 | Riwayat kehadiran anak sendiri | P0 |
| F-PP-02 | Nilai, tugas, dan feedback periodik guru (bukan hanya nilai akhir) | P1 |
| F-PP-03 | Kanal respons orang tua ke wali kelas | P1 |
| F-PP-04 | Aktivasi akun dan pengelolaan consent | P0 |

### 5.6 Safe Journey (BETA)

| ID | Requirement | Prioritas |
|---|---|---|
| F-SJ-01 | Sesi dimulai **eksplisit** pada event keluar sekolah; tidak ada tracking latar permanen | P0 |
| F-SJ-02 | Auto-stop saat masuk home geofence atau saat sesi berakhir | P0 |
| F-SJ-03 | Indikator visible pada perangkat siswa selama lokasi diakses | P0 |
| F-SJ-04 | Deteksi exception: delay, off-route, lost signal → alert bertingkat | P1 |
| F-SJ-05 | Geofence dievaluasi di device bila memungkinkan; server menerima event, bukan breadcrumb | P1 |
| F-SJ-06 | Retensi raw trajectory 24–72 jam, kecuali insiden yang sah dipertahankan | P0 |
| F-SJ-07 | Consent valid wajib sebelum sesi pertama; 100% sesi harus punya otorisasi | P0 |
| F-SJ-08 | "Signal unavailable" tidak boleh diinterpretasikan sebagai bolos atau bahaya otomatis | P0 |

State machine:

```
NOT_STARTED → STARTED → ACTIVE ─┬─→ ARRIVED → CLOSED
                                ├─→ DELAYED ──→ ESCALATED
                                └─→ LOST_SIGNAL ─┘
```

Analitik jangka panjang menyimpan `departure_at`, `arrival_at`, `duration`, `delay_flag`, `journey_exception` — **bukan** koordinat perjalanan lengkap.

Contoh payload yang diterima server:

```json
{
  "session_id": "...",
  "event": "HOME_GEOFENCE_ENTERED",
  "occurred_at": "...",
  "confidence": "high"
}
```

Catatan platform: Android membatasi background location dan meminta developer mengevaluasi apakah akses lokasi latar memang fungsi inti. Desain "session explicitly started" memenuhi batasan ini; silent 24-hour tracking tidak.

### 5.7 Human Capital Dashboard

Enam domain indikator:

| Domain | Indikator kuantitatif | Indikator kualitatif |
|---|---|---|
| Learning Capital | literasi, numerasi, growth asesmen, penyelesaian tugas | engagement, persepsi kualitas pembelajaran |
| Attendance & Persistence | attendance rate, hari absen, CA10 lokal, tardiness, dropout/transfer | penyebab absensi, motivasi |
| Safety & Well-being | insiden bullying, perjalanan terlambat, unresolved journey exception | rasa aman di sekolah/perjalanan |
| Teacher Capital | pelatihan, digital competency, response time case, kehadiran guru | confidence memakai data |
| Family Capital | contact completeness, delivery rate, aktivasi portal, kehadiran pertemuan | kualitas komunikasi sekolah–keluarga |
| Digital & Institutional | uptime, data completeness, SLA response, ketersediaan device/konektivitas | kesiapan perubahan, kualitas SOP |

**Posisi terhadap standar nasional:**

> Rapor Pendidikan = indikator outcome resmi.
> Selaras = high-frequency operational indicators + early-warning layer.

`CA10` (siswa kehilangan ≥10% hari belajar) didefinisikan untuk **analitik internal pilot**; tidak dipresentasikan sebagai definisi resmi Kemendikdasmen.

Pemetaan ke "Profil Perkembangan & Kesiapan Masa Depan" pada proposal:

| Dimensi proposal | Domain dashboard |
|---|---|
| Fondasi akademik | Learning Capital |
| Karakter & kebiasaan | Attendance & Persistence + Safety & Well-being |
| Keterampilan masa depan | Learning Capital (indikator proyek/literasi digital) |
| Kesejahteraan | Safety & Well-being |
| Minat & potensi lokal | Learning Capital (P2 — memerlukan instrumen terpisah) |

Batasan yang mengikat (sesuai janji proposal): profil ini adalah **alat refleksi dan perencanaan dukungan**, bukan ranking permanen, label kecerdasan, atau dasar diskriminasi. Data individu tidak dipakai untuk publikasi tingkat wilayah.

DEHCI (Dongko Education Human Capital Index) sebagai composite opsional untuk dashboard pimpinan — bobot awal Learning 30 / Attendance 20 / Safety 15 / Teacher 15 / Family 10 / Digital 10. Bobot ini **rancangan produk, bukan standar ilmiah**, dan harus diuji empiris setelah 2–3 tahun data. Indikator dasar wajib tetap terbuka untuk dianalisis terpisah.

---

### 5.8 Lapisan AI

Proposal memposisikan produk sebagai "Sistem Informasi Sekolah Terpadu Berbasis AI". Posisi PRD ini:

> **AI adalah lapisan di atas data yang sudah bersih — bukan fondasi produk.** Tanpa attendance akurat dan kontak wali valid, seluruh modul AI menghasilkan output yang meyakinkan tetapi salah. Karena itu AI berada di **Tahap 3**, sesudah Fondasi dan Kehadiran.

| ID | Modul (nama proposal) | Fungsi | Prioritas |
|---|---|---|---|
| F-AI-01 | **Early Warning** | Menggabungkan sinyal kehadiran, tugas tertunda, nilai melemah, pola kejadian → daftar tinjau guru | P1 |
| F-AI-02 | **Parent Digest** | Ringkasan mingguan yang mudah dipahami dari data akademik & aktivitas resmi | P1 |
| F-AI-03 | **AI Teacher Copilot** | Draf materi, variasi latihan, rubrik, rangkuman kelas, draf komunikasi ke orang tua | P2 |
| F-AI-04 | **Document Assistant** | Draf laporan, surat, notulen, SOP, materi | P2 |
| F-AI-05 | **Learning Support** | Rekomendasi latihan/materi penguatan per kompetensi | P2 |
| F-AI-06 | **School Intelligence** | Rangkuman tren kelas/sekolah, kualitas tindak lanjut, area perhatian pimpinan | P2 |

**Catatan implementasi F-AI-01.** Early Warning versi P1 **tidak perlu model machine learning**. Aturan deterministik berbasis ambang (mis. ≥3 absen tanpa keterangan dalam 30 hari) sudah cukup, dapat dijelaskan ke guru, dan tidak bisa bias secara diam-diam. Model prediktif baru dipertimbangkan setelah tersedia data longitudinal yang cukup untuk divalidasi — dan hanya jika terbukti mengungguli aturan sederhana.

#### Pagar wajib (non-negotiable)

| ID | Aturan |
|---|---|
| NF-AI-01 | Setiap output AI yang menyangkut siswa wajib menyertakan **alasan, data pendukung, tingkat keyakinan, dan tombol tinjau** |
| NF-AI-02 | Tidak ada keputusan disiplin, kelulusan, atau sanksi yang dihasilkan otomatis |
| NF-AI-03 | AI **dilarang** mendiagnosis kesehatan mental, memberi label karakter, atau membuat daftar hitam siswa |
| NF-AI-04 | Draf komunikasi ke orang tua wajib melalui persetujuan manusia sebelum terkirim |
| NF-AI-05 | Model diuji terhadap bias dan kesalahan; hasil dapat dikoreksi manusia dan koreksi tercatat |
| NF-AI-06 | Data siswa teridentifikasi tidak dikirim ke layanan AI pihak ketiga tanpa dasar pemrosesan yang sah dan DPA; utamakan de-identifikasi sebelum inferensi |
| NF-AI-07 | Setiap inferensi AI atas data siswa tercatat di audit log |

NF-AI-06 adalah requirement baru yang **tidak** ada di proposal maupun riset, tetapi wajib: modul AI berarti data anak berpotensi keluar dari infrastruktur sendiri. Ini harus masuk DPIA sebelum Tahap 3.

---

## 6. Requirement Non-Fungsional

### 6.1 Akses & Keamanan

RBAC saja tidak cukup — gunakan **relationship-based access control**:

```
Parent           → hanya anak yang tertaut
Teacher          → kelas yang ditugaskan; attendance + akademik;
                   TIDAK ada lokasi perjalanan presisi secara default
BK/Safety Officer→ case aktif yang ditugaskan; status journey exception;
                   lokasi presisi hanya bila kebijakan mengizinkan
School Admin     → operasi tingkat sekolah
Dinas/Bapperida  → analitik agregat / de-identified
Super Admin      → infrastruktur; tanpa kebutuhan rutin melihat lokasi anak
```

Break-glass access untuk darurat wajib memenuhi: alasan tertulis + emergency case ID + izin berbatas waktu + audit log immutable + notifikasi/review otomatis.

| ID | Requirement |
|---|---|
| NF-SEC-01 | Enkripsi at-rest dan in-transit; backup terenkripsi |
| NF-SEC-02 | Audit log immutable untuk akses lokasi, case, dan data sensitif |
| NF-SEC-03 | MFA untuk peran admin, BK, dan kepala sekolah |
| NF-SEC-04 | Least privilege; tidak ada endpoint bulk-location |

### 6.2 Privasi & Kepatuhan

- **UU 27/2022 (PDP)** — dasar utama pemrosesan data pribadi. **Data anak termasuk kategori "data pribadi yang bersifat spesifik"** (Pasal 4 ayat 2), sehingga seluruh data siswa dalam sistem ini berada di kategori perlindungan tertinggi sejak awal — bukan hanya data lokasi atau data kesehatan.
- **PP 17/2025** tentang Tata Kelola Penyelenggaraan Sistem Elektronik dalam Pelindungan Anak, beserta **Permen Komdigi 9/2026** sebagai aturan pelaksana. Applicability spesifik terhadap bentuk SIS ini **wajib ditelaah legal sebelum production rollout**.
- Benchmark internasional (COPPA AS, PIPL China) menempatkan lokasi presisi anak sebagai kategori yang memerlukan kontrol lebih kuat. Prinsipnya: *precise child location deserves stronger controls than ordinary school data.*

**Catatan akurasi klaim hukum.** Yang benar: *data anak* disebut eksplisit sebagai data pribadi spesifik di UU PDP. Yang **tidak** boleh diklaim: bahwa UU PDP secara eksplisit menyebut *geolocation* sebagai data pribadi spesifik — geolocation tidak ada dalam daftar Pasal 4 ayat 2. Dalam sistem ini, jejak GPS tetap masuk kategori tertinggi karena melekat pada data anak, bukan karena sifat geolocation-nya sendiri. Perbedaan ini penting agar dokumen legal dan kebijakan privasi tidak mengutip dasar hukum yang keliru.

**Konsekuensi praktis** dari status data pribadi spesifik: pemrosesan memerlukan persetujuan eksplisit orang tua/wali, dan **Data Protection Impact Assessment (DPIA) wajib dilakukan sebelum implementasi produksi** — sebagaimana juga sudah dicantumkan sebagai deliverable di proposal.

Prinsip operasional: **need to know > nice to know.**

Dinas menerima:
```
Dongko — Attendance rate: 94.1% | High-risk students: 38
Journey exceptions: 12 | Cases resolved <48h: 91%
```
Dinas **tidak** menerima koordinat individual siswa.

### 6.3 Ketersediaan & Konteks Rural

| ID | Requirement |
|---|---|
| NF-OPS-01 | Offline-first pada terminal attendance; sinkronisasi eventual |
| NF-OPS-02 | Sistem tetap berfungsi tanpa smartphone siswa (QR/NFC/manual) — smartphone tidak boleh diwajibkan |
| NF-OPS-03 | Hemat kuota: payload event, bukan streaming lokasi |
| NF-OPS-04 | Export CSV/JSON dan open API untuk mencegah vendor lock-in |
| NF-OPS-05 | Target uptime jam sekolah ≥99%; degradasi anggun saat internet putus |

### 6.4 Stack Teknis

```
Parent / Student app : React Native
Teacher app          : React Native atau responsive web
Admin dashboard      : React / Next.js
Backend API          : NestJS / Fastify
Database             : PostgreSQL + PostGIS
Cache / queue        : Redis
Notifications        : FCM + WhatsApp/SMS fallback
Storage              : S3-compatible object storage
Reverse proxy        : Caddy / Nginx
Observability        : metrics + logs + alerting
```

Astro **tidak** dipakai sebagai framework aplikasi utama (cocok hanya untuk landing page). SIS adalah aplikasi transaksional dengan auth, background jobs, realtime event, RBAC, dan analitik. PostGIS tersedia untuk operasi geofence/rute tertentu — bukan berarti semua koordinat disimpan.

---

## 7. Pilihan Teknologi Kehadiran

Estimasi biaya adalah **model perencanaan 2026, bukan quotation vendor**.

| Teknologi | Estimasi | Akurasi sebagai bukti hadir | Privasi | Posisi |
|---|---:|---|---|---|
| QR statis | Sangat rendah | Rendah–sedang | Rendah | Jangan dipakai sendiri |
| **QR dinamis signed** | ±Rp0,5–2 jt/titik | Sedang | Rendah | **MVP** |
| **NFC / HF RFID card** | ±Rp2–7 jt/titik + kartu | Sedang–tinggi | Sedang | **Fase kedua** |
| UHF RFID gate | ±Rp8–25 jt/gate | Sedang | Sedang–tinggi | Tidak perlu untuk pilot |
| GPS smartphone 24/7 | OPEX tinggi | Buruk | Sangat tinggi | **Tidak direkomendasikan** |
| **GPS berbasis sesi** | Rendah–sedang | Tidak dipakai sebagai bukti | Terkendali | **Safe Journey** |
| Dedicated GPS tracker | ±Rp0,4–1,5 jt/device | Tidak membuktikan hadir | Sangat tinggi | Kebutuhan khusus |
| GPS kendaraan sekolah | ±Rp1–3 jt/kendaraan | Tinggi (posisi kendaraan) | Lebih rendah | Fase lanjutan |

Alasan GPS bukan source of truth: sistem hanya mengetahui **lokasi perangkat**, bukan identitas fisik siswa; kualitas koordinat bervariasi menurut lingkungan dan sinyal, sehingga satu koordinat tidak boleh ditafsirkan sebagai fakta absolut.

---

## 8. Metrik Keberhasilan

Pilot **tidak** dinilai dari "aplikasinya berhasil online".

### 8.1 KPI Pilot

| Kategori | Target |
|---|---|
| Data quality | ≥95% kontak guardian valid; ≥98% attendance event tersinkronisasi |
| Operational | ≥90% notifikasi unexplained absence terkirim hari yang sama (naik menuju ≥95%) |
| Human response | ≥85% kasus high-risk mendapat follow-up manusia dalam 2 hari sekolah |
| Adoption | ≥60% guardian aktif dalam 90 hari pertama |
| Safety | 100% sesi Safe Journey punya consent valid; false alert diukur sejak hari pertama |
| Outcome | Perubahan attendance vs baseline; perbandingan antar sekolah setelah jumlah cukup |

### 8.2 Target 2030 (proposal desain, bukan angka pemerintah)

| Indikator | Baseline | Target 2030 |
|---|---|---:|
| Data siswa & guardian valid | ukur 2026 | ≥98% |
| Guardian menerima alert absensi hari yang sama | ukur 2026 | ≥95% |
| Kasus high-risk follow-up ≤2 hari sekolah | ukur 2026 | ≥90% |
| Chronic absence lokal | baseline 2026 | turun ≥30% relatif |
| Unexplained late arrival/departure | baseline 2026 | turun ≥30% |
| Safe Journey dengan consent valid | — | 100% |
| False safety alert | baseline pilot | <3–5% |
| Orang tua aktif minimal bulanan | baseline | ≥75% |
| Guru memenuhi kompetensi dasar data/digital | baseline | ≥90% |
| Satuan pilot memakai data dalam rapat evaluasi bulanan | baseline | 100% |

Semua target di atas **wajib dikalibrasi ulang setelah baseline 2026 tersedia**.

---

## 9. Roadmap

Karena sekarang Agustus 2026, **2025 diperlakukan sebagai baseline retrospektif**, bukan tahun implementasi.

| Periode | Fokus | Skala |
|---|---|---|
| 2025 (retrospektif) | Rekonstruksi data historis attendance/learning | — |
| 2026 H2 | Governance, discovery, UX, MVP, privacy design | 1 sekolah persiapan |
| 2027 | Pilot operasional + Safe Journey terbatas | 3–5 sekolah |
| 2028 | Attendance network, NFC opsional, analytics | ±10–15 sekolah |
| 2029 | Scale kecamatan + API/reporting, integrasi kebijakan | ±25–35 sekolah |
| 2030 | Hardening, evaluasi independen, paket replikasi | sekolah eligible |

Urutan ini selaras dengan *Rencana Induk & Peta Jalan Pemajuan IPTEK Kabupaten Trenggalek 2025–2029*: data-driven baseline → penguatan layanan → inovasi sosial-teknologi → integrasi kebijakan → evaluasi & replikasi.

Konteks skala: BPS mencatat 41 SD di Kecamatan Dongko (TA 2024/2025, ±4.044 murid) — rollout serentak satu kecamatan bukan proyek kecil dan tidak boleh dimulai bersamaan.

Idealnya rollout 2027–2028 dibuat bertahap agar evaluasi dapat memakai **stepped-wedge / phased comparison**, sehingga pilot menghasilkan bukti lokal: *"Apakah SIS + personalized parent intervention benar-benar mengurangi absenteeism di pedesaan Jawa Timur?"*

---

## 10. Risiko Utama

| Risiko | Level | Mitigasi |
|---|---|---|
| Tracking berubah menjadi surveillance 24/7 | **Critical** | GPS session-only, auto-stop, visible indicator, consent |
| Orang tidak berwenang melihat lokasi | **Critical** | Relationship-based access, MFA, audit log, break-glass |
| Akun orang tua jatuh ke pelaku kekerasan/stalking | **Critical** | Safeguarding exception, verifikasi akun, emergency restriction |
| Data breach | **Critical** | Enkripsi, least privilege, backup terenkripsi, security monitoring |
| GPS false alert | High | Grace period, radius geofence, konfirmasi multi-sinyal |
| HP siswa mati / no signal | High | Status "signal unavailable"; jangan dianggap bolos |
| Siswa tidak punya smartphone | High (equity) | Alternatif NFC/QR; smartphone tidak diwajibkan |
| Nomor orang tua salah | High | Verifikasi kontak triwulanan sebagai KPI |
| Guru dibanjiri alert | High | Risk scoring + tiered escalation |
| Algoritma melabeli "anak nakal" | High | Risk flag menjelaskan observasi, bukan karakter |
| Data dipakai untuk ranking/punishment | High | Policy purpose limitation |
| Titip kartu / QR | Medium | Dynamic token, anomaly detection, konfirmasi guru |
| Server/internet down | High | Offline event queue + eventual sync |
| Vendor lock-in | Medium | Open API, export CSV/JSON, skema terdokumentasi |
| Ketergantungan founder tunggal | High | Dokumentasi, CI/CD, SOP support, operator lokal |

**Perhatian khusus — parental misuse:** "orang tua" tidak otomatis berhak melihat koordinat presisi tanpa mempertimbangkan konteks keselamatan anak (hak asuh, KDRT, restraining order). Sistem memerlukan **safeguarding workflow**, bukan sekadar tabel `parent_id → child_id`.

---

## 11. Model Bisnis (hipotesis)

Bentuk: **productized SaaS multi-tenant**, bukan jasa custom per sekolah.

Sekolah pilot **bukan target revenue**. Ia adalah *design partner* dan *reference customer* — sumber bukti yang dipakai untuk menjual ke sekolah berikutnya. Monetisasi dimulai dari sekolah ke-2 dan seterusnya.

### 11.1 Dua mode komersial

| Mode | Untuk siapa | Harga | Yang kita dapat |
|---|---|---:|---|
| **Reference Partner** | Sekolah pilot (dan maks. 2 sekolah early adopter) | **Rp0 untuk tahun pertama**, atau biaya hardware saja | Akses data untuk evaluasi, hak publikasi studi kasus, testimoni tertulis, surat rekomendasi, izin site visit calon pelanggan |
| **Komersial** | Sekolah ke-3 dan seterusnya | Lihat §11.2 | Revenue |

Reference Partner **harus dituangkan dalam perjanjian tertulis**, bukan kesepakatan lisan. Tanpa hak publikasi studi kasus dan izin site visit, pilot gratis kehilangan seluruh nilai komersialnya dan hanya menjadi kerja tanpa bayaran.

Batas waktu: status Reference Partner berlaku **12 bulan**, setelah itu sekolah masuk skema komersial dengan diskon loyalitas (mis. 40–50% seumur langganan). Tanpa batas waktu, pilot gratis menjadi beban support permanen.

### 11.2 Struktur harga komersial

Pelajaran dari §11.3: **harga per-siswa murni tidak viable untuk sekolah kecil**, dan mayoritas sekolah swasta di wilayah seperti Dongko adalah sekolah kecil. Karena itu struktur utamanya adalah **paket tahunan berbasis rentang jumlah siswa**, bukan tarif per kepala.

| Paket | Jumlah siswa | Harga tahunan (hipotesis) | Isi |
|---|---|---:|---|
| **Rintisan** | < 150 | **Rp6–9 jt** | SIS Core + Portal Ortu + Kehadiran + Early Warning |
| **Dasar** | 150–400 | **Rp12–18 jt** | Rintisan + Perilaku & Konseling + Manajemen Sekolah |
| **Menengah** | 400–800 | **Rp22–32 jt** | Dasar + AI Parent Digest + AI Teacher Copilot |
| **Besar** | > 800 | **Rp3.500–5.000/siswa/bulan** | Seluruh modul + SLA prioritas |

Add-on terpisah:

| Add-on | Model |
|---|---:|
| Setup & onboarding | Rp3–8 jt sekali (dapat digratiskan sebagai insentif kontrak tahunan) |
| Terminal QR tambahan | Biaya hardware + margin |
| NFC deployment | Hardware + kartu + setup + maintenance |
| Safe Journey | Rp8–15 ribu/siswa aktif/bulan — **hanya bila terbukti relevan** (§1.3, Q8) |
| GPS kendaraan sekolah | Per kendaraan/bulan |
| District analytics (Dinas) | Rp100–300 jt/tahun, tergantung jumlah sekolah & cakupan support |
| Custom integration | Proyek terpisah |

Seluruh angka adalah **pricing hypothesis** yang wajib diuji dalam discovery, bukan harga pasar hasil survei.

### 11.3 Mengapa struktur paket, bukan per-siswa

Contoh hitungan di riset memakai asumsi 500 siswa. SMP swasta desa umumnya jauh di bawah itu. Pada 120 siswa dengan tarif Rp5.000/siswa/bulan:

```
120 × Rp5.000 × 12  =  Rp7.200.000 / tahun
```

Di bawah biaya support tahunan satu sekolah, apalagi menutup development. Paket Rintisan menaruh lantai harga di titik yang setidaknya menutup biaya layanan, sementara paket Besar tetap menangkap nilai dari sekolah besar lewat tarif per-siswa.

### 11.4 Jalur penjualan yang paling murah

Urutan ini menentukan seberapa cepat produk mencapai titik impas:

1. **Jaringan yayasan.** Yayasan pesantren umumnya menaungi lebih dari satu satuan pendidikan (RA/MI/SMP/MA). Satu keputusan pimpinan yayasan dapat membuka beberapa sekolah sekaligus. **Ini kanal termurah dan harus jadi prioritas pertama** — tawarkan *paket yayasan* (harga bundel multi-unit dengan satu kontrak dan satu onboarding).
2. **Rujukan antar kepala sekolah** dalam satu kecamatan, dibuka oleh studi kasus dari Reference Partner.
3. **Kelompok kerja kepala sekolah / MKKS** sebagai forum demonstrasi kolektif.
4. **Dinas Pendidikan** — nilainya besar tetapi siklus penjualannya paling panjang; kejar setelah ada bukti multi-sekolah, bukan sebelumnya.

Konsekuensi produk: **multi-tenancy dan onboarding mandiri adalah requirement komersial, bukan kemewahan teknis.** Jika menambah sekolah baru memerlukan kerja manual berhari-hari dari founder, model bisnis ini tidak dapat diskalakan berapa pun harganya.

### 11.5 Batasan etis pada monetisasi

- Basic student safety (alert masuk/pulang, absence alert) **tetap di semua paket termasuk Rintisan**, tidak pernah di balik paywall.
- Safe Journey premium memerlukan skema subsidi sekolah/desa agar keselamatan tidak hanya tersedia untuk keluarga mampu.
- **Tidak pernah** memonetisasi data anak lewat iklan, profiling komersial, atau penjualan data.
- Data satu sekolah tidak pernah dipakai untuk kepentingan sekolah lain, termasuk dalam bentuk benchmark, tanpa persetujuan tertulis.

---

## 12. Asumsi & Open Questions

**Asumsi:**
1. Sekolah pilot adalah SMP Islam Darussalam Dongko; data referensi mencatat koneksi internet hingga 30 Mb dan listrik PLN — **kualitas dan stabilitas riil belum diverifikasi**.
2. Sebagian besar wali memiliki setidaknya satu nomor WhatsApp aktif di rumah tangga.
3. Sekolah bersedia menyediakan 1 PIC operasional dan wali kelas yang merespons case.
4. Baseline attendance 2025 dapat direkonstruksi dari arsip manual sekolah.
5. Yayasan dan pimpinan sekolah menyetujui konsep sebelum Tahap 1 dimulai.

**Open questions (perlu discovery):**

| # | Pertanyaan | Berpengaruh pada |
|---|---|---|
| Q1 | Berapa % wali dengan smartphone vs feature phone? | Pilihan kanal notifikasi & bobot SMS fallback |
| Q2 | Siapa pengendali data — sekolah atau Dinas? | Model consent, DPA, dan tanggung jawab hukum |
| Q3 | Apakah ada antar-jemput/kendaraan sekolah? | Prioritas GPS kendaraan vs GPS individu |
| Q4 | Apakah Permen Komdigi 9/2026 mewajibkan kategori tertentu untuk SIS? | Timeline legal review sebelum production |
| Q5 | Berapa kapasitas riil BK per sekolah? | Ambang batas eskalasi Tier-3 |
| Q6 | Format data Rapor Pendidikan mana yang dapat diakses sekolah pilot? | Desain Learning Capital domain |
| Q7 | Bagaimana sikap komite sekolah & orang tua terhadap Safe Journey? | Go/no-go Safe Journey di pilot pertama |
| **Q8** | **Berapa proporsi siswa mondok vs pulang-pergi harian?** | **Penentu apakah Safe Journey masuk pilot sama sekali** |
| Q9 | Berapa jumlah riil siswa, guru, dan rombel? | Unit economics (§11.1) dan sizing infrastruktur |
| Q10 | Bagaimana pembagian kewenangan sekolah vs pondok vs yayasan atas data santri? | Model peran, consent, dan penetapan pengendali data |
| Q11 | Bagaimana bentuk pencatatan perilaku & pembinaan yang berlaku sekarang? | Desain modul Perilaku agar selaras nilai pesantren, bukan impor PBIS mentah |
| Q12 | Apakah tersedia anggaran sekolah/yayasan, atau pilot perlu disubsidi penuh? | Model komersial dan komitmen sumber daya |

**Q8 adalah pertanyaan paling menentukan.** Jika mayoritas siswa mondok, Safe Journey — salah satu dari tiga pilar yang dijual di proposal — kehilangan basis kebutuhannya, dan pilar keselamatan harus dirumuskan ulang sebagai *izin keluar pondok + kepulangan berkala*. Jangan membangun Safe Journey sebelum Q8 terjawab.

---

## 13. Dokumen Turunan yang Dijanjikan

Proposal v1.1 mencantumkan deliverable dokumen berikut setelah kesepakatan konsep. PRD ini memenuhi sebagian; sisanya menjadi backlog dokumentasi:

| Dokumen | Status |
|---|---|
| Functional Design Requirements (FDR) / SRS | Belum — turunan dari §5 PRD ini |
| Arsitektur sistem & desain keamanan | Sebagian di §6.1/§6.4 — perlu dokumen tersendiri |
| Kebijakan privasi | Belum |
| **Data Protection Impact Assessment (DPIA)** | Belum — **wajib sebelum produksi** (§6.2) |
| Rencana implementasi, UAT, SLA, backup & recovery | Belum |
| Roadmap pengembangan | Ada di §9 |

---

## 14. Dokumen Terkait

- [Discovery Brief](/docs/01-discovery/discovery-brief.md)
- [Baseline Measurement Plan](/docs/01-discovery/baseline-measurement-plan.md)
- [Scope and Priorities](/docs/02-product/scope-and-priorities.md)
- [Success Metrics](/docs/02-product/success-metrics.md)
- [Solution Architecture](/docs/05-architecture/solution-architecture.md)
- [Data Classification](/docs/06-data/data-classification.md)
- [Retention and Deletion Schedule](/docs/06-data/retention-and-deletion-schedule.md)
- [Pilot Evaluation Plan](/docs/12-evaluation/pilot-evaluation-plan.md)
