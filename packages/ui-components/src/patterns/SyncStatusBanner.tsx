import { cn } from "../lib/utils";

/**
 * Banner status sinkronisasi.
 *
 * PRD NF-OPS-01 mensyaratkan antrean event offline. Konsekuensinya UI
 * wajib punya bahasa visual eksplisit untuk tersimpan lokal / menunggu
 * sinkronisasi / tersinkron — kalau tidak, guru tidak pernah tahu apakah
 * absensi yang baru ia tandai benar-benar sampai ke server.
 *
 * Nada pesan sengaja menenangkan: kehilangan koneksi di Dongko adalah
 * kondisi normal, bukan kesalahan pengguna.
 */

export type SyncState = "synced" | "pending" | "offline";

export interface SyncStatusBannerProps {
  state: SyncState;
  /** Jumlah event yang masih mengantre. Ditampilkan pada pending/offline. */
  pendingCount?: number;
  /** Waktu sinkronisasi terakhir berhasil, sudah diformat. */
  lastSyncedAt?: string;
  className?: string;
}

export function SyncStatusBanner({
  state,
  pendingCount = 0,
  lastSyncedAt,
  className,
}: SyncStatusBannerProps) {
  const content: Record<SyncState, { dot: string; tone: string; msg: string }> = {
    synced: {
      dot: "bg-[var(--status-present)]",
      tone: "bg-[var(--status-present-bg)] text-[var(--status-present-text)]",
      msg: lastSyncedAt
        ? `Semua data tersimpan. Terakhir tersinkron ${lastSyncedAt}.`
        : "Semua data tersimpan.",
    },
    pending: {
      dot: "bg-[var(--status-late)]",
      tone: "bg-[var(--status-late-bg)] text-[var(--status-late-text)]",
      msg: `${pendingCount} catatan menunggu dikirim. Tetap aman tersimpan di perangkat.`,
    },
    offline: {
      dot: "bg-[var(--status-unknown)]",
      tone: "bg-[var(--status-unknown-bg)] text-[var(--neutral-600)]",
      msg:
        pendingCount > 0
          ? `Tidak ada koneksi. ${pendingCount} catatan tersimpan di perangkat dan akan terkirim otomatis.`
          : "Tidak ada koneksi. Anda tetap dapat menandai kehadiran.",
    },
  };

  const { dot, tone, msg } = content[state];

  return (
    <div
      // polite: perubahan status jangan memotong pekerjaan guru
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm", tone, className)}
    >
      {/* Titik warna murni dekoratif — makna dibawa oleh teks di sebelahnya */}
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dot)} />
      <span>{msg}</span>
    </div>
  );
}
