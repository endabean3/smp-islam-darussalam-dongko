import type { Metadata } from "next";
import { DashboardDemoClient } from "./DashboardDemoClient";

export const metadata: Metadata = {
  title: "Demo Sekolah | Selaras",
  description: "Demo interaktif kehadiran, sinkronisasi offline, dan tindak lanjut keluarga.",
};

export default function DashboardDemo() {
  return <DashboardDemoClient />;
}
