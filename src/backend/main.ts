// src/backend/main.ts
import "./instrument";

import { REQUEST_ID_HEADER } from "@common/constants";
import { resolveCorsOrigins } from "@common/utils";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "nestjs-pino";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Use Pino as the application logger
  app.useLogger(app.get(Logger));

  // Enable CORS for the frontend. No `credentials`: the API has no auth, sets
  // no cookies and reads no Authorization header, so a credentialed contract
  // would be claiming a trust relationship that does not exist.
  // `exposedHeaders` is what lets a browser read the correlation id off a
  // response. It changes nothing in production, where Nginx serves the app and
  // the API under one origin and no CORS rule applies — it exists so the
  // header is readable in dev, the one configuration where the browser really
  // is cross-origin (page on :3000, API on :4000). Without it the id would
  // work in production and silently read `null` on localhost, which is where
  // anyone would be debugging.
  app.enableCors({
    origin: resolveCorsOrigins(),
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: [REQUEST_ID_HEADER],
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
