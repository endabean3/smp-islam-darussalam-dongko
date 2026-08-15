import type { Metadata } from "next";
import "./globals.css";
import "./school-home.css";

export const metadata: Metadata = {
  title: "SMP Islam Darussalam Dongko | Sekolah Islam di Trenggalek",
  description:
    "Profil, informasi pendaftaran, dan kontak resmi SMP Islam Darussalam Dongko, Kabupaten Trenggalek, Jawa Timur.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "SMP Islam Darussalam Dongko",
    description:
      "Profil, informasi pendaftaran, dan kontak resmi SMP Islam Darussalam Dongko, Kabupaten Trenggalek, Jawa Timur.",
    images: [
      {
        url: "/images/banner.svg",
        width: 1200,
        height: 630,
        alt: "SMP Islam Darussalam Dongko Banner",
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
