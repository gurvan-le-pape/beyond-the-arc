// src/backend/main.ts
import "./instrument";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino as the application logger
  app.useLogger(app.get(Logger));

  // Enable CORS for the frontend
  app.enableCors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL || ""],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.setGlobalPrefix("api", { exclude: ["/metrics"] });

  // Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle("Beyond the Arc API")
    .setDescription(
      "API documentation for a basketball federation management platform, inspired by the FFBB",
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // useGlobalPrefix serves the UI at /api/docs — the only path prefix Nginx
  // proxies to the backend, so Swagger is reachable in production.
  SwaggerModule.setup("docs", app, document, { useGlobalPrefix: true });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Without this Nest registers no signal listeners at all, so the SIGTERM
  // every `docker compose up -d` sends kills the process outright:
  // PrismaService.onModuleDestroy never runs and in-flight requests are cut.
  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 4000);
}

bootstrap().catch((error) => {
  // The Pino logger may not be wired up yet — write straight to stderr so
  // startup failures are never silent (a swallowed error here cost us a
  // prod incident diagnosis).
  console.error("Fatal error during bootstrap:", error);
  process.exit(1);
});
