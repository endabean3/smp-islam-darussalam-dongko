// React 19 tidak lagi menyediakan namespace JSX global — pakai ReactElement.
import type { ReactElement, SVGProps } from "react";
import { cn } from "../lib/utils";
import { type AttendanceStatus, attendanceLabel } from "../tokens";

/**
 * Badge status kehadiran.
 *
 * WCAG 1.4.1 — warna tidak boleh menjadi satu-satunya pembawa makna.
 * Sekitar 8% laki-laki mengalami buta warna merah-hijau, sementara
 * status hadir/alpa kita justru hijau vs merah. Karena itu setiap
 * status WAJIB membawa tiga sinyal: warna + ikon + label teks.
 *
 * Komponen ini sengaja TIDAK menyediakan prop untuk menyembunyikan
 * label atau ikon. Kalau ruang sempit, kecilkan `size`, jangan
 * hilangkan pembawa makna.
 *
 * Ikon berupa inline SVG (bukan lucide-react) agar tidak menambah
 * dependency untuk lima ikon — anggaran JS awal <=150KB (design-system.md §5).
 */

type IconProps = SVGProps<SVGSVGElement>;

const iconBase = {
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Centang — Hadir */
const CheckIcon = (p: IconProps) => (
  <svg {...iconBase} {...p} aria-hidden="true" focusable="false">
    <path d="M3 8.5l3.5 3.5L13 5" />
  </svg>
);

/** Jam — Terlambat */
const ClockIcon = (p: IconProps) => (
  <svg {...iconBase} {...p} aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.5V8l2.5 1.5" />
  </svg>
);

/** Dokumen — Izin (berketerangan) */
const DocIcon = (p: IconProps) => (
  <svg {...iconBase} {...p} aria-hidden="true" focusable="false">
    <path d="M4 2h5l3 3v9H4z" />
    <path d="M9 2v3h3" />
  </svg>
);

/** Seru — Alpa (tanpa keterangan) */
const AlertIcon = (p: IconProps) => (
  <svg {...iconBase} {...p} aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 5v3.5" />
    <path d="M8 11h.01" />
  </svg>
);

/** Garis putus — Belum tercatat. Netral, bukan tuduhan. */
const DashIcon = (p: IconProps) => (
  <svg {...iconBase} {...p} aria-hidden="true" focusable="false">
    <circle cx="8" cy="8" r="6.25" strokeDasharray="3 2.5" />
  </svg>
);

const config: Record<
  AttendanceStatus,
  { Icon: (p: IconProps) => ReactElement; className: string }
> = {
  present: {
    Icon: CheckIcon,
    className:
      "bg-[var(--status-present-bg)] text-[var(--status-present-text)] ring-[var(--status-present)]",
  },
  late: {
    Icon: ClockIcon,
    className:
      "bg-[var(--status-late-bg)] text-[var(--status-late-text)] ring-[var(--status-late)]",
  },
  excused: {
    Icon: DocIcon,
    className:
      "bg-[var(--status-excused-bg)] text-[var(--status-excused-text)] ring-[var(--status-excused)]",
  },
  unexplained: {
    Icon: AlertIcon,
    className:
      "bg-[var(--status-unexplained-bg)] text-[var(--status-unexplained-text)] ring-[var(--status-unexplained)]",
  },
  unknown: {
    Icon: DashIcon,
    className:
      "bg-[var(--status-unknown-bg)] text-[var(--status-unknown-text)] ring-[var(--status-unknown)]",
  },
};

export interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  /** Ganti label default, mis. "Izin (sakit)". Tidak boleh string kosong. */
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export function AttendanceStatusBadge({
  status,
  label,
  size = "md",
  className,
}: AttendanceStatusBadgeProps) {
  const { Icon, className: tone } = config[status];
  const text = label?.trim() || attendanceLabel[status];
  const iconPx = size === "sm" ? 12 : 14;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        tone,
        className,
      )}
    >
      <Icon width={iconPx} height={iconPx} />
      {text}
    </span>
  );
}
