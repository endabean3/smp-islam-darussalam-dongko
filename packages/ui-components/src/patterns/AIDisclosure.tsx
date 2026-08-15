import type { ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Pembungkus wajib untuk setiap output AI yang menyangkut siswa.
 *
 * PRD NF-AI-01: setiap output AI wajib menyertakan alasan, data pendukung,
 * tingkat keyakinan, dan tombol tinjau. Komponen ini menegakkan janji itu
 * di level kode — selama seluruh output AI harus melewati komponen ini,
 * mustahil ada saran AI yang tampil polos tanpa penjelasan. Pagar kebijakan
 * menjadi pagar teknis.
 *
 * Prop `reason`, `supportingData`, dan `confidence` sengaja WAJIB. Kalau
 * sebuah fitur AI tidak bisa menyediakannya, fitur itu belum boleh tampil
 * ke pengguna.
 *
 * Batasan yang tidak boleh dilanggar (PRD NF-AI-02/03):
 * - Tidak ada keputusan disiplin, kelulusan, atau sanksi otomatis.
 * - AI dilarang mendiagnosis kesehatan mental, memberi label karakter,
 *   atau membuat daftar hitam siswa.
 * Komponen ini menampilkan OBSERVASI dan SARAN, tidak pernah vonis.
 */

export type AIConfidence = "low" | "medium" | "high";

const confidenceLabel: Record<AIConfidence, string> = {
  low: "Keyakinan rendah",
  medium: "Keyakinan sedang",
  high: "Keyakinan tinggi",
};

const confidenceTone: Record<AIConfidence, string> = {
  low: "bg-[var(--status-unknown-bg)] text-[var(--status-unknown-text)]",
  medium: "bg-[var(--status-late-bg)] text-[var(--status-late-text)]",
  high: "bg-[var(--status-excused-bg)] text-[var(--status-excused-text)]",
};

export interface AIDisclosureProps {
  /** Saran/ringkasan AI. */
  children: ReactNode;
  /** Mengapa AI sampai pada kesimpulan ini. Bahasa manusia, bukan jargon model. */
  reason: string;
  /** Data konkret yang mendasari, mis. ["Alpa 3 hari (1–14 Agu)", "2 tugas terlambat"]. */
  supportingData: string[];
  confidence: AIConfidence;
  /** Membuka peninjauan manusia. Wajib — tanpa ini output tidak boleh tampil. */
  onReview: () => void;
  reviewLabel?: string;
  className?: string;
}

export function AIDisclosure({
  children,
  reason,
  supportingData,
  confidence,
  onReview,
  reviewLabel = "Tinjau",
  className,
}: AIDisclosureProps) {
  return (
    <section
      aria-label="Saran dari AI, memerlukan peninjauan manusia"
      className={cn(
        "rounded-lg border border-[var(--neutral-300)] bg-[var(--neutral-0)] p-4",
        className,
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded bg-[var(--brand-blue-50)] px-2 py-0.5 text-xs font-medium text-[var(--brand-blue-600)]">
          Saran AI
        </span>
        <span className={cn("rounded px-2 py-0.5 text-xs font-medium", confidenceTone[confidence])}>
          {confidenceLabel[confidence]}
        </span>
      </div>

      <div className="text-[var(--neutral-900)]">{children}</div>

      <div className="mt-3 border-t border-[var(--neutral-300)] pt-3">
        <p className="text-sm text-[var(--neutral-600)]">
          <span className="font-medium text-[var(--neutral-900)]">Dasar: </span>
          {reason}
        </p>

        {supportingData.length > 0 && (
          <ul className="mt-2 list-inside list-disc text-sm text-[var(--neutral-600)]">
            {supportingData.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onReview}
          className="rounded-md bg-[var(--brand-blue-600)] px-4 text-sm font-medium text-[var(--neutral-0)] hover:bg-[var(--brand-navy-700)]"
        >
          {reviewLabel}
        </button>
        <p className="text-xs text-[var(--neutral-600)]">
          Keputusan tetap pada guru atau petugas yang berwenang.
        </p>
      </div>
    </section>
  );
}
