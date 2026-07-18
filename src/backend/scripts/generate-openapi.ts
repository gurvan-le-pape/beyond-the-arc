// src/backend/scripts/generate-openapi.ts
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "../app.module";

/**
 * Writes the OpenAPI document to the path given as first CLI argument
 * (resolved against the current working directory).
 *
 * Run it from the nest-CLI build so the swagger plugin metadata is
 * included — ts-node output would silently lack the inferred schemas:
 *
 *   npm run build && node dist/scripts/generate-openapi.js ../../docs/openapi.json
 *
 * The app is created but never init'd, so no database is needed.
 */
async function generate(): Promise<void> {
  const outArg = process.argv[2];
  if (!outArg) {
    console.error("Usage: generate-openapi <output-path>");
    process.exit(2);
  }

  const app = await NestFactory.create(AppModule, { logger: false });

  // Keep in sync with the DocumentBuilder config in main.ts.
  const config = new DocumentBuilder()
    .setTitle("Beyond the Arc API")
    .setDescription(
      "API documentation for a basketball federation management platform, inspired by the FFBB",
    )
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outPath = resolve(process.cwd(), outArg);

  // The output path comes from the CLI: refuse anything that escapes the
  // repository (two levels above src/backend) or isn't a JSON file.
  const repoRoot = resolve(__dirname, "..", "..", "..", "..");
  if (!outPath.startsWith(`${repoRoot}/`) || !outPath.endsWith(".json")) {
    console.error(
      `Refusing to write outside the repository or to a non-JSON path: ${outPath}`,
    );
    process.exit(2);
  }

  writeFileSync(outPath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`OpenAPI document written to ${outPath}`);

  await app.close();
  process.exit(0);
}

generate().catch((error) => {
  console.error("Fatal error while generating the OpenAPI document:", error);
  process.exit(1);
});
