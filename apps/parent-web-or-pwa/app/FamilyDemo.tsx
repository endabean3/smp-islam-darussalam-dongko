"use client";

import { AttendanceStatusBadge } from "@selaras/ui-components/patterns";
import { useMemo, useState } from "react";
import { BarcodeAttendance } from "./BarcodeAttendance";
import { ContactlessAttendance } from "./ContactlessAttendance";

type Role = "student" | "parent";
type LocationState = "idle" | "requesting" | "granted" | "denied" | "unavailable" | "error";
type JourneyState = "not-started" | "active" | "arrived";

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number;
  source: "device" | "simulation";
};

const simulatedCoordinates: Coordinates = {
  latitude: -8.2328,
  longitude: 111.5734,
  accuracy: 45,
  source: "simulation",
};

const schoolAppUrl = process.env.NEXT_PUBLIC_SCHOOL_APP_URL ?? "http://localhost:3000";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function sendJourneyRequest(path: string, body?: Record<string, unknown>) {
  return fetch(`${apiUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).catch(() => undefined);
}

function formatTime() {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function FamilyDemo() {
  const [role, setRole] = useState<Role>("parent");
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [journeyState, setJourneyState] = useState<JourneyState>("not-started");
  const [departedAt, setDepartedAt] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [arrivedAt, setArrivedAt] = useState<string | null>(null);
  const [parentAcknowledged, setParentAcknowledged] = useState(false);
  const [locationMessage, setLocationMessage] = useState(
    "Lokasi belum diminta. Perangkat tidak mengirim posisi di latar.",
  );

  const mapsUrl = useMemo(() => {
    if (!coordinates) return null;
    const query = encodeURIComponent(`${coordinates.latitude},${coordinates.longitude}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  }, [coordinates]);

  function requestDeviceLocation() {
    if (!("geolocation" in navigator)) {
      setLocationState("unavailable");
      setLocationMessage("Perangkat ini tidak menyediakan akses lokasi browser.");
      return;
    }

    setLocationState("requesting");
    setLocationMessage("Menunggu izin lokasi dari perangkat.");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const time = formatTime();
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          source: "device",
        });
        setUpdatedAt(time);
        setLocationState("granted");
        setLocationMessage("Posisi perangkat tersedia untuk sesi ini.");
        if (journeyState === "active") {
          void sendJourneyRequest("/devices/gps/journey/event", {
            event: "heartbeat",
            accuracy: Math.round(position.coords.accuracy),
          });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationState("denied");
          setLocationMessage(
            "Izin lokasi ditolak. Anda dapat mengubah izin browser atau memakai lokasi simulasi.",
          );
          return;
        }
        setLocationState("error");
        setLocationMessage("Posisi belum dapat dibaca. Periksa sinyal lokasi lalu coba lagi.");
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 },
    );
  }

  function useSimulatedLocation() {
    setCoordinates(simulatedCoordinates);
    setUpdatedAt("14.08");
    setLocationState("granted");
    setLocationMessage("Lokasi simulasi aktif. Tidak ada posisi perangkat yang digunakan.");
    if (journeyState === "active") {
      void sendJourneyRequest("/devices/gps/journey/event", {
        event: "heartbeat",
        accuracy: simulatedCoordinates.accuracy,
      });
    }
  }

  function startJourney() {
    if (!consentAccepted || !coordinates) return;
    const time = formatTime();
    setJourneyState("active");
    setDepartedAt(time);
    setUpdatedAt(time);
    setArrivedAt(null);
    setParentAcknowledged(false);
    void sendJourneyRequest("/devices/gps/journey/start", {
      consent: true,
      source: coordinates.source,
      accuracy: coordinates.accuracy,
      studentId: "STUDENT-DEMO-8A-12",
      studentName: "Nabila Putri",
    });
  }

  function finishJourney() {
    const time = formatTime();
    setJourneyState("arrived");
    setArrivedAt(time);
    setUpdatedAt(time);
    setCoordinates(null);
    setLocationMessage("Sesi selesai. Akses lokasi untuk perjalanan ini sudah dihentikan.");
    void sendJourneyRequest("/devices/gps/journey/event", { event: "arrived" });
  }

  function resetJourney() {
    setLocationState("idle");
    setCoordinates(null);
    setConsentAccepted(false);
    setJourneyState("not-started");
    setDepartedAt(null);
    setUpdatedAt(null);
    setArrivedAt(null);
    setParentAcknowledged(false);
    setLocationMessage("Lokasi belum diminta. Perangkat tidak mengirim posisi di latar.");
    void sendJourneyRequest("/devices/gps/journey/reset");
  }

  return (
    <main className="family-app">
      <header className="family-header">
        <a
          className="family-brand"
          href={schoolAppUrl}
          aria-label="Selaras, kembali ke landing page"
        >
          <span aria-hidden="true">S</span>
          <strong>Selaras</strong>
        </a>
        <span className="family-demo-label">Data simulasi</span>
      </header>

      <nav className="role-switch" aria-label="Pilih tampilan demo">
        <button
          type="button"
          className={role === "student" ? "is-active" : ""}
          onClick={() => setRole("student")}
        >
          Tampilan siswa
        </button>
        <button
          type="button"
          className={role === "parent" ? "is-active" : ""}
          onClick={() => setRole("parent")}
        >
          Tampilan orang tua
        </button>
      </nav>

      {role === "student" ? (
        <StudentView
          locationState={locationState}
          locationMessage={locationMessage}
          coordinates={coordinates}
          consentAccepted={consentAccepted}
          journeyState={journeyState}
          departedAt={departedAt}
          updatedAt={updatedAt}
          mapsUrl={mapsUrl}
          setConsentAccepted={setConsentAccepted}
          requestDeviceLocation={requestDeviceLocation}
          useSimulatedLocation={useSimulatedLocation}
          startJourney={startJourney}
          finishJourney={finishJourney}
          resetJourney={resetJourney}
          showParent={() => setRole("parent")}
        />
      ) : (
        <ParentView
          journeyState={journeyState}
          departedAt={departedAt}
          updatedAt={updatedAt}
          arrivedAt={arrivedAt}
          coordinates={coordinates}
          mapsUrl={mapsUrl}
          parentAcknowledged={parentAcknowledged}
          acknowledge={() => setParentAcknowledged(true)}
          showStudent={() => setRole("student")}
        />
      )}
    </main>
  );
}

function StudentView({
  locationState,
  locationMessage,
  coordinates,
  consentAccepted,
  journeyState,
  departedAt,
  updatedAt,
  mapsUrl,
  setConsentAccepted,
  requestDeviceLocation,
  useSimulatedLocation,
  startJourney,
  finishJourney,
  resetJourney,
  showParent,
}: {
  locationState: LocationState;
  locationMessage: string;
  coordinates: Coordinates | null;
  consentAccepted: boolean;
  journeyState: JourneyState;
  departedAt: string | null;
  updatedAt: string | null;
  mapsUrl: string | null;
  setConsentAccepted: (accepted: boolean) => void;
  requestDeviceLocation: () => void;
  useSimulatedLocation: () => void;
  startJourney: () => void;
  finishJourney: () => void;
  resetJourney: () => void;
  showParent: () => void;
}) {
  return (
    <section className="family-shell" aria-labelledby="student-title">
      <div className="family-heading">
        <p>Halo, Nabila</p>
        <h1 id="student-title">Perjalanan pulang</h1>
        <span>Kelas 8A, akun siswa demo</span>
      </div>

      <div className="student-status-card">
        <div>
          <span>Status sekolah hari ini</span>
          <AttendanceStatusBadge status="present" label="Hadir, dikonfirmasi 07.12" />
        </div>
        <p>GPS tidak digunakan untuk menentukan kehadiran.</p>
      </div>

      <BarcodeAttendance />

      <ContactlessAttendance />

      <section className={`journey-card journey-${journeyState}`} aria-labelledby="journey-title">
        <div className="journey-heading">
          <span className="journey-state-label">
            {journeyState === "not-started"
              ? "Belum dimulai"
              : journeyState === "active"
                ? "Lokasi aktif"
                : "Sudah tiba"}
          </span>
          <h2 id="journey-title">
            {journeyState === "not-started"
              ? "Bagikan status hanya selama perjalanan."
              : journeyState === "active"
                ? "Perjalanan sedang berlangsung."
                : "Perjalanan sudah ditutup."}
          </h2>
          <p>
            {journeyState === "active"
              ? `Dimulai ${departedAt ?? "baru saja"}. Posisi terakhir diperbarui ${updatedAt ?? "baru saja"}.`
              : journeyState === "arrived"
                ? "Orang tua menerima status tiba. Lokasi tidak lagi diminta."
                : "Selaras meminta posisi hanya setelah kamu memberi izin dan memulai sesi."}
          </p>
        </div>

        {journeyState === "not-started" && (
          <div className="journey-setup">
            <div className="location-permission" role="status" aria-live="polite">
              <strong>
                {locationState === "requesting" ? "Meminta akses lokasi" : "Akses lokasi perangkat"}
              </strong>
              <p>{locationMessage}</p>
              <div>
                <button
                  type="button"
                  className="family-primary"
                  onClick={requestDeviceLocation}
                  disabled={locationState === "requesting"}
                >
                  {locationState === "granted" ? "Perbarui GPS" : "Izinkan GPS"}
                </button>
                <button type="button" className="family-secondary" onClick={useSimulatedLocation}>
                  Pakai lokasi simulasi
                </button>
              </div>
            </div>

            <label className="consent-row">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(event) => setConsentAccepted(event.target.checked)}
              />
              <span>
                Saya setuju membagikan posisi selama sesi ini. Sesi berhenti saat saya menekan
                tombol tiba.
              </span>
            </label>

            <button
              type="button"
              className="family-primary start-journey"
              onClick={startJourney}
              disabled={!consentAccepted || !coordinates}
            >
              Mulai perjalanan
            </button>
            {(!consentAccepted || !coordinates) && (
              <p className="action-helper">
                Berikan izin lokasi dan centang persetujuan untuk melanjutkan.
              </p>
            )}
          </div>
        )}

        {journeyState === "active" && (
          <div className="active-journey-panel">
            <div className="privacy-location">
              <span>Posisi terakhir</span>
              <strong>
                {coordinates?.source === "simulation"
                  ? "Lokasi simulasi"
                  : "GPS perangkat tersedia"}
              </strong>
              <small>
                Akurasi sekitar {coordinates?.accuracy ?? 0} meter. Koordinat tidak ditampilkan di
                layar.
              </small>
            </div>
            <div className="journey-actions">
              <button type="button" className="family-secondary" onClick={requestDeviceLocation}>
                Perbarui posisi
              </button>
              {mapsUrl && (
                <a className="family-secondary" href={mapsUrl} target="_blank" rel="noreferrer">
                  Buka Google Maps
                </a>
              )}
              <button type="button" className="family-primary" onClick={finishJourney}>
                Saya sudah tiba
              </button>
            </div>
            <small className="maps-privacy-copy">
              Membuka Google Maps akan mengirim titik posisi ini ke layanan Google.
            </small>
          </div>
        )}

        {journeyState === "arrived" && (
          <div className="arrived-panel">
            <strong>Status tiba berhasil dikirim.</strong>
            <p>Riwayat hanya menyimpan waktu berangkat, waktu tiba, dan durasi sesi.</p>
            <div>
              <button type="button" className="family-secondary" onClick={showParent}>
                Lihat sebagai orang tua
              </button>
              <button type="button" className="family-secondary" onClick={resetJourney}>
                Reset perjalanan
              </button>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}

function ParentView({
  journeyState,
  departedAt,
  updatedAt,
  arrivedAt,
  coordinates,
  mapsUrl,
  parentAcknowledged,
  acknowledge,
  showStudent,
}: {
  journeyState: JourneyState;
  departedAt: string | null;
  updatedAt: string | null;
  arrivedAt: string | null;
  coordinates: Coordinates | null;
  mapsUrl: string | null;
  parentAcknowledged: boolean;
  acknowledge: () => void;
  showStudent: () => void;
}) {
  return (
    <section className="family-shell" aria-labelledby="parent-title">
      <div className="family-heading">
        <p>Selamat siang, Ibu Sari</p>
        <h1 id="parent-title">Kabar Nabila hari ini</h1>
        <span>Semua informasi pada halaman ini adalah data simulasi.</span>
      </div>

      <section className="parent-overview" aria-label="Ringkasan anak demo">
        <div className="child-identity">
          <span aria-hidden="true">NP</span>
          <div>
            <strong>Nabila Putri</strong>
            <small>Kelas 8A</small>
          </div>
        </div>
        <div>
          <span>Kehadiran</span>
          <AttendanceStatusBadge status="present" />
        </div>
        <div>
          <span>Pesan sekolah</span>
          <strong>Sudah dibaca</strong>
        </div>
      </section>

      <div className="parent-grid">
        <section
          className={`parent-journey journey-${journeyState}`}
          aria-labelledby="parent-journey-title"
        >
          <div className="parent-card-heading">
            <span>Safe Journey</span>
            <h2 id="parent-journey-title">
              {journeyState === "not-started"
                ? "Belum ada perjalanan aktif."
                : journeyState === "active"
                  ? "Nabila sedang dalam perjalanan."
                  : "Nabila sudah tiba."}
            </h2>
          </div>

          {journeyState === "not-started" && (
            <div className="parent-empty-state">
              <p>Lokasi tidak tersedia karena siswa belum memulai sesi.</p>
              <small>Tidak ada pelacakan otomatis di luar perjalanan.</small>
              <button type="button" className="family-secondary" onClick={showStudent}>
                Buka tampilan siswa
              </button>
            </div>
          )}

          {journeyState === "active" && (
            <div className="parent-active-state">
              <dl>
                <div>
                  <dt>Berangkat</dt>
                  <dd>{departedAt ?? "Baru saja"}</dd>
                </div>
                <div>
                  <dt>Pembaruan terakhir</dt>
                  <dd>{updatedAt ?? "Baru saja"}</dd>
                </div>
                <div>
                  <dt>Sumber</dt>
                  <dd>{coordinates?.source === "simulation" ? "Simulasi" : "Perangkat siswa"}</dd>
                </div>
              </dl>
              <p>Posisi hanya tersedia selama sesi yang dimulai oleh siswa.</p>
              <div className="parent-journey-actions">
                {mapsUrl && (
                  <a className="family-primary" href={mapsUrl} target="_blank" rel="noreferrer">
                    Lihat di Google Maps
                  </a>
                )}
                <button
                  type="button"
                  className="family-secondary"
                  onClick={acknowledge}
                  disabled={parentAcknowledged}
                >
                  {parentAcknowledged ? "Sudah dikonfirmasi" : "Saya sudah melihat"}
                </button>
              </div>
              <small className="maps-privacy-copy">
                Membuka Google Maps akan mengirim titik posisi ini ke layanan Google.
              </small>
            </div>
          )}

          {journeyState === "arrived" && (
            <div className="parent-arrived-state">
              <span className="arrived-mark" aria-hidden="true">
                OK
              </span>
              <div>
                <strong>Tiba pada {arrivedAt ?? "baru saja"}</strong>
                <p>Akses lokasi berakhir otomatis ketika status tiba dikirim.</p>
              </div>
            </div>
          )}
        </section>

        <section className="attendance-history" aria-labelledby="history-title">
          <div className="parent-card-heading">
            <span>30 hari terakhir</span>
            <h2 id="history-title">Ringkasan kehadiran</h2>
          </div>
          <dl>
            <div>
              <dt>Hadir</dt>
              <dd>18 hari</dd>
            </div>
            <div>
              <dt>Izin</dt>
              <dd>1 hari</dd>
            </div>
            <div>
              <dt>Terlambat</dt>
              <dd>1 kali</dd>
            </div>
          </dl>
          <p>Wali kelas belum mencatat perubahan pola yang perlu ditindaklanjuti.</p>
        </section>
      </div>

      <section className="family-privacy-note">
        <strong>Privasi keluarga</strong>
        <p>
          Orang tua hanya melihat anak yang tertaut. Sinyal lokasi yang hilang tidak dianggap
          sebagai bahaya atau ketidakhadiran.
        </p>
      </section>
    </section>
  );
}
