"use client";

import { AttendanceStatusBadge, SyncStatusBanner } from "@selaras/ui-components/patterns";
import type { AttendanceStatus } from "@selaras/ui-components/tokens";
import { useMemo, useState } from "react";
import { BarcodeSessionView } from "./BarcodeSessionView";
import { DeviceOperationsView } from "./DeviceOperationsView";

type View = "attendance" | "barcode" | "devices" | "cases" | "guide";

type Student = {
  id: string;
  name: string;
  monthlyNote: string;
  status: AttendanceStatus;
};

type CaseState = "Perlu kontak" | "Menunggu keluarga" | "Selesai";

type DemoCase = {
  id: string;
  student: string;
  observation: string;
  owner: string;
  due: string;
  state: CaseState;
};

const initialStudents: Student[] = [
  { id: "8A-01", name: "Alya Rahma", monthlyNote: "3 hari tidak hadir", status: "unexplained" },
  { id: "8A-02", name: "Bagas Pratama", monthlyNote: "Hadir penuh", status: "present" },
  { id: "8A-03", name: "Citra Lestari", monthlyNote: "1 kali terlambat", status: "present" },
  { id: "8A-04", name: "Dimas Setiawan", monthlyNote: "Belum ada pola", status: "unknown" },
  { id: "8A-05", name: "Farah Nabila", monthlyNote: "2 kali izin", status: "excused" },
  { id: "8A-06", name: "Galang Saputra", monthlyNote: "Hadir penuh", status: "present" },
  { id: "8A-07", name: "Hana Maulida", monthlyNote: "1 kali terlambat", status: "late" },
  { id: "8A-08", name: "Ilham Ramadhan", monthlyNote: "Hadir penuh", status: "present" },
  { id: "8A-09", name: "Kayla Maharani", monthlyNote: "Hadir penuh", status: "present" },
  { id: "8A-10", name: "Luthfi Akbar", monthlyNote: "1 hari izin", status: "present" },
  { id: "8A-11", name: "Mira Safitri", monthlyNote: "Hadir penuh", status: "present" },
  { id: "8A-12", name: "Rafi Kurniawan", monthlyNote: "Hadir penuh", status: "present" },
];

const initialCases: [DemoCase, ...DemoCase[]] = [
  {
    id: "CASE-104",
    student: "Alya Rahma",
    observation:
      "Tidak hadir 3 hari dalam 30 hari. Dua kejadian belum memiliki keterangan keluarga.",
    owner: "Wali kelas 8A",
    due: "Hari ini, 14.00",
    state: "Perlu kontak",
  },
  {
    id: "CASE-099",
    student: "Hana Maulida",
    observation: "Terlambat meningkat dari 0 menjadi 3 kejadian dalam 30 hari.",
    owner: "Wali kelas 8A",
    due: "Besok, 10.00",
    state: "Menunggu keluarga",
  },
];

const statusOptions: Array<{ value: AttendanceStatus; label: string }> = [
  { value: "present", label: "Hadir" },
  { value: "late", label: "Terlambat" },
  { value: "excused", label: "Izin" },
  { value: "unexplained", label: "Alpa" },
];

const familyAppUrl = process.env.NEXT_PUBLIC_FAMILY_APP_URL ?? "http://localhost:3001";

export function DashboardDemoClient() {
  const [activeView, setActiveView] = useState<View>("attendance");
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [cases, setCases] = useState<DemoCase[]>(initialCases);
  const [editingId, setEditingId] = useState<string | null>("8A-04");
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [savedMessage, setSavedMessage] = useState("Belum ada perubahan yang disimpan.");
  const [selectedCaseId, setSelectedCaseId] = useState(initialCases[0].id);

  const counts = useMemo(
    () =>
      students.reduce(
        (result, student) => {
          result[student.status] = (result[student.status] ?? 0) + 1;
          return result;
        },
        { present: 0, late: 0, excused: 0, unexplained: 0, unknown: 0 },
      ),
    [students],
  );

  const selectedCase = cases.find((item) => item.id === selectedCaseId) ?? initialCases[0];
  const recordedCount = students.length - counts.unknown;

  function updateStatus(id: string, status: AttendanceStatus) {
    setStudents((current) =>
      current.map((student) => (student.id === id ? { ...student, status } : student)),
    );
    setEditingId(null);
    setSavedMessage("Perubahan belum disimpan.");
  }

  function saveAttendance() {
    if (isOnline) {
      setPendingCount(0);
      setSavedMessage("Kehadiran kelas tersimpan dan siap ditinjau.");
      return;
    }

    setPendingCount(1);
    setSavedMessage("Tersimpan di perangkat. Data akan dikirim saat koneksi kembali.");
  }

  function toggleConnection() {
    setIsOnline((current) => {
      const next = !current;
      if (next && pendingCount > 0) {
        setPendingCount(0);
        setSavedMessage("Koneksi kembali. Catatan yang tertunda sudah tersinkron.");
      }
      return next;
    });
  }

  function contactFamily() {
    setCases((current) =>
      current.map((item) =>
        item.id === selectedCase.id ? { ...item, state: "Menunggu keluarga" } : item,
      ),
    );
  }

  function resolveCase() {
    setCases((current) =>
      current.map((item) => (item.id === selectedCase.id ? { ...item, state: "Selesai" } : item)),
    );
  }

  function resetDemo() {
    setStudents(initialStudents);
    setCases(initialCases);
    setEditingId("8A-04");
    setIsOnline(true);
    setPendingCount(0);
    setSavedMessage("Data demo dikembalikan ke kondisi awal.");
    setSelectedCaseId(initialCases[0].id);
    setActiveView("attendance");
  }

  return (
    <main className="demo-app">
      <aside className="demo-sidebar">
        <a className="demo-brand" href="/" aria-label="Selaras, kembali ke landing page">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>
            <strong>Selaras</strong>
            <small>Ruang sekolah</small>
          </span>
        </a>

        <div className="school-identity">
          <span className="school-avatar" aria-hidden="true">
            SID
          </span>
          <span>
            <strong>SMP Islam Darussalam</strong>
            <small>Workspace demo</small>
          </span>
        </div>

        <nav className="demo-nav" aria-label="Navigasi demo">
          <button
            type="button"
            className={activeView === "attendance" ? "is-active" : ""}
            onClick={() => setActiveView("attendance")}
          >
            <span aria-hidden="true">01</span>
            Kehadiran
          </button>
          <button
            type="button"
            className={activeView === "barcode" ? "is-active" : ""}
            onClick={() => setActiveView("barcode")}
          >
            <span aria-hidden="true">02</span>
            Barcode
          </button>
          <button
            type="button"
            className={activeView === "devices" ? "is-active" : ""}
            onClick={() => setActiveView("devices")}
          >
            <span aria-hidden="true">03</span>
            Perangkat
          </button>
          <button
            type="button"
            className={activeView === "cases" ? "is-active" : ""}
            onClick={() => setActiveView("cases")}
          >
            <span aria-hidden="true">04</span>
            Tindak lanjut
            <b>{cases.filter((item) => item.state !== "Selesai").length}</b>
          </button>
          <button
            type="button"
            className={activeView === "guide" ? "is-active" : ""}
            onClick={() => setActiveView("guide")}
          >
            <span aria-hidden="true">05</span>
            Panduan demo
          </button>
        </nav>

        <a className="family-demo-entry" href={familyAppUrl} target="_blank" rel="noreferrer">
          <span>
            <strong>Demo keluarga</strong>
            <small>Siswa dan orang tua</small>
          </span>
          <b aria-hidden="true">↗</b>
        </a>

        <div className="demo-user">
          <span aria-hidden="true">RM</span>
          <div>
            <strong>Rina Maulida</strong>
            <small>Wali kelas 8A</small>
          </div>
        </div>
      </aside>

      <section className="demo-workspace">
        <header className="demo-topbar">
          <div>
            <p>Sabtu, 15 Agustus 2026</p>
            <strong>Kelas 8A</strong>
          </div>
          <div className="topbar-actions">
            <span className="demo-data-label">Data simulasi</span>
            <button className="connection-button" type="button" onClick={toggleConnection}>
              {isOnline ? "Simulasikan offline" : "Kembali online"}
            </button>
          </div>
        </header>

        <div className="demo-content">
          <SyncStatusBanner
            state={isOnline ? (pendingCount > 0 ? "pending" : "synced") : "offline"}
            pendingCount={pendingCount}
            {...(isOnline ? { lastSyncedAt: "10.45" } : {})}
            className="demo-sync-banner"
          />

          {activeView === "attendance" && (
            <AttendanceView
              students={students}
              counts={counts}
              recordedCount={recordedCount}
              editingId={editingId}
              savedMessage={savedMessage}
              setEditingId={setEditingId}
              updateStatus={updateStatus}
              saveAttendance={saveAttendance}
              openCases={() => setActiveView("cases")}
            />
          )}

          {activeView === "cases" && (
            <CasesView
              cases={cases}
              selectedCase={selectedCase}
              selectCase={setSelectedCaseId}
              contactFamily={contactFamily}
              resolveCase={resolveCase}
            />
          )}

          {activeView === "barcode" && <BarcodeSessionView />}

          {activeView === "devices" && <DeviceOperationsView />}

          {activeView === "guide" && <GuideView resetDemo={resetDemo} />}
        </div>
      </section>
    </main>
  );
}

function AttendanceView({
  students,
  counts,
  recordedCount,
  editingId,
  savedMessage,
  setEditingId,
  updateStatus,
  saveAttendance,
  openCases,
}: {
  students: Student[];
  counts: Record<AttendanceStatus, number>;
  recordedCount: number;
  editingId: string | null;
  savedMessage: string;
  setEditingId: (id: string | null) => void;
  updateStatus: (id: string, status: AttendanceStatus) => void;
  saveAttendance: () => void;
  openCases: () => void;
}) {
  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="workspace-kicker">Konfirmasi pagi</p>
          <h1>Kehadiran kelas 8A</h1>
          <p>Periksa status sebelum data dikirim kepada keluarga.</p>
        </div>
        <div className="heading-meta">
          <span>Wali kelas</span>
          <strong>Rina Maulida</strong>
        </div>
      </div>

      <dl className="attendance-summary" aria-label="Ringkasan kehadiran data demo">
        <div>
          <dt>Tercatat</dt>
          <dd>
            {recordedCount}
            <span>/{students.length}</span>
          </dd>
        </div>
        <div>
          <dt>Hadir</dt>
          <dd>{counts.present}</dd>
        </div>
        <div>
          <dt>Terlambat atau izin</dt>
          <dd>{counts.late + counts.excused}</dd>
        </div>
        <div className={counts.unknown > 0 ? "summary-attention" : ""}>
          <dt>Perlu dilengkapi</dt>
          <dd>{counts.unknown}</dd>
        </div>
      </dl>

      <div className="attendance-layout">
        <section className="attendance-panel" aria-labelledby="student-list-title">
          <div className="panel-heading">
            <div>
              <h2 id="student-list-title">Daftar siswa demo</h2>
              <p>Pilih status berdasarkan konfirmasi guru, bukan perkiraan sistem.</p>
            </div>
            <span>{students.length} siswa</span>
          </div>

          <div className="student-list">
            {students.map((student) => (
              <article className="student-row" key={student.id}>
                <div className="student-person">
                  <span className="student-initial" aria-hidden="true">
                    {student.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span>
                    <strong>{student.name}</strong>
                    <small>ID demo {student.id}</small>
                  </span>
                </div>
                <p className="monthly-note">{student.monthlyNote}</p>
                <AttendanceStatusBadge status={student.status} size="sm" />
                <button
                  type="button"
                  className="edit-status"
                  onClick={() => setEditingId(editingId === student.id ? null : student.id)}
                  aria-expanded={editingId === student.id}
                >
                  {editingId === student.id ? "Tutup" : "Ubah"}
                </button>
                {editingId === student.id && (
                  <fieldset className="status-editor">
                    <legend>Pilih status {student.name} hari ini</legend>
                    <div>
                      {statusOptions.map((option) => (
                        <button
                          type="button"
                          key={option.value}
                          className={student.status === option.value ? "is-selected" : ""}
                          onClick={() => updateStatus(student.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                )}
              </article>
            ))}
          </div>

          <div className="save-bar">
            <p role="status">{savedMessage}</p>
            <button className="primary-action" type="button" onClick={saveAttendance}>
              Simpan kehadiran
            </button>
          </div>
        </section>

        <aside className="review-panel" aria-labelledby="review-title">
          <div>
            <p className="workspace-kicker">Perlu ditinjau</p>
            <h2 id="review-title">Satu sinyal membutuhkan manusia.</h2>
            <p>
              Alya tercatat tidak hadir 3 hari dalam 30 hari. Sistem hanya menunjukkan perubahan
              pola.
            </p>
          </div>
          <div className="review-facts">
            <span>Fakta hari ini</span>
            <strong>Belum ada keterangan keluarga</strong>
            <small>Notifikasi akan dikirim setelah data disimpan.</small>
          </div>
          <button className="secondary-action" type="button" onClick={openCases}>
            Buka tindak lanjut
          </button>
        </aside>
      </div>
    </>
  );
}

function CasesView({
  cases,
  selectedCase,
  selectCase,
  contactFamily,
  resolveCase,
}: {
  cases: DemoCase[];
  selectedCase: DemoCase;
  selectCase: (id: string) => void;
  contactFamily: () => void;
  resolveCase: () => void;
}) {
  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="workspace-kicker">Tinjau sebelum bertindak</p>
          <h1>Tindak lanjut siswa</h1>
          <p>Setiap sinyal menjelaskan observasi dan tetap membutuhkan keputusan staf.</p>
        </div>
      </div>

      <div className="case-layout">
        <section className="case-list" aria-label="Daftar tindak lanjut demo">
          {cases.map((item) => (
            <button
              type="button"
              key={item.id}
              className={selectedCase.id === item.id ? "is-selected" : ""}
              onClick={() => selectCase(item.id)}
            >
              <span>
                <strong>{item.student}</strong>
                <small>{item.id}</small>
              </span>
              <span
                className={`case-state case-state-${item.state.toLowerCase().replaceAll(" ", "-")}`}
              >
                {item.state}
              </span>
              <p>{item.observation}</p>
            </button>
          ))}
        </section>

        <section className="case-detail" aria-labelledby="case-detail-title">
          <div className="case-detail-heading">
            <span>{selectedCase.id}</span>
            <h2 id="case-detail-title">{selectedCase.student}</h2>
            <p>{selectedCase.observation}</p>
          </div>

          <dl className="case-metadata">
            <div>
              <dt>Penanggung jawab</dt>
              <dd>{selectedCase.owner}</dd>
            </div>
            <div>
              <dt>Batas tindak lanjut</dt>
              <dd>{selectedCase.due}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{selectedCase.state}</dd>
            </div>
          </dl>

          <div className="case-context">
            <h3>Konteks yang perlu dikonfirmasi</h3>
            <p>
              Transportasi, kesehatan, kesulitan belajar, kondisi keluarga, atau alasan lain yang
              disampaikan keluarga.
            </p>
            <small>Demo tidak menyimpan diagnosis atau memberi label karakter pada siswa.</small>
          </div>

          <div className="case-actions">
            <button
              className="primary-action"
              type="button"
              onClick={contactFamily}
              disabled={selectedCase.state !== "Perlu kontak"}
            >
              {selectedCase.state === "Perlu kontak" ? "Catat kontak keluarga" : "Kontak tercatat"}
            </button>
            <button
              className="secondary-action"
              type="button"
              onClick={resolveCase}
              disabled={selectedCase.state === "Selesai"}
            >
              Tandai selesai
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function GuideView({ resetDemo }: { resetDemo: () => void }) {
  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="workspace-kicker">Panduan pengujian</p>
          <h1>Coba alur utama dalam tiga menit.</h1>
          <p>Semua identitas dan catatan di ruang ini bersifat sintetis.</p>
        </div>
      </div>

      <section className="guide-panel">
        <ol>
          <li>
            <strong>Lengkapi kehadiran</strong>
            <p>Ubah status Dimas dari belum tercatat, lalu simpan kehadiran kelas.</p>
          </li>
          <li>
            <strong>Uji saat koneksi putus</strong>
            <p>Aktifkan mode offline, simpan perubahan, kemudian kembali online.</p>
          </li>
          <li>
            <strong>Tinjau sinyal</strong>
            <p>Buka tindak lanjut Alya dan catat bahwa keluarga sudah dihubungi.</p>
          </li>
        </ol>
        <div className="guide-principle">
          <h2>Batas penting demo</h2>
          <p>
            Sistem menunjukkan kejadian dan perubahan pola. Guru tetap memeriksa konteks sebelum
            menghubungi keluarga atau membuka kasus.
          </p>
          <button className="secondary-action" type="button" onClick={resetDemo}>
            Reset data demo
          </button>
        </div>
      </section>
    </>
  );
}
