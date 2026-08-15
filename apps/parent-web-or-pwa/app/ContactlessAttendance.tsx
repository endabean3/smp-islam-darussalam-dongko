"use client";

import { useCallback, useRef, useState } from "react";

type DeviceSource = "nfc" | "rfid";
type TapState = "idle" | "reading" | "submitting" | "accepted" | "duplicate" | "error";

type NdefReadingEvent = Event & { serialNumber?: string };
type NdefReader = {
  scan(options?: { signal?: AbortSignal }): Promise<void>;
  addEventListener(
    type: "reading",
    listener: (event: NdefReadingEvent) => void,
    options?: { once?: boolean },
  ): void;
  addEventListener(type: "readingerror", listener: () => void, options?: { once?: boolean }): void;
};
type NdefReaderConstructor = new () => NdefReader;

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function ContactlessAttendance() {
  const abortRef = useRef<AbortController | null>(null);
  const [tapState, setTapState] = useState<TapState>("idle");
  const [activeSource, setActiveSource] = useState<DeviceSource | null>(null);
  const [message, setMessage] = useState("Tempelkan kartu hanya saat guru membuka sesi absensi.");

  const submitSignal = useCallback(async (source: DeviceSource, tagId: string) => {
    setActiveSource(source);
    setTapState("submitting");
    setMessage("Mengirim sinyal kartu ke sekolah…");

    try {
      const response = await fetch(`${apiUrl}/devices/attendance-signals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          tagId,
          studentId: "STUDENT-DEMO-8A-12",
          studentName: "Nabila Putri",
          terminal: source === "nfc" ? "Ponsel siswa demo" : "Gerbang utama",
        }),
      });
      const result = (await response.json()) as { duplicate?: boolean; message?: string };
      if (!response.ok) throw new Error(result.message ?? "Sinyal kartu belum diterima.");

      setTapState(result.duplicate ? "duplicate" : "accepted");
      setMessage(
        result.duplicate
          ? "Tap sebelumnya sudah diterima. Menunggu verifikasi guru."
          : "Tap diterima. Menunggu verifikasi guru.",
      );
    } catch (error) {
      setTapState("error");
      setMessage(error instanceof Error ? error.message : "Sinyal kartu belum diterima.");
    }
  }, []);

  async function startNfcReading() {
    const NdefApi = (window as typeof window & { NDEFReader?: NdefReaderConstructor }).NDEFReader;
    if (!NdefApi) {
      setActiveSource("nfc");
      setTapState("error");
      setMessage("Web NFC tidak tersedia di browser ini. Gunakan kartu pada terminal sekolah.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setActiveSource("nfc");
    setTapState("reading");
    setMessage("Dekatkan tag NFC NDEF ke bagian belakang perangkat.");

    try {
      const reader = new NdefApi();
      reader.addEventListener(
        "reading",
        (event) => {
          controller.abort();
          void submitSignal("nfc", event.serialNumber || `NDEF-${Date.now()}`);
        },
        { once: true },
      );
      reader.addEventListener(
        "readingerror",
        () => {
          setTapState("error");
          setMessage("Tag belum terbaca. Pastikan tag mendukung format NDEF.");
        },
        { once: true },
      );
      await reader.scan({ signal: controller.signal });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      const denied = error instanceof DOMException && error.name === "NotAllowedError";
      setTapState("error");
      setMessage(
        denied
          ? "Izin NFC ditolak. Gunakan terminal kartu sekolah."
          : "NFC belum dapat dimulai. Pastikan halaman memakai HTTPS dan perangkat mendukung NFC.",
      );
    }
  }

  function simulate(source: DeviceSource) {
    void submitSignal(source, `${source.toUpperCase()}-STUDENT-DEMO-71F4`);
  }

  return (
    <section className="contactless-attendance" aria-labelledby="contactless-title">
      <div className="contactless-heading">
        <div>
          <span>Kartu pelajar</span>
          <h2 id="contactless-title">NFC & RFID</h2>
        </div>
        <span className="contactless-state">
          {tapState === "reading" ? "Membaca NFC" : "Adapter siap"}
        </span>
      </div>

      <div className="contactless-options">
        <article>
          <span className="contactless-icon" aria-hidden="true">
            NFC
          </span>
          <div>
            <strong>NFC perangkat</strong>
            <p>Membaca tag NDEF pada perangkat dan browser yang mendukung.</p>
          </div>
          <button
            type="button"
            className="family-primary"
            onClick={startNfcReading}
            disabled={tapState === "reading" || tapState === "submitting"}
          >
            Baca NFC
          </button>
        </article>

        <article>
          <span className="contactless-icon contactless-icon-rfid" aria-hidden="true">
            RFID
          </span>
          <div>
            <strong>Kartu RFID sekolah</strong>
            <p>Tempelkan kartu ke reader di gerbang atau kelas; ponsel tidak diperlukan.</p>
          </div>
          <span className="terminal-copy">Diproses terminal</span>
        </article>
      </div>

      <div className="contactless-demo-actions">
        <button type="button" onClick={() => simulate("nfc")} disabled={tapState === "submitting"}>
          Simulasikan NFC
        </button>
        <button type="button" onClick={() => simulate("rfid")} disabled={tapState === "submitting"}>
          Simulasikan RFID
        </button>
      </div>

      <div
        className={`contactless-result contactless-result-${tapState}`}
        role={tapState === "error" ? "alert" : "status"}
      >
        <strong>
          {tapState === "accepted"
            ? `${activeSource?.toUpperCase()} diterima`
            : tapState === "duplicate"
              ? "Tap sudah tercatat"
              : tapState === "error"
                ? "Perangkat belum siap"
                : tapState === "reading"
                  ? "Menunggu tag"
                  : "Status kartu"}
        </strong>
        <p>{message}</p>
      </div>

      <p className="contactless-privacy-copy">
        ID kartu dimasking pada dashboard. Tap tetap harus dikonfirmasi guru sebagai kehadiran.
      </p>
    </section>
  );
}
