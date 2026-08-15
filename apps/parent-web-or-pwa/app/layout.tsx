import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Demo Keluarga | Selaras",
  description: "Demo siswa dan orang tua untuk kehadiran serta Safe Journey berbasis persetujuan.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
