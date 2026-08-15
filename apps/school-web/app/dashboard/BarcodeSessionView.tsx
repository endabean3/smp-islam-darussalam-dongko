"use client";

import JsBarcode from "jsbarcode";
import { useCallback, useEffect, useRef, useState } from "react";

type BarcodeSession = {
  active: boolean;
  className: string;
  code: string;
  createdAt: string;
  expiresAt: string;
};

type ScanRecord = {
  id: string;
  studentId: string;
  studentName: string;
  scannedAt: string;
  status: "pending_review";
};

type SessionResponse = {
  session: BarcodeSession;
  scans: ScanRecord[];
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

function formatClock(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

export function BarcodeSessionView() {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<SessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadSession = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/attendance/barcode/session`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Sesi barcode belum dapat dimuat.");
      setData((await response.json()) as SessionResponse);
      setErrorMessage(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Sesi barcode belum dapat dimuat.");
    } finally {
      if (!quiet) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSession();
    const interval = window.setInterval(() => void loadSession(true), 2_000);
    return () => window.clearInterval(interval);
  }, [loadSession]);

  useEffect(() => {
    if (!barcodeRef.current || !data?.session.code) return;

    JsBarcode(barcodeRef.current, data.session.code, {
      format: "CODE128",
      background: "#ffffff",
      lineColor: "#0f2440",
      width: 2,
      height: 92,
      margin: 14,
      displayValue: false,
    });
  }, [data?.session.code]);

  async function updateSession(action: "rotate" | "close" | "open") {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const response = await fetch(`${apiUrl}/attendance/barcode/session/${action}`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Perubahan sesi belum berhasil disimpan.");
      setData((await response.json()) as SessionResponse);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Perubahan sesi belum berhasil disimpan.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <div className="workspace-heading">
        <div>
          <p className="workspace-kicker">Absensi berbantuan barcode</p>
          <h1>Kode absensi kelas</h1>
          <p>Siswa memindai kode, lalu guru memeriksa hasil sebelum mencatat kehadiran.</p>
        </div>
        <div className="heading-meta">
          <span>Pemindai terhubung</span>
          <strong>Demo siswa di port 3001</strong>
        </div>
      </div>

      <div className="barcode-layout">
        <section className="barcode-session-card" aria-labelledby="barcode-session-title">
          <div className="barcode-card-heading">
            <div>
              <span>Sesi kelas aktif</span>
              <h2 id="barcode-session-title">{data?.session.className ?? "Kelas 8A"}</h2>
            </div>
            <span className={`session-state ${data?.session.active ? "is-open" : "is-closed"}`}>
              {data?.session.active ? "Terbuka" : "Ditutup"}
            </span>
          </div>

          {isLoading ? (
            <div className="barcode-loading" role="status">
              Menyiapkan kode sesi…
            </div>
          ) : data ? (
            <div className="barcode-display">
              <div className="barcode-canvas">
                <svg ref={barcodeRef} role="img" aria-label={`Kode ${data.session.code}`} />
              </div>
              <code>{data.session.code}</code>
              <p>
                Berlaku sampai <strong>{formatClock(data.session.expiresAt)}</strong>. Tampilkan
                layar ini di depan kelas atau bacakan kode untuk input manual.
              </p>
            </div>
          ) : null}

          {errorMessage && (
            <p className="barcode-error" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="barcode-session-actions">
            <button
              type="button"
              className="primary-action"
              onClick={() => updateSession("rotate")}
              disabled={isUpdating}
            >
              Buat kode baru
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => updateSession(data?.session.active ? "close" : "open")}
              disabled={isUpdating || !data}
            >
              {data?.session.active ? "Tutup sesi" : "Buka sesi baru"}
            </button>
          </div>

          <div className="barcode-principle">
            <strong>Barcode adalah sinyal, bukan keputusan.</strong>
            <p>Hasil pindai tidak otomatis membuat siswa berstatus hadir.</p>
          </div>
        </section>

        <section className="scan-review-card" aria-labelledby="scan-review-title">
          <div className="panel-heading">
            <div>
              <h2 id="scan-review-title">Pemindaian masuk</h2>
              <p>Daftar diperbarui otomatis setiap dua detik.</p>
            </div>
            <span>{data?.scans.length ?? 0} siswa</span>
          </div>

          <div className="scan-list" aria-live="polite">
            {data?.scans.length ? (
              data.scans.map((scan) => (
                <article className="scan-row" key={scan.id}>
                  <span className="scan-initial" aria-hidden="true">
                    {scan.studentName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <strong>{scan.studentName}</strong>
                    <small>
                      {scan.studentId} · dipindai {formatClock(scan.scannedAt)}
                    </small>
                  </div>
                  <span className="scan-pending">Menunggu verifikasi</span>
                </article>
              ))
            ) : (
              <div className="scan-empty-state">
                <span aria-hidden="true">—</span>
                <strong>Belum ada pemindaian.</strong>
                <p>Buka tampilan siswa, pindai barcode, lalu hasil akan muncul di sini.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
