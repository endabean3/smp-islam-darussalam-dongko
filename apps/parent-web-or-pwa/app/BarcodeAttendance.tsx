"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Detector = {
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
};

type DetectorConstructor = new (options: { formats: string[] }) => Detector;

type SubmitState = "idle" | "submitting" | "accepted" | "duplicate" | "error";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function BarcodeAttendance() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const detectionBusyRef = useRef(false);
  const [code, setCode] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraMessage, setCameraMessage] = useState(
    "Kamera hanya aktif setelah tombol pemindai ditekan.",
  );
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const stopCamera = useCallback(() => {
    if (animationFrameRef.current !== null) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  }, []);

  useEffect(() => stopCamera, [stopCamera]);

  const submitCode = useCallback(async (submittedCode: string) => {
    const normalizedCode = submittedCode.trim().toUpperCase();
    if (!normalizedCode) {
      setSubmitState("error");
      setSubmitMessage("Masukkan kode sesi yang ditampilkan guru.");
      return;
    }

    setCode(normalizedCode);
    setSubmitState("submitting");
    setSubmitMessage("Mengirim hasil pindai…");

    try {
      const response = await fetch(`${apiUrl}/attendance/barcode/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: normalizedCode,
          studentId: "STUDENT-DEMO-8A-12",
          studentName: "Nabila Putri",
        }),
      });
      const result = (await response.json()) as {
        accepted?: boolean;
        duplicate?: boolean;
        message?: string;
      };

      if (!response.ok) throw new Error(result.message ?? "Kode belum dapat dikirim.");

      setSubmitState(result.duplicate ? "duplicate" : "accepted");
      setSubmitMessage(
        result.duplicate
          ? "Pemindaian sebelumnya sudah diterima. Menunggu verifikasi guru."
          : "Pemindaian diterima. Menunggu verifikasi guru.",
      );
    } catch (error) {
      setSubmitState("error");
      setSubmitMessage(error instanceof Error ? error.message : "Kode belum dapat dikirim.");
    }
  }, []);

  async function startCamera() {
    setSubmitState("idle");
    setSubmitMessage("");

    const DetectorApi = (window as typeof window & { BarcodeDetector?: DetectorConstructor })
      .BarcodeDetector;
    if (!DetectorApi) {
      setCameraMessage(
        "Pemindaian otomatis belum didukung browser ini. Masukkan kode secara manual.",
      );
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraMessage("Kamera browser tidak tersedia. Masukkan kode secara manual.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setIsCameraActive(true);
      setCameraMessage("Arahkan barcode kelas ke dalam bingkai.");

      const detector = new DetectorApi({ formats: ["code_128"] });
      let isRunning = true;

      const scanFrame = async () => {
        const video = videoRef.current;
        if (!isRunning || !video || !streamRef.current) return;

        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !detectionBusyRef.current) {
          detectionBusyRef.current = true;
          try {
            const results = await detector.detect(video);
            const detectedCode = results[0]?.rawValue;
            if (detectedCode) {
              isRunning = false;
              stopCamera();
              setCameraMessage("Barcode terbaca. Kamera sudah dimatikan.");
              await submitCode(detectedCode);
              return;
            }
          } catch {
            setCameraMessage("Barcode belum terbaca. Tahan kamera tetap stabil.");
          } finally {
            detectionBusyRef.current = false;
          }
        }

        animationFrameRef.current = window.requestAnimationFrame(() => void scanFrame());
      };

      animationFrameRef.current = window.requestAnimationFrame(() => void scanFrame());
    } catch (error) {
      stopCamera();
      const denied = error instanceof DOMException && error.name === "NotAllowedError";
      setCameraMessage(
        denied
          ? "Izin kamera ditolak. Ubah izin browser atau masukkan kode secara manual."
          : "Kamera belum dapat dibuka. Masukkan kode secara manual.",
      );
    }
  }

  async function fillActiveDemoCode() {
    setSubmitState("idle");
    setSubmitMessage("");
    try {
      const response = await fetch(`${apiUrl}/attendance/barcode/session`, { cache: "no-store" });
      if (!response.ok) throw new Error();
      const result = (await response.json()) as { session: { code: string; active: boolean } };
      if (!result.session.active) {
        setSubmitState("error");
        setSubmitMessage("Guru belum membuka sesi absensi.");
        return;
      }
      setCode(result.session.code);
      setSubmitMessage("Kode demo aktif sudah diisi. Tekan kirim kode untuk melanjutkan.");
    } catch {
      setSubmitState("error");
      setSubmitMessage("Kode demo aktif belum dapat diambil.");
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitCode(code);
  }

  return (
    <section className="barcode-attendance" aria-labelledby="student-barcode-title">
      <div className="barcode-attendance-heading">
        <div>
          <span>Absensi pagi</span>
          <h2 id="student-barcode-title">Pindai barcode kelas</h2>
        </div>
        <span className="barcode-demo-chip">Demo</span>
      </div>

      <div className={`camera-stage ${isCameraActive ? "is-active" : ""}`}>
        <video ref={videoRef} muted playsInline aria-label="Pratinjau kamera pemindai barcode" />
        <div className="camera-frame" aria-hidden="true" />
        {!isCameraActive && <span aria-hidden="true">CODE 128</span>}
      </div>

      <p className="camera-message" role="status">
        {cameraMessage}
      </p>

      <div className="scanner-actions">
        <button
          type="button"
          className="family-primary"
          onClick={isCameraActive ? stopCamera : startCamera}
        >
          {isCameraActive ? "Matikan kamera" : "Buka pemindai"}
        </button>
      </div>

      <div className="manual-code-divider">
        <span>atau masukkan kode</span>
      </div>

      <form className="manual-code-form" onSubmit={handleSubmit}>
        <label htmlFor="attendance-code">Kode sesi</label>
        <div>
          <input
            id="attendance-code"
            name="attendance-code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value.toUpperCase());
              setSubmitState("idle");
              setSubmitMessage("");
            }}
            autoComplete="off"
            inputMode="text"
            placeholder="Contoh: SEL-8A-A1B2"
          />
          <button type="submit" className="family-primary" disabled={submitState === "submitting"}>
            {submitState === "submitting" ? "Mengirim…" : "Kirim kode"}
          </button>
        </div>
        <small>Kode berlaku singkat dan hanya untuk sesi kelas yang sedang aktif.</small>
      </form>

      <button type="button" className="demo-code-helper" onClick={fillActiveDemoCode}>
        Isi kode demo aktif
      </button>

      {submitMessage && (
        <div
          className={`scan-result scan-result-${submitState}`}
          role={submitState === "error" ? "alert" : "status"}
        >
          <strong>
            {submitState === "accepted"
              ? "Berhasil dipindai"
              : submitState === "duplicate"
                ? "Sudah tercatat"
                : submitState === "error"
                  ? "Belum berhasil"
                  : "Informasi demo"}
          </strong>
          <p>{submitMessage}</p>
        </div>
      )}

      <p className="attendance-privacy-copy">
        Kamera dipakai hanya saat pemindai terbuka. Absensi ini tidak meminta lokasi GPS.
      </p>
    </section>
  );
}
