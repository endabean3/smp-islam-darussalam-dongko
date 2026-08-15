import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { z } from "zod";

type DeviceSource = "nfc" | "rfid";

type AdapterState = {
  source: DeviceSource;
  label: string;
  interface: string;
  connected: boolean;
  lastSeenAt: string;
};

type AttendanceSignal = {
  id: string;
  source: DeviceSource;
  studentId: string;
  studentName: string;
  credentialLabel: string;
  terminal: string;
  occurredAt: string;
  status: "pending_review";
};

type JourneyStatus = "not_started" | "active" | "delayed" | "lost_signal" | "arrived";

type TrackerJourney = {
  id: string;
  studentId: string;
  studentName: string;
  status: JourneyStatus;
  consentVerified: boolean;
  source: "device" | "simulation";
  startedAt: string | null;
  updatedAt: string | null;
  arrivedAt: string | null;
  accuracy: number | null;
  areaLabel: string;
  storesCoordinates: false;
};

const tapSchema = z.object({
  source: z.enum(["nfc", "rfid"]),
  tagId: z.string().trim().min(4).max(120),
  studentId: z.string().trim().min(3).max(40),
  studentName: z.string().trim().min(2).max(80),
  terminal: z.string().trim().min(2).max(80).default("Terminal gerbang utama"),
});

const adapterSchema = z.object({ source: z.enum(["nfc", "rfid"]) });

const journeyStartSchema = z.object({
  consent: z.literal(true),
  source: z.enum(["device", "simulation"]),
  accuracy: z.number().finite().positive().max(10_000).nullable().default(null),
  studentId: z.string().trim().min(3).max(40).default("STUDENT-DEMO-8A-12"),
  studentName: z.string().trim().min(2).max(80).default("Nabila Putri"),
});

const journeyEventSchema = z.object({
  event: z.enum(["heartbeat", "delayed", "lost_signal", "arrived"]),
  accuracy: z.number().finite().positive().max(10_000).nullable().optional(),
});

function nowIso() {
  return new Date().toISOString();
}

function emptyJourney(): TrackerJourney {
  return {
    id: "JRN-DEMO-001",
    studentId: "STUDENT-DEMO-8A-12",
    studentName: "Nabila Putri",
    status: "not_started",
    consentVerified: false,
    source: "simulation",
    startedAt: null,
    updatedAt: null,
    arrivedAt: null,
    accuracy: null,
    areaLabel: "Lokasi tidak dibagikan",
    storesCoordinates: false,
  };
}

let adapters: Record<DeviceSource, AdapterState> = {
  nfc: {
    source: "nfc",
    label: "NFC terminal",
    interface: "Android NDEF / adapter API",
    connected: true,
    lastSeenAt: nowIso(),
  },
  rfid: {
    source: "rfid",
    label: "RFID gate reader",
    interface: "USB / LAN adapter",
    connected: true,
    lastSeenAt: nowIso(),
  },
};

let signals: AttendanceSignal[] = [];
let journey = emptyJourney();

@Controller("devices")
export class DeviceOperationsController {
  @Get("overview")
  getOverview() {
    return { adapters, signals, journey };
  }

  @Post("adapters/toggle")
  toggleAdapter(@Body() body: unknown) {
    const parsed = adapterSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException("Adapter perangkat tidak valid.");

    const current = adapters[parsed.data.source];
    adapters = {
      ...adapters,
      [parsed.data.source]: {
        ...current,
        connected: !current.connected,
        lastSeenAt: nowIso(),
      },
    };
    return { adapters, signals, journey };
  }

  @Post("attendance-signals")
  receiveAttendanceSignal(@Body() body: unknown) {
    const parsed = tapSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException("Sinyal kartu tidak valid.");

    const adapter = adapters[parsed.data.source];
    if (!adapter.connected) {
      throw new BadRequestException(`${adapter.label} sedang tidak terhubung.`);
    }

    const recentDuplicate = signals.find(
      (item) =>
        item.studentId === parsed.data.studentId &&
        item.source === parsed.data.source &&
        Date.now() - new Date(item.occurredAt).getTime() < 60_000,
    );
    if (recentDuplicate) return { accepted: true, duplicate: true, signal: recentDuplicate };

    const maskedId = parsed.data.tagId.slice(-4).toUpperCase();
    const signal: AttendanceSignal = {
      id: `DEVICE-${String(signals.length + 1).padStart(3, "0")}`,
      source: parsed.data.source,
      studentId: parsed.data.studentId,
      studentName: parsed.data.studentName,
      credentialLabel: `${parsed.data.source.toUpperCase()} •••• ${maskedId}`,
      terminal: parsed.data.terminal,
      occurredAt: nowIso(),
      status: "pending_review",
    };
    signals = [signal, ...signals].slice(0, 12);
    adapters = {
      ...adapters,
      [parsed.data.source]: { ...adapter, lastSeenAt: signal.occurredAt },
    };

    return { accepted: true, duplicate: false, signal };
  }

  @Post("gps/journey/start")
  startJourney(@Body() body: unknown) {
    const parsed = journeyStartSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException("Sesi GPS memerlukan persetujuan yang valid.");
    }

    const timestamp = nowIso();
    journey = {
      id: `JRN-${Date.now()}`,
      studentId: parsed.data.studentId,
      studentName: parsed.data.studentName,
      status: "active",
      consentVerified: true,
      source: parsed.data.source,
      startedAt: timestamp,
      updatedAt: timestamp,
      arrivedAt: null,
      accuracy: parsed.data.accuracy,
      areaLabel: "Koridor perjalanan sekolah–rumah",
      storesCoordinates: false,
    };
    return { journey };
  }

  @Post("gps/journey/event")
  updateJourney(@Body() body: unknown) {
    const parsed = journeyEventSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException("Event perjalanan tidak valid.");
    if (journey.status === "not_started") {
      throw new BadRequestException("Belum ada sesi perjalanan aktif.");
    }

    const timestamp = nowIso();
    const nextStatus: JourneyStatus =
      parsed.data.event === "heartbeat" ? "active" : parsed.data.event;
    journey = {
      ...journey,
      status: nextStatus,
      updatedAt: timestamp,
      arrivedAt: nextStatus === "arrived" ? timestamp : journey.arrivedAt,
      accuracy: parsed.data.accuracy ?? journey.accuracy,
      areaLabel:
        nextStatus === "arrived"
          ? "Sesi ditutup setelah status tiba"
          : nextStatus === "lost_signal"
            ? "Sinyal perangkat tidak tersedia"
            : "Koridor perjalanan sekolah–rumah",
    };
    return { journey };
  }

  @Post("gps/journey/reset")
  resetJourney() {
    journey = emptyJourney();
    return { journey };
  }
}
