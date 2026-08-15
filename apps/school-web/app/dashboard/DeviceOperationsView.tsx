"use client";

import { useCallback, useEffect, useState } from "react";

type DeviceSource = "nfc" | "rfid";
type JourneyStatus = "not_started" | "active" | "delayed" | "lost_signal" | "arrived";

type AdapterState = {
  source: DeviceSource;
  label: string;
  interface: string;
  connected: boolean;
  lastSeenAt: string;
};

type AttendanceSignal = {
  id: string;
  source: DeviceSource;
  studentId: string;
  studentName: string;
  credentialLabel: string;
  terminal: string;
  occurredAt: string;
  status: "pending_review";
};

type TrackerJourney = {
  id: string;
  studentName: string;
  status: JourneyStatus;
  consentVerified: boolean;
  source: "device" | "simulation";
  startedAt: string | null;
  updatedAt: string | null;
  arrivedAt: string | null;
  accuracy: number | null;
  areaLabel: string;
  storesCoordinates: false;
};

type Overview = {
  adapters: Record<DeviceSource, AdapterState>;
  signals: AttendanceSignal[];
  journey: TrackerJourney;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

const journeyLabels: Record<JourneyStatus, string> = {
  not_started: "Belum dimulai",
  active: "Dalam perjalanan",
  delayed: "Perlu pemeriksaan",
  lost_signal: "Sinyal tidak tersedia",
  arrived: "Sudah tiba",
};

function formatClock(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function DeviceOperationsView() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("Menghubungkan adapter demo…");

  const loadOverview = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    try {
      const response = await fetch(`${apiUrl}/devices/overview`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      setOverview((await response.json()) as Overview);
      setMessage("Semua event perangkat tersinkron ke API demo.");
    } catch {
      setMessage("Adapter API belum dapat dijangkau. Periksa server di port 4000.");
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOverview();
    const interval = window.setInterval(() => void loadOverview(true), 2_000);
    return () => window.clearInterval(interval);
  }, [loadOverview]);

  async function post(path: string, body?: Record<string, unknown>) {
    setIsUpdating(true);
    try {
      const response = await fetch(`${apiUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        ...(body ? { body: JSON.stringify(body) } : {}),
      });
      const result = (await response.json()) as Partial<Overview> & { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Perintah perangkat belum berhasil.");
      await loadOverview(true);
      setMessage("Perintah demo diterima dan dicatat sebagai event.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Perintah perangkat belum berhasil.");
    } finally {
      setIsUpdating(false);
    }
  }

  function simulateTap(source: DeviceSource) {
    void post("/devices/attendance-signals", {
      source,
      tagId: source === "nfc" ? "NFC-DEMO-81A2" : "RFID-DEMO-44C9",
      studentId: source === "nfc" ? "STUDENT-DEMO-8A-04" : "STUDENT-DEMO-8A-07",
      studentName: source === "nfc" ? "Dimas Setiawan" : "Hana Maulida",
      terminal: source === "nfc" ? "Terminal kelas 8A" : "Gerbang utama",
    });
  }

  const journey = overview?.journey;
  const activeAdapterCount = overview
    ? Object.values(overview.adapters).filter((adapter) => adapter.connected).length
    : 0;

  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="workspace-kicker">Adapter perangkat</p>
          <h1>NFC, RFID & GPS Tracker</h1>
          <p>Satu jalur event untuk perangkat berbeda, dengan verifikasi dan batas privasi.</p>
        </div>
        <div className="heading-meta">
          <span>Status API</span>
          <strong>{isLoading ? "Memuat…" : `${activeAdapterCount}/2 reader terhubung`}</strong>
        </div>
      </div>

      <p className="device-status-message" role="status">
        {message}
      </p>

      <section className="device-module-grid" aria-label="Modul perangkat demo">
        {(["nfc", "rfid"] as const).map((source) => {
          const adapter = overview?.adapters[source];
          return (
            <article className="device-module-card" key={source}>
              <div className="device-module-heading">
                <span className={`device-icon device-icon-${source}`} aria-hidden="true">
                  {source.toUpperCase()}
                </span>
                <span className={`adapter-state ${adapter?.connected ? "is-connected" : ""}`}>
                  {adapter?.connected ? "Terhubung" : "Terputus"}
                </span>
              </div>
              <h2>{source === "nfc" ? "NFC Tap" : "RFID Gate"}</h2>
              <p>
                {source === "nfc"
                  ? "Menerima kartu NDEF atau reader NFC melalui adapter yang sama."
                  : "Menerima UID dari reader USB/LAN tanpa mengubah core absensi."}
              </p>
              <dl className="device-facts">
                <div>
                  <dt>Antarmuka</dt>
                  <dd>{adapter?.interface ?? "Menunggu API"}</dd>
                </div>
                <div>
                  <dt>Terakhir aktif</dt>
                  <dd>{formatClock(adapter?.lastSeenAt ?? null)}</dd>
                </div>
              </dl>
              <div className="device-actions">
                <button
                  type="button"
                  className="primary-action"
                  onClick={() => simulateTap(source)}
                  disabled={isUpdating || !adapter?.connected}
                >
                  Simulasikan kartu
                </button>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => void post("/devices/adapters/toggle", { source })}
                  disabled={isUpdating}
                >
                  {adapter?.connected ? "Putuskan" : "Hubungkan"}
                </button>
              </div>
            </article>
          );
        })}

        <article className="device-module-card gps-module-card">
          <div className="device-module-heading">
            <span className="device-icon device-icon-gps" aria-hidden="true">
              GPS
            </span>
            <span className={`tracker-state tracker-state-${journey?.status ?? "not_started"}`}>
              {journeyLabels[journey?.status ?? "not_started"]}
            </span>
          </div>
          <h2>GPS Tracker</h2>
          <p>Memantau event satu perjalanan yang dimulai siswa, bukan lokasi seluruh siswa.</p>

          <div className="tracker-summary">
            <div>
              <span>Siswa</span>
              <strong>{journey?.studentName ?? "Nabila Putri"}</strong>
            </div>
            <div>
              <span>Area yang terlihat</span>
              <strong>{journey?.areaLabel ?? "Lokasi tidak dibagikan"}</strong>
            </div>
            <div>
              <span>Pembaruan</span>
              <strong>{formatClock(journey?.updatedAt ?? null)}</strong>
            </div>
          </div>

          <div className="journey-event-track">
            <span className={journey?.startedAt ? "is-complete" : ""}>Mulai</span>
            <span
              className={
                journey?.status && !["not_started", "arrived"].includes(journey.status)
                  ? "is-current"
                  : journey?.status === "arrived"
                    ? "is-complete"
                    : ""
              }
            >
              Perjalanan
            </span>
            <span className={journey?.status === "arrived" ? "is-complete" : ""}>Tiba</span>
          </div>

          <div className="device-actions tracker-actions">
            {journey?.status === "not_started" ? (
              <button
                type="button"
                className="primary-action"
                onClick={() =>
                  void post("/devices/gps/journey/start", {
                    consent: true,
                    source: "simulation",
                    accuracy: 45,
                  })
                }
                disabled={isUpdating}
              >
                Mulai sesi simulasi
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="secondary-action"
                  onClick={() => void post("/devices/gps/journey/event", { event: "lost_signal" })}
                  disabled={isUpdating || journey?.status === "arrived"}
                >
                  Simulasikan sinyal hilang
                </button>
                <button
                  type="button"
                  className="primary-action"
                  onClick={() => void post("/devices/gps/journey/event", { event: "arrived" })}
                  disabled={isUpdating || journey?.status === "arrived"}
                >
                  Tandai tiba
                </button>
                <button
                  type="button"
                  className="text-device-action"
                  onClick={() => void post("/devices/gps/journey/reset")}
                  disabled={isUpdating}
                >
                  Reset sesi
                </button>
              </>
            )}
          </div>

          <div className="tracker-privacy">
            <strong>
              {journey?.consentVerified ? "Persetujuan terverifikasi" : "Belum ada sesi"}
            </strong>
            <span>Server menyimpan event dan akurasi, bukan breadcrumb koordinat.</span>
          </div>
        </article>
      </section>

      <section className="device-event-panel" aria-labelledby="device-events-title">
        <div className="panel-heading">
          <div>
            <h2 id="device-events-title">Sinyal kehadiran perangkat</h2>
            <p>Tap dari NFC dan RFID masuk ke antrean pemeriksaan yang sama.</p>
          </div>
          <span>{overview?.signals.length ?? 0} event</span>
        </div>

        <div className="device-event-list" aria-live="polite">
          {overview?.signals.length ? (
            overview.signals.map((signal) => (
              <article className="device-event-row" key={signal.id}>
                <span className={`event-source event-source-${signal.source}`}>
                  {signal.source.toUpperCase()}
                </span>
                <div>
                  <strong>{signal.studentName}</strong>
                  <small>
                    {signal.credentialLabel} · {signal.terminal} · {formatClock(signal.occurredAt)}
                  </small>
                </div>
                <span className="scan-pending">Menunggu verifikasi</span>
              </article>
            ))
          ) : (
            <div className="device-event-empty">
              <strong>Belum ada tap kartu.</strong>
              <p>Gunakan tombol simulasi pada NFC atau RFID untuk menguji adapter.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
