import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, type NestFastifyApplication } from "@nestjs/platform-fastify";
import { z } from "zod";
import { AppModule } from "./app.module.js";

const environmentSchema = z.object({
  API_PORT: z.coerce.number().int().positive().default(4000),
  DEMO_DATA_ONLY: z.literal("true").default("true"),
});

async function bootstrap() {
  const environment = environmentSchema.parse(process.env);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    logger: ["error", "warn", "log"],
  });

  app.setGlobalPrefix("api/v1");
  app.enableCors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  });
  app.enableShutdownHooks();
  await app.listen(environment.API_PORT, "0.0.0.0");
}

void bootstrap();
