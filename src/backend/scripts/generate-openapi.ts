// src/backend/scripts/generate-openapi.ts
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { METRICS_PATH } from "@common/constants";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "../app.module";

/**
 * Writes the OpenAPI document to docs/openapi.json at the repository root.
 * The path is fixed (derived from this file's location, no CLI input) so
 * the committed snapshot and the CI drift check always target the same file.
 *
 * Run it from the nest-CLI build so the swagger plugin metadata is
 * included — ts-node output would silently lack the inferred schemas:
 *
 *   npm run build && node dist/scripts/generate-openapi.js
 *
 * The app is created but never init'd, so no database is needed.
 */
async function generate(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });

  // Must match main.ts. The prefix is part of the contract, not a deployment
  // detail: without it every `paths` key here is missing the `/api` the
  // deployed API actually serves, and the document describes 34 routes that
  // do not exist. The `openapi-drift` CI job cannot catch that — both sides
  // of its diff come from this same script, so they agree with each other
  // while disagreeing with production.
  app.setGlobalPrefix("api", { exclude: [METRICS_PATH] });

  // Keep in sync with the DocumentBuilder config in main.ts.
  const config = new DocumentBuilder()
    .setTitle("Beyond the Arc API")
    .setDescription(
      "API documentation for a basketball federation management platform, inspired by the FFBB",
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Compiled location is src/backend/dist/scripts — four levels below the
  // repository root.
  const outPath = resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "docs",
    "openapi.json",
  );
  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`OpenAPI document written to ${outPath}`);

  await app.close();
  process.exit(0);
}

generate().catch((error) => {
  console.error("Fatal error while generating the OpenAPI document:", error);
  process.exit(1);
});
