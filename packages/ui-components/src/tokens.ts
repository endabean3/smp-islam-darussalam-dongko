/**
 * Token netral-platform.
 *
 * shadcn/ui adalah web (Radix + Tailwind DOM) dan TIDAK berjalan di
 * React Native. Yang dibagikan lintas platform adalah TOKEN, bukan
 * komponen: `apps/mobile` mengonsumsi objek ini lewat NativeWind/
 * StyleSheet dan membangun komponennya sendiri.
 *
 * Nilai di sini WAJIB identik dengan tokens.css.
 * Lihat docs/04-ux-ui/design-system.md §2.1.
 */

export const color = {
  navy900: "#0f2440",
  navy700: "#1b3a5c",
  blue600: "#2563eb",
  blue500: "#3b82f6",
  blue50: "#eff6ff",

  neutral900: "#111827",
  neutral600: "#4b5563",
  neutral400: "#9ca3af",
  neutral300: "#d1d5db",
  neutral100: "#f3f4f6",
  neutral0: "#ffffff",
} as const;

/**
 * Status kehadiran.
 * `base` untuk fill/titik/border (>=3:1), `text` untuk label (>=4.5:1).
 * Memakai `base` sebagai warna teks adalah bug aksesibilitas.
 */
export const attendanceStatus = {
  present: { base: "#16a34a", text: "#15803d", bg: "#f0fdf4" },
  late: { base: "#d97706", text: "#b45309", bg: "#fffbeb" },
  excused: { base: "#0891b2", text: "#0e7490", bg: "#ecfeff" },
  unexplained: { base: "#dc2626", text: "#b91c1c", bg: "#fef2f2" },
  unknown: { base: "#9ca3af", text: "#4b5563", bg: "#f3f4f6" },
} as const;

export type AttendanceStatus = keyof typeof attendanceStatus;

/** Label bahasa Indonesia — satu sumber kebenaran lintas platform. */
export const attendanceLabel: Record<AttendanceStatus, string> = {
  present: "Hadir",
  late: "Terlambat",
  excused: "Izin",
  unexplained: "Alpa",
  unknown: "Belum tercatat",
};

/**
 * Warna tingkat intervensi — HANYA dashboard staf.
 * Dilarang muncul di portal orang tua atau app siswa (PRD §4.3).
 */
export const tierColor = {
  tier1: "#16a34a",
  tier2: "#d97706",
  tier3: "#dc2626",
} as const;

export const space = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
} as const;

export const radius = { sm: 4, md: 8, lg: 12, full: 9999 } as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
} as const;

/** Target sentuh minimum (px). */
export const touchMin = 44;
