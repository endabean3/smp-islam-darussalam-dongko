import { Module } from "@nestjs/common";
import { BarcodeAttendanceController } from "./barcode-attendance.controller.js";
import { DeviceOperationsController } from "./device-operations.controller.js";
import { HealthController } from "./health.controller.js";

@Module({
  controllers: [HealthController, BarcodeAttendanceController, DeviceOperationsController],
})
export class AppModule {}
