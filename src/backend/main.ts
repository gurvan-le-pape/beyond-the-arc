// src/backend/main.ts
import { AllExceptionsFilter } from "@common/filters/all-exceptions.filter";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { LoggingInterceptor, TransformInterceptor } from "./common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the frontend
  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Swagger/OpenAPI setup
  const config = new DocumentBuilder()
    .setTitle("Beyond the Arc API")
    .setDescription(
      "API documentation for a basketball federation management platform, inspired by the FFBB",
    )
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors - REGISTER ONCE HERE
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(4000); // Backend on port 4000
}

bootstrap().catch(() => {
  process.exit(1);
});
