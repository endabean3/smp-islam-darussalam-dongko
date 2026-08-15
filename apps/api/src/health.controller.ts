import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return { status: "ok", service: "selaras-api", dataPolicy: "demo-only" } as const;
  }
}
