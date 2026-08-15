import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { z } from "zod";

type ScanRecord = {
  id: string;
  studentId: string;
  studentName: string;
  scannedAt: string;
  status: "pending_review";
};

type DemoSession = {
  active: boolean;
  className: string;
  code: string;
  createdAt: string;
  expiresAt: string;
};

const scanSchema = z.object({
  code: z.string().trim().min(6).max(64),
  studentId: z.string().trim().min(3).max(40),
  studentName: z.string().trim().min(2).max(80),
});

function createSession(): DemoSession {
  const now = new Date();
  const expires = new Date(now.getTime() + 10 * 60 * 1000);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return {
    active: true,
    className: "Kelas 8A",
    code: `SEL-8A-${suffix}`,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  };
}

let session = createSession();
let scans: ScanRecord[] = [];

@Controller("attendance/barcode")
export class BarcodeAttendanceController {
  @Get("session")
  getSession() {
    return { session, scans };
  }

  @Post("session/rotate")
  rotateSession() {
    session = createSession();
    scans = [];
    return { session, scans };
  }

  @Post("session/close")
  closeSession() {
    session = { ...session, active: false };
    return { session, scans };
  }

  @Post("session/open")
  openSession() {
    session = createSession();
    scans = [];
    return { session, scans };
  }

  @Post("scan")
  scan(@Body() body: unknown) {
    const parsed = scanSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException("Data pemindaian tidak valid.");
    }

    if (!session.active) {
      throw new BadRequestException("Sesi absensi sudah ditutup.");
    }

    if (new Date(session.expiresAt).getTime() < Date.now()) {
      throw new BadRequestException("Kode sudah kedaluwarsa. Minta kode baru kepada guru.");
    }

    if (parsed.data.code !== session.code) {
      throw new BadRequestException("Kode tidak cocok dengan sesi kelas yang aktif.");
    }

    const existing = scans.find((item) => item.studentId === parsed.data.studentId);
    if (existing) {
      return { accepted: true, duplicate: true, scan: existing };
    }

    const record: ScanRecord = {
      id: `SCAN-${String(scans.length + 1).padStart(3, "0")}`,
      studentId: parsed.data.studentId,
      studentName: parsed.data.studentName,
      scannedAt: new Date().toISOString(),
      status: "pending_review",
    };
    scans = [record, ...scans];

    return { accepted: true, duplicate: false, scan: record };
  }
}
